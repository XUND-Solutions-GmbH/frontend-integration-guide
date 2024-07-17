# XUND Web App Integration Guide

`Web App` is a pre-made implementation of **[XUND APIs](https://xund-api-documentation.scrollhelp.site/xund-api-documentation/latest/general-information)** and it is ready for authorized clients to easily embed Symptom/Illness/Health Check into their website. The following guide is a step-by-step instruction of the authorization and embedding process and also provides examples for quick and easy implementation.

This kind of integration doesn't require a deep understanding of our **[APIs](https://xund-api-documentation.scrollhelp.site/xund-api-documentation/latest/general-information)** and you can quickly provide a full-featured Illness Check / Symptom Check to your users. 

## Getting Started
### Prerequisites

1. You need to have access to [Client Hub](https://clienthub.xund.solutions/)
2. You need to create an [API Key](https://clienthub.beta.xund.solutions/key) on [Client Hub](https://clienthub.xund.solutions/).  [👉 View screenshot](readme-assets/clienthub-apikey-create.png) 
3. Make sure you've selected `Frontend` as the `Authentication Method` in the [Client Hub](https://clienthub.xund.solutions/). [👉 View screenshot](readme-assets/clienthub-apikey-frontend.png)
4. You can only embed `Web App` on the page with the exact origin you've previously defined on [Client Hub](https://clienthub.xund.solutions/)'s page ([API Key](https://clienthub.beta.xund.solutions/key/) → `Authentication method` → `Origin`). [👉 View screenshot](readme-assets/clienthub-apikey-origin.png)
5. You need to have at least the following scopes set in the [API Key](https://clienthub.beta.xund.solutions/key/) section of [Client Hub](https://clienthub.xund.solutions/).  [👉 View screenshot](readme-assets/clienthub-apikey-scopes.png) 
* `Web App`, 
* at least one of the following: `Illness Checks`, `Symptom Checks`, `Health Checks`
6. Optionally create a [WebApp](https://clienthub.beta.xund.solutions/webApp/) instance to customize your embedded app's look and feel and its other properties. [👉 View screenshot](readme-assets/clienthub-webapp-customize.png)

## Embed Web App into a page

> Want to jump right to implementation examples? [click here](public/index-simple.html).

1. [Create the **container**](#create-the-container)
2. [**Load Web App** into the Container](#load-web-app-into-the-container)

### Create the container

Insert a container `iframe` into your page where you want the `Web App` displayed:

```bash
<iframe allow="geolocation" id="xund-iframe" style={{width: '100vw', height: '100vh', border: 'none' }} title="XUND Application Frame" />
```

### Load Web App into the Container

The following 3 steps needs to be implemented to get the target URL of the iframe and provide the necessary access token for the Web App.

3 simple steps:
1. [Generate an authorization code](#generate-an-authorization-code)
2. [Authorization](#authorization)
3. [Set the source of the container iframe](#set-the-source-of-the-container-iframe)

#### Generate an authorization code

Generate a random `authCode` which you can reuse later for the authorization requests: 

```javascript
const authCode = crypto.randomUUID?.() ?? crypto.getRandomValues(new Uint32Array(40)).join('')
```

#### Authorization

Fetch the following endpoint to get `clientId` authenticated using the [`authCode`](#generate-an-authorization-code) you generated previously:

Find your `clientId` in the [API Key](https://clienthub.xund.solutions/key) section on [Client Hub](https://clienthub.xund.solutions/).

```http
GET: https://login.xund.solutions/api/authorize?clientId=${clientId}&authCode=${authCode}
```

#### Set the source of the container iframe

> Note that the authorization call must be completed before a token request can be made. 

Use `clientId` and `authCode` parameters again but also add `redirectUri` this time. 

```javascript
document.getElementById('xund-iframe').src = `https://login.xund.solutions/api/token?
clientId=${clientId}
&authCode=${authCode}
&redirectUri=${encodeURIComponent('https://frame.webapp.class2.xund.solutions')}`
```

Optionally you can display a specific Web App Instance (e.g. with customized colors you've set up in the [Web App](https://clienthub.xund.solutions/webApp) section of the Client Hub) by providing its `code` parameter in `redirectUri`:

```javascript
const redirectUri = `https://frame.webapp.class2.xund.solutions&code=${yourWebappInstanceId}`;

document.getElementById('xund-iframe').src = `https://login.xund.solutions/api/token?
clientId=${clientId}
&authCode=${authCode}
&redirectUri=${encodeURIComponent(redirectUri)}`
```


## Setup a webhook passing your custom ID after each check

First, please turn on `Enable callback URL` option on the Client Hub [`API Key`](https://clienthub.xund.solutions/key) section and point it to an existing endpoint on your server. 

Use the `state` URL parameter for passing your own custom client ID on both authorization request and redirectUri part of tokenRequestUrl:

```http
GET: https://login.xund.solutions/api/authorize?clientId=${clientId}&authCode=${authCode}&state=${yourCustomClientID}
```

```javascript
const tokenRequestUrl = `https://login.xund.solutions/api/token?
clientId=${clientId}
&authCode=${authCode}
&code=${yourWebappInstanceId}
&state=${yourCustomClientID}
&rediectUri=https://frame.webapp.class2.xund.solutions
`
```

> Note that `state` parameter has to be a valid UUID

Whenever a user completes a check and gets the report, the webhook makes a POST request to your backend endpoint with the following body content where the state is your custom client ID you passed to both auth and token requests at the beginning:

```json
{"checkId":"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", "state":"yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy"}
```


## Enable extra features

You can enable special features by adding more parameters to the redirectUri part of the iframe source URL: 

* #### Add profile data

```javascript
document.getElementById('xund-iframe').src = `...&gender=male&birth=2000-12-31`
```

* #### Start check directly with illness, symptom or health check

If this is set, the welcome page is not visible on check restart. Possible values: `HEALTH_CHECK`, `ILLNESS_CHECK`, `SYMPTOM_CHECK`

```javascript
document.getElementById('xund-iframe').src = `...&directCheck=ILLNESS_CHECK`
```

* #### Continue check
In case of an aborted check you can implement your own checkId store mechanism and continue a check at the point the where the user left off:
```javascript
document.getElementById('xund-iframe').src = `...&checkId=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
```

## Integration examples: 

* [👉 Simple code snippet](public/js/simple.js)
* [👉 Advanced code snippet](public/js/advanced.js)

#

> ⚠️ If you are still not sure how you could move forward with your implementation, please contact us. We're happy to assist you in your process!

