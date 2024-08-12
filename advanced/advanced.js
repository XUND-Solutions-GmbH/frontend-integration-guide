;(async() => {
  const XUND_AUTH_BASE_URL = 'https://identity-management.xund.solutions/api';
  const XUND_WEBAPP_INSTANCE = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
  const XUND_APP_BASE_URL = 'https://frame.webapp.class2.xund.solutions/' + XUND_WEBAPP_INSTANCE;
  const XUND_CLIENT_ID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
  
  const appendSearchParamsIfSet = (url, searchParams) => {
    for (const [name, value] of Object.entries(searchParams)) {
      if (value) {
        url.searchParams.append(name, value)
      }
    }
  }

  const clientId = XUND_CLIENT_ID;

  const state = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'    // pass your own Client ID and get it back in the callback
  const checkId = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'  // continue aborted check

  const directCheck = `HEALTH_CHECK`  // start with `HEALTH_CHECK`, `ILLNESS_CHECK` or `SYMPTOM_CHECK` directly

  const birth = '1970-12-31'          // start check with pre-filled birthdate
  const gender = 'female'             // start check with pre-filled gender

  const authCode = crypto.randomUUID?.() ?? crypto.getRandomValues(new Uint32Array(40)).join('')

  const authorizeRequestUrl = new URL(`${XUND_AUTH_BASE_URL}/authorize`)
  appendSearchParamsIfSet(authorizeRequestUrl, { clientId, authCode, state, scope: 'state' })

  await fetch(authorizeRequestUrl)

  const webappUrl = new URL(`${XUND_APP_BASE_URL}/${XUND_WEBAPP_INSTANCE}`)
  appendSearchParamsIfSet(webappUrl, { birth, gender, checkId, state, directCheck })

  const tokenRequestUrl = new URL(`${XUND_AUTH_BASE_URL}/token`)
  appendSearchParamsIfSet(tokenRequestUrl, { clientId, authCode, redirectUri: webappUrl })

  document.getElementById('xund-iframe').src = tokenRequestUrl
  
}
)()