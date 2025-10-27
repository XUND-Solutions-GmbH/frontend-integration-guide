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

You have to pass `client-id`, `webapp-code` and `auth-code` to the script tag. Use the `client-id` and `webapp-code` from the Client Hub, the `auth-code` should be created on your server based on your API Key you got from us via 1Password. Complete examples are provided for PHP and .NET inside `examples/`.

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

## Running the examples

Examples rely on Docker regardless of language. Copy `.env.test` from the chosen example folder to `.env`, set your credentials, then run the helper script. Each container exposes the demo at `http://localhost:3000`.

#### [PHP Example](examples/php/src/index.php)

```terminal
cd examples/php
./run_container.sh
```

#### [.NET Example](examples/dotnet/src/Program.cs)

```terminal
cd examples/dotnet
./run_container.sh
```

## Advanced options

[Start with Symptom or Illness Check directly](advanced-options.md#start-with)  
[Start Check with pre-defined profile data](advanced-options.md#add-profile-data)
[Add onboarding page](advanced-options.md#add-onboarding-page)
[Setup a webhook passing your custom ID after each check](advanced-options.md#setup-a-webhook-passing-your-custom-id-after-each-check)


##

> ⚠️ If you are still not sure how you could move forward with your implementation, please contact us. We're happy to assist you in your process!