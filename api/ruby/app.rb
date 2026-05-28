# Require sinatra and the recurly gem
require 'sinatra'
require 'json'
require 'recurly'
require 'stripe'
require 'dotenv'
require 'json'
Dotenv.load('../../.env')

# Used to parse URIs
require 'uri'
# Used to create unique account_codes
require 'securerandom'

set :bind, '0.0.0.0'
set :port, ENV['PORT'] || 9001
set :public_folder, '../../public'

enable :logging

client = Recurly::Client.new(api_key: ENV['RECURLY_API_KEY'], region: :us)

# Generic error handling
# Here we log the API error and send the
# customer to the error URL, including an error message
def handle_error(params)
  logger.error params[:error]
  error_uri = URI.parse 'checkout.html'
  query = URI.decode_www_form(String(error_uri.query)) 
  query << ['plan_code', params[:plan_code]]
  query << ['error', params[:error]]
  error_uri.query = URI.encode_www_form(query)
  redirect error_uri.to_s
end

def handle_success(params)
  uri = URI.parse 'success.html'
  query = params.map { |k,v| [k.to_s, v] }
  uri.query = URI.encode_www_form(query)
  puts uri.to_s
  redirect uri.to_s 
end

def url_params(hash)
  hash.map { |k, v| "#{k}=#{v}" }.join('&')
end

# GET plans on subdomain
get '/api/plans' do
  content_type :json

  hash = {}
  plans = client.list_plans(params: params)
  plans.each do |plan|
    hash["#{plan.name}"] = {unit_amount: "#{plan.currencies[0].unit_amount}", code: "#{plan.code}", currency: "#{plan.currencies[0].currency}"}
  end
  hash.to_json
end

post '/api/accounts/new' do
  begin
    client.create_account(body: {
      code: SecureRandom.uuid,
      billing_info: {
        token_id: params['recurly-token']
      }
    })
    redirect success_url
  rescue Recurly::Errors::APIError => e
    handle_error e
  end
end

# POST route to handle a new purchase form
post '/api/purchases/new' do
  # This is not a good idea in production but helpful for debugging
  # These params may contain sensitive information you don't want logged
  logger.info params
  logger.info request.body.read

  recurly_account_code = params['recurly-account-code'] || SecureRandom.uuid

  recurly_token_id = params['recurly-token']
  stripe_confirmation_token = params['stripe-confirmation-token']

  billing_info = if stripe_confirmation_token && !stripe_confirmation_token.empty?
    {
      payment_gateway_references: [{
        token: stripe_confirmation_token,
        reference_type: 'stripe_confirmation_token'
      }],
      first_name: params['first-name'],
      last_name: params['last-name'],
      address: {
        street1: params['address1'],
        street2: params['address2'],
        city: params['city'],
        region: params['region'],
        postal_code: params['postal-code'],
        country: params['country']
      }
    }
  else
    info = { token_id: recurly_token_id }
    unless params.fetch('three-d-secure-token', '').empty?
      info['three_d_secure_action_result_token_id'] = params['three-d-secure-token']
    end
    info
  end

  purchase_create = {
    currency: "USD",
    # This can be an existing account or a new acocunt
    account: {
      code: recurly_account_code,
      first_name: params['first-name'],
      last_name: params['last-name'],
      address: {
        country: params['country'],
        region: params['region']
      },
      billing_info: billing_info
    },
    subscriptions: [
      { plan_code: params['plan-code'] }
    ]
  }

  begin
    purchase = client.create_purchase(body: purchase_create)
    handle_success({
      account_code: purchase.charge_invoice.account.code,
      first_name: params['first-name'],
      last_name: params['last-name']
    })
  rescue Recurly::Errors::TransactionError => e
    txn_error = e.recurly_error.transaction_error
    logger.error "TransactionError: #{e.message} | 3DS token: #{txn_error.three_d_secure_action_token_id} | detail: #{txn_error.inspect}"
    if txn_error.three_d_secure_action_token_id
      hash_params = url_params({
        token_id: recurly_token_id,
        action_token_id: txn_error.three_d_secure_action_token_id,
        account_code: recurly_account_code
      })
      redirect "/3d-secure/authenticate.html##{hash_params}"
    else
      handle_error({ plan_code: params['plan-code'], error: e.message })
    end
  rescue Recurly::Errors::APIError => e
    # Here we may wish to log the API error and send the customer to an appropriate URL, perhaps including an error message
    handle_error({
      plan_code: params['plan-code'],
      error: e.message
    })
  end
end

post '/api/stripe/purchases/new' do
  logger.info "Stripe purchase: #{params['first-name']} #{params['last-name']}"
  Stripe.api_key = ENV['STRIPE_SECRET_KEY']

  payment_method_id = params['stripe-payment-method']
  amount = params['plan-amount'].to_i
  amount = 100 if amount <= 0
  currency = params['plan-currency']&.downcase || 'usd'

  begin
    customer = Stripe::Customer.create({
      name: "#{params['first-name']} #{params['last-name']}",
      payment_method: payment_method_id
    })

    Stripe::PaymentIntent.create({
      amount: amount,
      currency: currency,
      customer: customer.id,
      payment_method: payment_method_id,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    })

    handle_success({
      account_code: customer.id,
      first_name: params['first-name'],
      last_name: params['last-name']
    })
  rescue Stripe::StripeError => e
    handle_error({
      plan_code: params['plan-code'],
      error: e.message
    })
  end
end

# get '/config' do
#   plans = [].tap do |plans|
#     client.list_plans(params: {limit: 200, state: 'active'}).each do |plan|
#       plans << { name: plan.name, unit_amount: plan.currencies[0].unit_amount, code: plan.code, currency: plan.currencies[0].currency}
#     end
#   end

#   config = {
#     publicKey: ENV['RECURLY_PUBLIC_KEY'],
#     plans: plans
#   }
#   content_type :js
#   "window.recurlyConfig = #{config.to_json}"
# end

get '/checkout' do
  send_file File.join(settings.public_folder, 'checkout.html') 
end

get '/' do
  headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
  send_file File.join(settings.public_folder, 'welcome.html')
end

get '/plans' do
 
  plans = [].tap do |plans| 
    client.list_plans(params: {limit: 200, state: 'active'}).each do |plan|
      plan.currencies.each do |currency|
        # if currency.unit_amount > 0 
        plans << { name: plan.name, unit_amount: currency.unit_amount, code: plan.code, currency: currency.currency }
        # end
      end
    end
  end

  currencies = plans.map {|plan| plan[:currency]}.uniq


  config = {
    publicKey: ENV['RECURLY_PUBLIC_KEY'],
    stripePublishableKey: ENV['STRIPE_PUBLISHABLE_KEY'],
    stripeAccountId: ENV['STRIPE_ACCOUNT_ID'],
    plans: plans,
    currencies: currencies
  }
  content_type 'js'
  "window.recurlyConfig = #{config.to_json}"

  
end




#   content_type :json
#   config.to_json
# end





