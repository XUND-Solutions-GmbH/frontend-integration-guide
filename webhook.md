# Setup a webhook passing your custom ID after each check

First, please turn on `Enable callback URL` option on the Client Hub [`API Key`](https://clienthub.xund.solutions/key) section and point it to an existing endpoint on your server.

Use the `state` URL parameter along with `scope=state` for passing your own custom ID on authorization request. Please also append the state to the redirectUri part of tokenRequestUrl:

```http
GET: https://login.xund.solutions/api/authorize?clientId=${clientId}&authCode=${authCode}&state=${yourCustomClientID}&scope=state
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
