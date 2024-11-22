# XUND Web App Integration Guide

XUND Web App is a pre-made implementation of **[XUND APIs](https://xund-api-documentation.scrollhelp.site/xund-api-documentation/latest/general-information)** and it is ready for authorized clients to easily embed Symptom/Illness/Health Check into their website. The following guide is a detailed instruction of embedding the XUND Web App and also provides examples for quick and easy implementation.

##### Table of Contents  
[Prerequisites](#prerequisites)  
[Keys and IDs](#keys-and-ids)  
[Quick try out](#quick-try-out)  
[Recommended / secure embedding](#recommended-secure-embedding)  
[Advanced options](#advanced-options)  


## Prerequisites

1. You need to have access to [Client Hub](https://clienthub.xund.solutions/)
2. You can embed Web App on the page **only** with the exact origin defined in the [API Key](https://clienthub.xund.solutions/key/). [`📷`](readme-assets/clienthub-apikey-origin.png)
3. You need to have at least the following scopes set in the [API Key](https://clienthub.xund.solutions/key/) section of [Client Hub](https://clienthub.xund.solutions/). [`📷`](readme-assets/clienthub-apikey-scopes.png) 
* `Web App`, 
* at least `Illness Checks`, `Symptom Checks` or `Health Checks`
4. Optionally you can customize your embedded app's look and feel and its other properties [here](https://clienthub.xund.solutions/webApp/). [`📷`](readme-assets/clienthub-webapp-customize.png)

## Keys and IDs

| Name | Property Name | Description | Where to find? |
| - | ---- | - | - |
| Client ID | `client-id` | It's the unique identifier <br />of your organisation | Go to Client Hub and select <br />_API key_ from the left navigation <br />Scroll down for _Client ID_ [`📷`](readme-assets/clienthub-webapp-getcode.png) |
| Web App Code | `webapp-code` | Any number of Web Apps <br />can be defined. Every app <br />has its own settings (e.g. <br />Custom colors) | Go to Client Hub and select <br />_WebApp_ from the left navigation <br />Scroll down for _Code_ [`📷`](readme-assets/clienthub-apikey-getkey.png) |
| Auth Code | `auth-code` | In order to authenticatate <br />the Check session it's <br />necessary to have a valid Auth Code | If you have Frontent Authentication <br />enabled on Client Hub you'll get <br />one behind the scenes. Otherwise <br />you can get it during the Backend <br />Authentication |

## _Quick_: Try out

This kind of integration doesn't require a deep understanding of our **[APIs](https://xund-api-documentation.scrollhelp.site/xund-api-documentation/latest/general-information)** and you can quickly provide a full-featured Illness Check / Symptom Check to your users. 

> Make sure that _Frontend_ is selected as the _Authentication Method_ in the [API Key](https://clienthub.xund.solutions/key/) section of Client Hub. [`📷`](readme-assets/clienthub-apikey-frontend.png)

We recommend however to keep this option disabled and have the authentication implemented on your own server [as described here](https://github.com/XUND-Solutions-GmbH/backend-auth-flow-demo/) to ensure the maximum security of the Checks. 

Please insert the following snippet into the body of your HTML page where you want to have XUND Web App placed:
```html
<div id="your-container" style="width: 100vw; height: 100vh;">
  <script 
    src="https://webapp.xund.solutions/embed.js" 
    client-id="***" 
  />
</div>
```

[Where do I get `client-id`?](#keys-and-ids)

## _Recommended_: Secure embedding

We encourage our partners to use our [Backend Authentication Method](https://github.com/XUND-Solutions-GmbH/backend-auth-flow-demo/) and provide the resulting authCode to the embbedding snippet: 

```html
<script 
  src="https://public.xund.solutions/embed.js" 
  client-id="***" 
  auth-code="***" 
/>
```

[Where do I get `client-id` and `auth-code`?](#keys-and-ids)

Learn more about using Backend Authentication with Web App embeds in this [**Next JS example project**](nextjs-example/src/app) or visit our [**Backend Authentication Flow Demo**](https://github.com/XUND-Solutions-GmbH/backend-auth-flow-demo/) repository. 

## Advanced options

[Using a specific Web App instance](advanced-options.md#using-a-specific-web-app-instance)  
[Start with Symptom, Illness or Health Check directly](advanced-options.md#start-with)  
[Start Check with pre-defined profile data](advanced-options.md#add-profile-data)  
[Setup a webhook passing your custom ID after each check](advanced-options.md#setup-a-webhook-passing-your-custom-id-after-each-check)  


##

> ⚠️ If you are still not sure how you could move forward with your implementation, please contact us. We're happy to assist you in your process!

