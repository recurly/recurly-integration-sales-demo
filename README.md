# Recurly-integration-sales-demo
The purpose of this Recurly Integration Sales Demo (RISD) repo is to be an ongoing showcase of Recurly implementation with RJS customized for a potential merchants utilizing different client libraries. Recurly Sales Team, Enablement Managers, Solution Arichtects, etc. can provide code snippets of said implementations and third party integrations to prospective and existing merchants, streamlining and enabling a better integration experience with Recurly.

# Set up
Before being able to use and/or share the repo with Recurly merchants, you'll first need to make sure you have the repo properly set up on your local computer to ensure you understand the code yourself and are able to address any questions about the repo from merchants.

## Don't know how to GIT? Read below: 
If you're familar with Github and pulling down repos, you can skip ahead to the next section to adjust your configurations inside the repo for a successful demostration. You can also skip ahead if you have no intention of utilizing the entire repository and will instead utilize specific implementations and integrations from the zip files created from this repo. 

Otherwise, if you don't have a github account, you'll need to create an account to clone the repo. Once you have an account set up with your Recurly SSH, you'll be able to pull the repo down on to your local computer with the following instrutions: 

1. At the very top of this page, click the green <> Code dropdown
2. Then, click "SSH" to copy the URL for the repository
3. Open your terminal and change the current working directory to the location where you want the cloned directory
4. Type git clone, and then paste the URL you copied earlier.
    1. it should be something like `git clone git@github.com:recurly-se-demo/recurly-integration-sales-demo.git`
5. Press enter and you should now have this repo on your local computer. 

If you have issues with the above instructions, you can go to [github docs](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) for a more detail explanation. 

## Configurations and Starting the Demo - the repo(or zip file) is on my computer but nothing is working!
For security reasons, we don't want to have merchants' (and our own) information, such as API keys, lying around on a public repo. Eventually, the configurations will also allow Recurlians to customize the demo site to fit the theme and aesthetic of the merchant's design principles, but currently configurations only allow you to create accounts, billing information, and subscriptions on a particular subdomain. 

 **Note:** RISD currently only works with a Ruby backend, with Node.js coming soon.

With the repo/zip file expanded on your computer, you should have a file in the directory named ".env_example". To set up your configurations: 

- [] Use the ".env_example" file to create your own ".env" file in the root of the directory. 
- [] fill in the RECURLY_SUBDOMAIN= with the subdomain you're demoing
- [] fill in the RECURLY_API_KEY= with the api key for the site you're using
- [] fill in the RECURLY_PUBLIC_KEY= with the RJS public key 

<font color="red">Please be careful to never push the configuration values up to the repo.</font> If you kept them in the .env file all should be good.

You should now have the configurations properly set up you can now start the process to show off Recurly and RJS. 

1. From the terminal go into the api folder: `cd api`
2. Still in the terminal, go into the folder for the backend you're using with the demo, ex. `cd ruby`
3. Now that you're in the folder for the backend, all you need to do is the start the server, ex. `ruby app.rb`  
4. With the server started, you can now show off the demo. We're using localhost port 9001, so you can visit the site(demo) by going to [http://localhost:9001/plans.html](http://localhost:9001/plans.html)

With all of the above completed, you can show a merchant the complete sign up flow from beginning to end in addition to being able to show them how it appears inside the Recurly app. The sales demo will show the plans that exist on the subdomain you provided and you can subscribe new customers to said plans. 

## Make a copy for the merchant
With the repo downloaded and/or the zip file on your computer, you can just as easily create a copy of the demo to share with the merchant for them to customize and enhance on as needed. To start the process: 

1. Run `make zip`.
2. Answer the prompts with the merchant's subdomain and backend they are using.
    1. currently only connected backend is ruby
3. You can then edit the "Configurations and Starting the Demo" portion of this repo and share a version of it with the merchant 