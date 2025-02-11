# XUND Web App Integration Guide

XUND Web App is a pre-made implementation of **[XUND APIs](https://xund-api-documentation.scrollhelp.site/xund-api-documentation/latest/general-information)** and it is ready for authorized clients to easily embed Symptom/Illness/Health Check into their website. The following guide is a detailed instruction of embedding the XUND Web App and also provides examples for quick and easy implementation.



Please insert the following snippet into the body of your HTML page where you want to have XUND Web App placed:
```html
<div id="your-container" style="width: 100vw; height: 100vh;">
  <script 
    src="https://public.xund.solutions/embed.js" 
    client-id="***" 
    auth-code="***"
  />
</div>
```

Please note that you need to pass `client-id` and `webapp-code` to the script tag. Use the `client-id` from the Client Hub, the `auth-code` can be created on your server based on your API Key you got from us via 1Password. An example project of a valid `auth-code` creation can be found here.


## Advanced options

[Using a specific Web App instance](advanced-options.md#using-a-specific-web-app-instance)  
[Start with Symptom, Illness or Health Check directly](advanced-options.md#start-with)  
[Start Check with pre-defined profile data](advanced-options.md#add-profile-data)  
[Setup a webhook passing your custom ID after each check](advanced-options.md#setup-a-webhook-passing-your-custom-id-after-each-check)


##

> ⚠️ If you are still not sure how you could move forward with your implementation, please contact us. We're happy to assist you in your process!