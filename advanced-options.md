[Back to overview](README.md) 

# XUND Web App Integration Guide
## Advanced options

##### Table of Contents  
- [Add profile data](#add-profile-data)
- [Start with](#start-with)
- [Start symptom check with a symptom ID](#start-symptom-check-with-a-symptom-id)
- [Add onboarding page](#add-onboarding-page)
- [Setup a webhook passing your custom ID after each check](#setup-a-webhook-passing-your-custom-id-after-each-check)
- [Available Parameters](#available-parameters)

### Add profile data

If you want to launch the app with pre-defined profile data add these extra properties to the script tag: 

```html
<script ... gender="female" birth="2000-12-31" />
```

JS API equivalent:

```javascript
(async () => {
  const xundApp = XUND.scic.init({
    clientId: '***',
    webAppCode: '***',
    authCode: '***',
    targetContainerId: 'xundwebapp',

    // Pre-fill profile data
    gender: 'female',
    birth: '2000-12-31', // YYYY-MM-DD
  });
}()
```

### Hide logo and menu in the header (HC only)

```html
<script ... compact-mode="true" />
```

JS API equivalent:

```javascript
(async () => {
  const xundApp = XUND.hc.init({
    clientId: '***',
    webAppCode: '***',
    authCode: '***',
    targetContainerId: 'xundwebapp',

    compactMode: true
  });
}()
```

### Start with
If this is set, the welcome page is not visible on check restart. Possible values: ILLNESS_CHECK, SYMPTOM_CHECK

```html
<script ... direct-check="ILLNESS_CHECK" />
```

JS API equivalent:

```javascript
(async () => {
  const xundApp = XUND.scic.init({
    clientId: '***',
    webAppCode: '***',
    authCode: '***',
    targetContainerId: 'xundwebapp',

    directCheck: 'ILLNESS_CHECK', // or 'SYMPTOM_CHECK'
  });
})()
```

### Start symptom check with a symptom ID
If you want to start the Symptom check with a specific symptom, add this property:
```html
<script ... direct-check-main-symptom-id="YOUR-SYMPTOM-ID" />
```
#### Important notes
- This will automatically set the property `direct-check="SYMPTOM_CHECK"`, so you don't have to set it.
- The symptom ID must be a valid UUID format.

JS API equivalent:

```javascript
(async () => {
  const xundApp = XUND.scic.init({
    clientId: '***',
    webAppCode: '***',
    authCode: '***',
    targetContainerId: 'xundwebapp',

    directCheckMainSymptomId: 'YOUR-SYMPTOM-ID',
    // Note: This implicitly sets directCheck = 'SYMPTOM_CHECK'
  });
})()
```

### Add onboarding page
If you want to add the onboarding page before the Symptom or Illness checks start, add this property:
```html
<script ... onboarding="true" />
```

JS API equivalent:

```javascript
(async () => {
  const xundApp = XUND.scic.init({
    clientId: '***',
    webAppCode: '***',
    authCode: '***',
    targetContainerId: 'xundwebapp',

    onboarding: true,
  });
})()
```

To display the onboarding page in the Health Check app, call `XUND.hc.init` instead of `XUND.scic.init`.

### Setup a webhook passing your custom ID after each check

#### Step 1: Client Hub

First, please turn on _Enable callback URL_ option on the Client Hub [API Key](https://clienthub.xund.solutions/key) section and point it to an existing endpoint on your server.

#### Step 2: Backend

When requesting the authorization code from the `/authorize` endpoint, include the `scope=state` parameter along with the `clientId`, `secretHash`, and `state`.

#### Step3: Frontend

Then extend the script's properties with `state`:

```html
<script ... state="YOUR-CUSTOM-ID" />
```

JS API equivalent:

```javascript
(async () => {
  const xundApp = XUND.scic.init({
    clientId: '***',
    webAppCode: '***',
    authCode: '***',
    targetContainerId: 'xundwebapp',

    state: 'YOUR-CUSTOM-ID',
  });
})()
```

#### Step 4: Webhook callback

On your defined endpoint you'll receive a message like this: 

```json
{"checkId":"***", "state":"YOUR-CUSTOM-ID"}
```

### Available Parameters

The following table lists all available parameters for SCIC (web-app) and HC (health-check-web-app) integrations, indicating which parameters are available in each integration type.

| Parameter | HTML Attribute | JS API Property | Type | Required | SCIC | HC |
|-----------|---------------|----------------|------|----------|------|-----|
| Client ID | `client-id` | `clientId` | `string` | Yes | ✓ | ✓ |
| Web App Code | `webapp-code` | `webappCode` | `string` | No* | ✓ | ✓ |
| Web App Base URL | `webapp-base-url` | `webappBaseUrl` | `string` | No* | ✓ | ✓ |
| Auth Base URL | `auth-base-url` | `authBaseUrl` | `string` | No | ✓ | ✓ |
| Auth Code | `auth-code` | `authCode` | `string` | No | ✓ | ✓ |
| Target Container ID | N/A | `targetContainerId` | `string` | Yes (JS API) | ✓ | ✓ |
| State | `state` | `state` | `string` | No | ✓ | ✓ |
| Check ID | `check-id` | `checkId` | `string` | No | ✓ | ✓ |
| Language | `app-language` | `appLanguage` | `string` | No | | ✓ |
| Compact Mode | `compact-mode` | `compactMode` | `boolean` | No | | ✓ |
| Birth Date | `birth` | `customization.birth` | `string` (YYYY-MM-DD) | No | ✓ |
| Gender | `gender` | `customization.gender` | `string` (FEMALE/MALE) | No | ✓ | ✓ |
| Sex | `sex` | `customization.sex` | `string` (male/female) | No | | ✓ |
| Weight | `weight` | `customization.weight` | `number` | No | | ✓ |
| Height | `height` | `customization.height` | `number` | No | | ✓ |
| Age | `age` | `customization.age` | `number` | No | | ✓ |
| Risk Topics | `risk-topics` | `customization.riskTopics` | `string[]` | No | | ✓ |
| Direct Check | `direct-check` | `customization.directCheck` | `string` (ILLNESS_CHECK/SYMPTOM_CHECK) | No | ✓ |
| Direct Check Main Symptom ID | `direct-check-main-symptom-id` | `customization.directCheckMainSymptomId` | `string` (UUID) | No | ✓ |
| Onboarding | `onboarding` | `customization.onboarding` | `boolean` | No | ✓ | ✓ |
| On Check Start | N/A | `customization.onCheckStart` | `function` | No | | ✓ |
| Check Report Action Button | N/A | `customization.checkReport.actionButton` | `object` or `boolean` | No | ✓ |

##

[Back to overview](README.md) 