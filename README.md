# XUND Web App Integration Guide

XUND Web App is a pre-made implementation of **[XUND APIs](https://xund-api-documentation.scrollhelp.site/xund-api-documentation/latest/general-information)** and it is ready for authorized clients to easily embed Symptom/Illness/Health Check into their website. This guide explains two supported integration methods and provides runnable examples.


## Choose your integration method

You can integrate the XUND Web App in two ways.

- Simple Script Embed (quickest to implement)
- Client-Side JS API (more flexible, event-driven)

Pick the one that best fits your needs.

---

## Simple Script Embed (easiest)

Insert the following snippet into the body of your HTML page where you want to place the XUND Web App:

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

You must pass `client-id`, `webapp-code`, and `auth-code` to the script tag. Use the `client-id` and `webapp-code` from the Client Hub. The `auth-code` should be created on your server using your API Key (provided via 1Password). Complete examples are provided for PHP and .NET inside `examples/`.

If you want to integrate **Health Check** directly, specify the Health Check App explicitly in the `web-app-base-url` attribute of the script:

```html
<div id="your-container" style="width: 100vw; height: 100vh;">
  <script 
    src="https://frame.health-check.class2.xund.solutions/embed.js" 
    client-id="***"
    webapp-code="***" 
    auth-code="***"
    webapp-base-url="https://frame.health-check.class2.xund.solutions/"
    app-language="en"
  ></script>
</div>
```

> **Note:** If the `app-language` parameter is passed via integration, the language selector menu will be hidden in the side menu.

---

## Client-Side JS API (more control)

This method gives you a JavaScript API to initialize the app and handle events. Both Symptom/Illness Check and Health Check are supported.

### Symptom/Illness Check JS API

#### Initialization

Include the `embed.js` script and initialize via `XUND.scic.init`:

```html
<div id="xundwebapp"></div>
<script src="https://public.xund.solutions/embed.js"></script>
<script>
  (async () => {
    const xundApp = XUND.scic.init({
      clientId: '***',
      webappCode: '***',
      authCode: '***',
      targetContainerId: 'xundwebapp',
    });
  })()
</script>
```

#### Customize the Check Report action button

You can customize the action button on the report page:

```javascript
(async () => {
  const xundApp = XUND.scic.init({
    clientId: '***',
    webappCode: '***',
    authCode: '***',
    targetContainerId: 'xundwebapp',
    customization: {
      checkReport: {
        actionButton: {
          labelText: 'Save',
          onClick: () => { /* your code here */ },
        },
      }
    }    
  });
})()
```

#### Fetch the Check Report data

Use `getReportData` to read the report (returns `undefined` until available):

```javascript
(async () => {
  const xundApp = XUND.scic.init({ /* ... */ });
  xundApp.getReportData().then((report) => {
    console.log('This is the check report', report);
  });
})()
```

Combine it with the action button handler:

```javascript
(async () => {
  const xundApp = XUND.scic.init({
    clientId: '***',
    webappCode: '***',
    authCode: '***',
    targetContainerId: 'xundwebapp',

    customization: {
      checkReport: {
        actionButton: {
          labelText: 'Save',
          onClick: () => {
            xundApp.getReportData().then((report) => {
              console.log('This is the check report', report);
            });
          },
        },
      }
    }    
  });
})()
```

### Health Check JS API

#### Initialization

Include the `embed.js` script and initialize via `XUND.hc.init`:

```html
<div id="xundwebapp"></div>
<script src="https://frame.health-check.class2.xund.solutions/embed.js"></script>
<script>
  (async () => {
    const xundApp = await XUND.hc.init({
      targetContainerId: 'xundwebapp',
      clientId: '***',
      webappBaseUrl: 'https://frame.health-check.class2.xund.solutions/',
      authBaseUrl: 'https://login.xund.solutions/api',
      appLanguage: 'en',
      onCheckStart: (checkId) => {
        console.log('checkId', checkId)
      }
    });
  })()
</script>
```

> **Note:** If the `appLanguage` parameter is passed via integration, the language selector menu will be hidden in the side menu.


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

- [Start with Symptom or Illness Check directly](advanced-options.md#start-with)
- [Start Check with pre-defined profile data](advanced-options.md#add-profile-data)
- [Add onboarding page](advanced-options.md#add-onboarding-page)
- [Setup a webhook passing your custom ID after each check](advanced-options.md#setup-a-webhook-passing-your-custom-id-after-each-check)
- [Available Parameters](advanced-options.md#available-parameters)


##

> ⚠️ If you are still not sure how you could move forward with your implementation, please contact us. We're happy to assist you in your process!
