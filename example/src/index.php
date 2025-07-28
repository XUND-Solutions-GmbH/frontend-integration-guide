<?php
function authorize($clientId, $authBaseUrl) {
    $apiKey = getenv('XUND_AUTH_API_KEY');
    
    // generate hashed api key
    $hashedApiKey = hash('sha256', $apiKey);
    
    // generate uuid as a state
    $stateUuid = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex(random_bytes(16)), 4));

    // hash state with client id with api key as a secret
    $secretHash = hash_hmac('sha256',"$stateUuid$clientId" ,$hashedApiKey);

    // Option 1: authorization request
    $curl = curl_init("$authBaseUrl/authorize?clientId=$clientId&secretHash=$secretHash&state=$stateUuid");

    // Option 2: authorization request when you want to get back the state in a Webhook callback
    // $curl = curl_init("$authBaseUrl/authorize?clientId=$clientId&secretHash=$secretHash&state=$stateUuid&scope=state");

    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($curl);

    // pick auth code
    return json_decode($response)->authCode;
}

$authBaseUrl = "https://login.xund.solutions/api";
$clientId = getenv("XUND_AUTH_CLIENT_ID");
$webappCode = getenv("XUND_WEBAPP_CODE");
$authCode = authorize($clientId, $authBaseUrl);


echo <<<EOF
<!DOCTYPE html>
<html>

<body>
<div id="your-container" style="width: 100vw; height: 100vh;">
  <script
    src="https://public.xund.solutions/embed.js"
    client-id="$clientId"
    auth-code="$authCode"
    webapp-code="$webappCode"
    ></script>
</div>
</body>

</html>
EOF;



