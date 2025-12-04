[Back to overview](README.md) 

# XUND Web App Integration Guide
## Advanced options

##### Table of Contents  
- [Add profile data](#add-profile-data)
- [Start with](#start-with)
- [Start symptom check with a symptom ID](#start-symptom-check-with-a-symptom-id)
- [Add onboarding page](#add-onboarding-page)
- [Setup a webhook passing your custom ID after each check](#setup-a-webhook-passing-your-custom-id-after-each-check)


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
If you want to add the onborading page before the Symptom or Illness checks start, add this property:
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

##

[Back to overview](README.md) 