# XUND Web App Integration Guide

`Web App` is a pre-made implementation of **[XUND APIs](https://xund-api-documentation.scrollhelp.site/xund-api-documentation/latest/general-information)** and it is ready for authorized clients to easily embed Symptom/Illness/Health Check into their website. The following guide is a step-by-step instruction of the authorization and embedding process and also provides examples for quick and easy implementation.

This kind of integration doesn't require a deep understanding of our **[APIs](https://xund-api-documentation.scrollhelp.site/xund-api-documentation/latest/general-information)** and you can quickly provide a full-featured Illness Check / Symptom Check to your users. 

## Prerequisites

1. You need to have access to [Client Hub](https://clienthub.xund.solutions/)
2. Get a `XUND_CLIENT_ID` from [here](https://clienthub.beta.xund.solutions/key) and `XUND_WEBAPP_CODE` from [here](https://clienthub.beta.xund.solutions/webApp). <sup>👉 [View screenshot 1](readme-assets//clienthub-webapp-getcode.png), 👉 [View screenshot 2](readme-assets/clienthub-apikey-getkey.png)</sup>
3. Make sure that `Frontend` is selected as the `Authentication Method` in the [API Key](https://clienthub.beta.xund.solutions/key/). <sup>👉 [View screenshot](readme-assets/clienthub-apikey-frontend.png)</sup>
4. You can only embed `Web App` on the page with the exact `origin` defined in the [API Key](https://clienthub.beta.xund.solutions/key/). <sup>👉 [View screenshot](readme-assets/clienthub-apikey-origin.png)</sup>
5. You need to have at least the following scopes set in the [API Key](https://clienthub.beta.xund.solutions/key/) section of [Client Hub](https://clienthub.xund.solutions/). <sup>👉 [View screenshot](readme-assets/clienthub-apikey-scopes.png)</sup> 
* `Web App`, 
* at least `Illness Checks`, `Symptom Checks` or `Health Checks`
6. Optionally you can customize your embedded app's look and feel and its other properties [here](https://clienthub.beta.xund.solutions/webApp/). <sup>👉 [View screenshot](readme-assets/clienthub-webapp-customize.png)</sup>

## Embedding XUND into your page
```html
<iframe
    allow="geolocation"
    id="xund-iframe"
    style="width: 100vw; height: 100vh; border: none"
    title="Web App Frame"
/>
<script>
    
    const XUND_CLIENT_ID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
    const XUND_WEBAPP_CODE = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';
    
    const authCode = crypto.randomUUID?.() ?? crypto.getRandomValues(new Uint32Array(40)).join('')
    const redirectUri = encodeURIComponent('https://frame.webapp.class2.xund.solutions/' + XUND_WEBAPP_CODE)
    await fetch(`https://identity-management.xund.solutions/api/authorize?clientId=${XUND_CLIENT_ID}&authCode=${authCode}`)
    document.getElementById('xund-iframe').src = `https://identity-management.xund.solutions/api/token?clientId=${XUND_CLIENT_ID}&authCode=${authCode}&redirectUri=${redirectUri}`
</script>
```

## More examples:

* 👉 [Enable extra features](extra-features.md)
* 👉 [Setup a webhook with your custom Client IDs](webhook.md)
* 👉 [Advanced integration example](advanced/advanced.js)



> ⚠️ If you are still not sure how you could move forward with your implementation, please contact us. We're happy to assist you in your process!
