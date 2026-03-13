# XUND Android WebView Integration Example

This example demonstrates how to embed the [XUND Symptom Checker](https://www.xund.solutions/) inside an Android application using a `WebView`. It covers:

- Fetching a short-lived XUND auth token on every WebView launch
- Loading the XUND Web App via the [Frontend JS API](https://github.com/XUND-Solutions-GmbH/frontend-integration-guide)
- Receiving the check report via the `onReportShown` hook and exposing it to the native layer
- A "Get Report" button for manually inspecting the last report as formatted JSON

---

## Prerequisites

- **Android Studio** Hedgehog (2023.1) or newer
- **Android SDK** — compile SDK 34, minimum SDK 24 (Android 7.0)
- An Android emulator or physical device running Android 7.0+
- XUND credentials from the [XUND Client Hub](https://hub.xund.solutions/)

---

## Getting started

### 1. Clone or copy this directory

```bash
git clone <repo-url>
cd examples/android-webview
```

### 2. Add your credentials

Credentials are read from a `secrets.properties` file in the project root. This file is **git-ignored** and must never be committed.

Copy the template and fill in your values:

```bash
cp secrets.properties.template secrets.properties
```

```properties
# secrets.properties
XUND_API_KEY=<Your API Key>
XUND_CLIENT_ID=<Your Client ID>
XUND_WEBAPP_CODE=<Your Web App Code>
XUND_WEBAPP_BASE_URL=https://frame.webapp.class2.xund.solutions
```

> The credentials are injected at compile time as `BuildConfig` constants by `app/build.gradle`. If `secrets.properties` is missing the project will still sync, but the app will fail to authenticate at runtime.
>
> The `XUND_API_KEY` is only present here to make the demo self-contained. In a real app, remove it entirely and fetch the `authCode` from your own backend instead.

### 3. Open in Android Studio

1. **File → Open** and select this directory.
2. Wait for the Gradle sync to complete.
3. Start an emulator (API 24+) via the **Device Manager**, or connect a physical device with USB debugging enabled.
4. Press **Run** (▶ or `Shift+F10`).

---

## ⚠️ Important: auth token signing belongs on your server

The XUND auth token is produced by signing a request with your **API key**. The API key is a sensitive secret — embedding it in a mobile app means it can be extracted from the binary by anyone who downloads the app.

**In a production integration the signing must happen on a backend server you control.** The mobile app should obtain the auth code by making an HTTP request to your own endpoint, which performs the signing server-side and returns only the short-lived `authCode`:

```
Mobile app  ──GET /xund-auth──▶  Your backend server
                                       │  (holds API key securely)
                                       │  signs request → calls XUND authorizer
Mobile app  ◀── { authCode } ──────────┘
```

`XundAuthHelper.kt` in this demo performs the signing directly inside the app **for demonstration purposes only**. It lets you run the example without setting up a backend. Do not use this pattern in a production app.

---

## How it works

### Auth token flow

#### In this demo (not for production)

`XundAuthHelper.getAuthCode()` runs the full signing logic inside the app, mirroring the [PHP reference implementation](https://github.com/XUND-Solutions-GmbH/frontend-integration-guide/blob/main/examples/php/src/index.php):

1. SHA-256 hash the API key
2. Generate a UUID as the `state` parameter
3. HMAC-SHA-256(`state + clientId`, hashedApiKey) → `secretHash`
4. `GET /authorize?clientId=&secretHash=&state=` → `authCode`

#### In a production app

Replace `XundAuthHelper.getAuthCode()` with a simple call to your own backend:

```kotlin
// Example: replace the signing logic with a single network call to your server
suspend fun getAuthCode(): String = withContext(Dispatchers.IO) {
    val response = URL("https://your-backend.example.com/xund-auth").readText()
    JSONObject(response).getString("authCode")
}
```

Your server then performs the signing and returns the `authCode`. The API key never leaves your infrastructure.

### XUND JS API integration

The WebView loads an HTML page that uses the [XUND Frontend JS API](https://github.com/XUND-Solutions-GmbH/frontend-integration-guide):

```javascript
var xundApp = XUND.scic.init({
    clientId:          '...',
    webappCode:        '...',
    authCode:          '...',   // freshly fetched each launch
    targetContainerId: 'xundwebapp',
    customization: {
        directCheck: 'SYMPTOM_CHECK',
        checkReport: {
            actionButton: {
                labelText: 'Save Report',
                onClick: function () { /* sends report to Android */ }
            }
        },
        onReportShown: function (payload) { /* sends report to Android */ }
    }
});
```

### Android ↔ JavaScript bridge

A `@JavascriptInterface` class (`XundBridge`, registered as `AndroidXund`) lets the JavaScript call back into the native layer:

| JS call | Android result |
|---|---|
| `AndroidXund.onReportShown(json)` | "Report Received" dialog with View / Dismiss |
| `AndroidXund.onReportReceived(json)` | Formatted JSON dialog (scrollable, no line wrapping) |
| `AndroidXund.onReportNotAvailable()` | "No report yet" dialog |

---

## Project structure

```
android-webview/
├── secrets.properties              # Git-ignored — your credentials go here
├── secrets.properties.template     # Committed template (no real values)
├── .gitignore
├── README.md                       # This file
└── app/
    ├── build.gradle                # Reads secrets.properties → BuildConfig fields
    └── src/main/
        ├── AndroidManifest.xml
        └── java/com/xund/androidwebapp/
            ├── MainActivity.kt         # Launch screen
            ├── WebViewActivity.kt      # WebView setup, XUND JS API, JS bridge
            ├── XundAuthHelper.kt       # ⚠️ Demo only — signing belongs on your server
            └── ReportDialogHelper.kt   # Dialog display + JSON formatting (non-integration utility)
```
