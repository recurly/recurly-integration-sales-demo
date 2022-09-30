require 'fileutils'

def ask_user(question)
  puts question
  $stdin.gets.chomp
end

subdomain = ask_user('what is the merchant\'s subdomain?')
backend = ask_user('what backend is the merchant using? [ruby, node]')

unless File.directory?("api/#{backend}")
  puts "backend: #{backend} not a valid option. EXITING."
  exit(1)
end

subdomain_dir = "#{subdomain}_example"

if File.directory?(subdomain_dir)
  FileUtils.rm_rf(subdomain_dir)
end
Dir.mkdir(subdomain_dir)
Dir.mkdir("#{subdomain_dir}/api")

FileUtils.cp('.env_example', subdomain_dir)
FileUtils.cp('.gitignore', subdomain_dir)
FileUtils.cp('docker.env', subdomain_dir)
FileUtils.cp('README.md', subdomain_dir)
FileUtils.cp_r('public/.', "#{subdomain_dir}/public", verbose: true)
FileUtils.cp_r("api/#{backend}/.", "#{subdomain_dir}/api/#{backend}", verbose: true)

system("zip -r #{subdomain_dir}.zip #{subdomain_dir}")

FileUtils.rm_rf(subdomain_dir)

puts '-' * 50
puts 'Copy complete. Please send the zip file to the merchant.'
