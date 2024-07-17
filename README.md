# XUND Web App Integration Guide

`Web App` is a pre-made implementation of **[XUND APIs](https://xund-api-documentation.scrollhelp.site/xund-api-documentation/latest/general-information)** and it is ready for authorized clients to easily embed Symptom/Illness/Health Check into their website. The following guide is a step-by-step instruction of the authorization and embedding process and also provides examples for quick and easy implementation.

This kind of integration doesn't require a deep understanding of our **[APIs](https://xund-api-documentation.scrollhelp.site/xund-api-documentation/latest/general-information)** and you can quickly provide a full-featured Illness Check / Symptom Check to your users. 

## Prerequisites

1. You need to have access to [Client Hub](https://clienthub.xund.solutions/)
2. You need to create an [API Key](https://clienthub.beta.xund.solutions/key) on [Client Hub](https://clienthub.xund.solutions/).  [👉 View screenshot](readme-assets/clienthub-apikey-create.png) 
3. Make sure you've selected `Frontend` as the `Authentication Method` in the [Client Hub](https://clienthub.xund.solutions/). [👉 View screenshot](readme-assets/clienthub-apikey-frontend.png)
4. You can only embed `Web App` on the page with the exact origin you've previously defined on [Client Hub](https://clienthub.xund.solutions/)'s page ([API Key](https://clienthub.beta.xund.solutions/key/) → `Authentication method` → `Origin`). [👉 View screenshot](readme-assets/clienthub-apikey-origin.png)
5. You need to have at least the following scopes set in the [API Key](https://clienthub.beta.xund.solutions/key/) section of [Client Hub](https://clienthub.xund.solutions/).  [👉 View screenshot](readme-assets/clienthub-apikey-scopes.png) 
* `Web App`, 
* at least one of the following: `Illness Checks`, `Symptom Checks`, `Health Checks`
6. Optionally create a [WebApp](https://clienthub.beta.xund.solutions/webApp/) instance (code) to customize your embedded app's look and feel and its other properties. [👉 View screenshot](readme-assets/clienthub-webapp-customize.png)

## Embedding XUND into your page
```html
<iframe
        allow="geolocation"
        id="xund-iframe"
        style="width: 100vw; height: 100vh; border: none"
        title="Web App Frame"
/>
<script>
    
    // [START] edit
    const XUND_CLIENT_ID = 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz';
    const XUND_WEBAPP_CODE = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';
    // [END] edit
    
    const authCode = crypto.randomUUID?.() ?? crypto.getRandomValues(new Uint32Array(40)).join('')
    const redirectUri = encodeURIComponent('https://frame.webapp.class2.xund.solutions/' + XUND_WEBAPP_CODE)
    await fetch(`https://identity-management.xund.solutions/api/authorize?clientId=${XUND_CLIENT_ID}&authCode=${authCode}`)
    document.getElementById('xund-iframe').src = `https://identity-management.xund.solutions/api/token?clientId=${XUND_CLIENT_ID}&authCode=${authCode}&redirectUri=${redirectUri}`
</script>
```

## Integration examples:

* [👉 Simple code snippet](simple.html)
* [👉 Advanced code snippet](advanced/advanced.js)


## [Setup a webhook passing your custom ID after each check](webhook.md)

## [Enable extra features](extra-features.md)

> ⚠️ If you are still not sure how you could move forward with your implementation, please contact us. We're happy to assist you in your process!
