using FrontendIntegrationDemo;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHttpClient();
builder.Services.AddSingleton<AuthCodeService>();

var app = builder.Build();

app.MapGet("/", async (AuthCodeService authCodeService) =>
{
    var configuration = LoadIntegrationConfiguration();
    var authCode = await authCodeService.FetchAuthCodeAsync(configuration);
    var page = RenderHtml(configuration.ClientId, authCode, configuration.WebappCode);
    return Results.Content(page, "text/html");
});

app.Run();

static IntegrationConfiguration LoadIntegrationConfiguration()
{
    var apiKey = ReadRequiredVariable("XUND_AUTH_API_KEY");
    var clientId = ReadRequiredVariable("XUND_AUTH_CLIENT_ID");
    var webappCode = ReadRequiredVariable("XUND_WEBAPP_CODE");
    return new IntegrationConfiguration(apiKey, clientId, webappCode, "https://login.xund.solutions/api");
}

static string ReadRequiredVariable(string name)
{
    var value = Environment.GetEnvironmentVariable(name);
    if (string.IsNullOrWhiteSpace(value))
    {
        throw new InvalidOperationException($"Missing environment variable: {name}");
    }
    return value;
}

static string RenderHtml(string clientId, string authCode, string webappCode)
{
    return $"""
<!DOCTYPE html>
<html>

<body>
<div id="your-container" style="width: 100vw; height: 100vh;">
  <script
    src="https://public.xund.solutions/embed.js"
    client-id="{clientId}"
    auth-code="{authCode}"
    webapp-code="{webappCode}"
    ></script>
</div>
</body>

</html>
""";
}

namespace FrontendIntegrationDemo
{
    public sealed record IntegrationConfiguration(string ApiKey, string ClientId, string WebappCode, string AuthBaseUrl);
}
