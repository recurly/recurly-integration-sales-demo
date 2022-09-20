# Require sinatra and the recurly gem
require 'sinatra'
require 'json'
require 'recurly'
require 'pry'
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

client = Recurly::Client.new(api_key: ENV['RECURLY_API_KEY'])

# Generic error handling
# Here we log the API error and send the
# customer to the error URL, including an error message
def handle_error e
  logger.error e
  error_uri = URI.parse ENV['ERROR_URL'] || 'index.html'
  error_query = URI.decode_www_form(String(error_uri.query)) << ['error', e.message]
  error_uri.query = URI.encode_www_form(error_query)
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
  billing_info = { token_id: recurly_token_id }
  # Optionally add a 3D Secure token if one is present. You only need to do this
  # if you are integrating with Recurly's 3D Secure support
  unless params.fetch('three-d-secure-token', '').empty?
    billing_info['three_d_secure_action_result_token_id'] = params['three-d-secure-token']
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

  # subscriptions = params['subscriptions']&.map do |sub_params|
  #   if !sub_params['plan-code'].empty?
  #     { plan_code: sub_params['plan-code'] }
  #   else
  #     nil
  #   end
  # end&.compact
  # # Add subscriptions to the request if there are any
  # purchase_create[:subscriptions] = subscriptions if subscriptions&.any?
  
  # Line Items - TBAdded
  # line_items = params['items']&.map do |item_params|
  #   {
  #     item_code: item_params['item-code'],
  #     revenue_schedule_type: 'at_invoice'
  #   }
  # end
  # # Add line_items to the request if there are any
  # purchase_create[:line_items] = line_items if line_items&.any?

  begin
    purchase = client.create_purchase(body: purchase_create)
    # binding.pry
    handle_success({
      account_code: purchase.charge_invoice.account.code,
      first_name: params['first-name'],
      last_name: params['last-name']
    })
  rescue Recurly::Errors::TransactionError => e
    txn_error = e.recurly_error.transaction_error
    hash_params = url_params({
      token_id: recurly_token_id,
      action_token_id: txn_error.three_d_secure_action_token_id,
      account_code: recurly_account_code
    })
    redirect "/3d-secure/authenticate.html##{hash_params}"
  rescue Recurly::Errors::APIError => e
    # Here we may wish to log the API error and send the customer to an appropriate URL, perhaps including an error message
    handle_error e
  end
end

get '/config' do
  plans = [].tap do |plans|
    client.list_plans(params: {limit: 200, state: 'active'}).each do |plan|
      plans << { code: plan.code, name: plan.name }
    end
  end

  config = {
    publicKey: ENV['RECURLY_PUBLIC_KEY'],
    plans: plans
  }
  content_type :js
  "window.recurlyConfig = #{config.to_json}"
end

get '/checkout' do
  send_file File.join(settings.public_folder, 'checkout.html') 
end

get '/' do
  send_file File.join(settings.public_folder, 'index.html')
end
