# Require sinatra and the recurly gem
require 'sinatra'
require 'json'
require 'recurly'

# Used to parse URIs
require 'uri'
# Used to create unique account_codes
require 'securerandom'

set :bind, '0.0.0.0'
set :port, ENV['PORT'] || 9001
set :public_folder, ENV['PUBLIC_DIR_PATH'] || '../../public'

enable :logging

success_url = ENV['SUCCESS_URL']

client = Recurly::Client.new(api_key: ENV['RECURLY_API_KEY'])

# Generic error handling
# Here we log the API error and send the
# customer to the error URL, including an error message
def handle_error e
  logger.error e
  error_uri = URI.parse ENV['ERROR_URL']
  error_query = URI.decode_www_form(String(error_uri.query)) << ['error', e.message]
  error_uri.query = URI.encode_www_form(error_query)
  redirect error_uri.to_s
end
