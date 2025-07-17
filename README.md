# XUND Web App Integration Guide

XUND Web App is a pre-made implementation of **[XUND APIs](https://xund-api-documentation.scrollhelp.site/xund-api-documentation/latest/general-information)** and it is ready for authorized clients to easily embed Symptom/Illness/Health Check into their website. The following guide is a detailed instruction of embedding the XUND Web App and also provides examples for quick and easy implementation.



Please insert the following snippet into the body of your HTML page where you want to have XUND Web App placed:
```html
<div id="your-container" style="width: 100vw; height: 100vh;">
  <script 
    src="https://public.xund.solutions/embed.js" 
    client-id="***" 
    webapp-code="***"
    auth-code="***" 
  ></script>
</div>
```

You have to pass `client-id`, `webapp-code` and `auth-code` to the script tag. Use the `client-id` and `webapp-code` from the Client Hub, the `auth-code` should be created on your server based on your API Key you got from us via 1Password. A PHP example project with a valid `auth-code` creation can be [found here](example/src/index.php).

If you want to integrate Health Check directly, specify the Health Check App explicitly in the ```web-app-base-url``` attribute of embedder.
```html
<div id="your-container" style="width: 100vw; height: 100vh;">
  <script 
    src="https://public.xund.solutions/embed.js" 
    client-id="***"
    webapp-code="***" 
    auth-code="***"
    webapp-base-url="https://frame.health-check.class2.xund.solutions/"
  ></script>
</div>
```

## Setting up PHP example

* The example requires [Docker](https://docs.docker.com/get-started/get-docker/)
* Go to the [PHP example folder](example/src/index.php).
* Copy the .env.test as .env and fill with your parameters. 
* In your terminal enter the following:
```terminal
cd example
./run_container.sh
```
* Visit localhost:3000


## Quick try

In case you you just want to try out the app, you don't have to pass auth-code at all. This requires the setting *Frontend authentication enabled* in [Client Hub](https://clienthub.xund.solutions/). We don't recommend to use it in production. 

```html
<div id="your-container" style="width: 100vw; height: 100vh;">
  <script 
    src="https://public.xund.solutions/embed.js" 
    client-id="***" 
  ></script>
</div>
```


## Advanced options

[Using a specific Web App instance](advanced-options.md#using-a-specific-web-app-instance)  
[Start with Symptom or Illness Check directly](advanced-options.md#start-with)  
[Start Check with pre-defined profile data](advanced-options.md#add-profile-data)  
[Setup a webhook passing your custom ID after each check](advanced-options.md#setup-a-webhook-passing-your-custom-id-after-each-check)


##

> ⚠️ If you are still not sure how you could move forward with your implementation, please contact us. We're happy to assist you in your process!