<?php
function authorize($clientId, $authBaseUrl) {
    $apiKey = getenv('XUND_AUTH_API_KEY');
    $stateUuid = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex(random_bytes(16)), 4));;
    $secretHash = hash_hmac('sha256',"$stateUuid$clientId" ,$apiKey);

    $curl = curl_init("$authBaseUrl/authorize?clientId=$clientId&secretHash=$secretHash&state=$stateUuid");
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($curl);

    return json_decode($response)->authCode;
}

$webappBaseUrl = getenv('XUND_WEBAPP_BASE_URL');
$authBaseUrl = getenv('XUND_AUTH_BASE_URL');
$clientId = getenv("XUND_AUTH_CLIENT_ID");
$authCode = authorize($clientId, $authBaseUrl);

$webappCode = getenv('XUND_WEBAPP_CODE');

echo <<<EOF
<!DOCTYPE html>
<html>

<body>
<div id="your-container" style="width: 100vw; height: 100vh;">
  <script 
    src="https://public.xund.solutions/embed.js" 
    client-id="$clientId" 
    auth-code="$authCode"
    auth-base-url="$authBaseUrl"
    webapp-base-url="$webappBaseUrl"
    webapp-code="$webappCode"
    ></script>
</div>
</body>

</html>
EOF;



