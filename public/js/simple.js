;(async() => {
  const XUND_AUTH_BASE_URL = "https://identity-management.xund.solutions/api";
  const XUND_WEBAPP_INSTANCE = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';
  const XUND_APP_BASE_URL = 'https://frame.webapp.class2.xund.solutions/' + XUND_WEBAPP_INSTANCE;
  const XUND_CLIENT_ID = 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz';

  const authCode = crypto.randomUUID?.() ?? crypto.getRandomValues(new Uint32Array(40)).join('')
  await fetch(`${XUND_AUTH_BASE_URL}/authorize?clientId=${XUND_CLIENT_ID}&authCode=${authCode}`)
  document.getElementById('xund-iframe').src = `${XUND_AUTH_BASE_URL}/token?clientId=${XUND_CLIENT_ID}&authCode=${authCode}&redirectUri=${encodeURIComponent(XUND_APP_BASE_URL)}`
}
)()