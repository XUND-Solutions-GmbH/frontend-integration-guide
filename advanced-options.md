[Back to overview](README.md) 

# XUND Web App Integration Guide
## Advanced options

##### Table of Contents  
[Using a specific Web App instance](#using-a-specific-web-app-instance)  
[Add profile data](#add-profile-data)  
[Start with](#start-with)  
[Setup a webhook passing your custom ID after each check](#setup-a-webhook-passing-your-custom-id-after-each-check) 



### Using a specific Web App instance

In [Client Hub](https://clienthub.xund.solutions/) you can define different Web App instances. Each Web App can have its own settings. Extend the properties of the script with `webapp-code`:

```html
<script ... webapp-code="***" />
```

[Where do I get this value?](#keys-and-ids)

### Add profile data

If you want to launch the app with pre-defined profile data add these extra properties to the script tag: 

```html
<script ... gender="female" birth='2000-12-31" />
```

### Start with
If this is set, the welcome page is not visible on check restart. Possible values: HEALTH_CHECK, ILLNESS_CHECK, SYMPTOM_CHECK

```html
<script ... directCheck="ILLNESS_CHECK" />
```

### Setup a webhook passing your custom ID after each check

First, please turn on _Enable callback URL_ option on the Client Hub [API Key](https://clienthub.xund.solutions/key) section and point it to an existing endpoint on your server.

Extend the script's properties with `state`:

```html
<script ... state="YOUR-CUSTOM-ID" />
```

On your defined endpoint you'll receive a message like this: 

```json
{"checkId":"***", "state":"YOUR-CUSTOM-ID"}
```

##

[Back to overview](README.md) 