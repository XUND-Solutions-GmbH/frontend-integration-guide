using FrontendIntegrationDemo;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient();
builder.Services.AddSingleton<AuthCodeService>();
builder.Services.Configure<IntegrationConfiguration>(builder.Configuration.GetSection("Xund"));

var app = builder.Build();

app.MapGet("/", async (AuthCodeService authCodeService, IConfiguration configuration) =>
{
    var integrationConfig = configuration.GetSection("Xund").Get<IntegrationConfiguration>() 
        ?? throw new InvalidOperationException("Xund configuration is missing");
    
    var authCode = await authCodeService.FetchAuthCodeAsync(integrationConfig);
    var page = RenderHtml(integrationConfig.ClientId, authCode, integrationConfig.WebappCode);
    return Results.Content(page, "text/html");
});

app.Run();

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
    public sealed class IntegrationConfiguration
    {
        public string ApiKey { get; set; } = string.Empty;
        public string ClientId { get; set; } = string.Empty;
        public string WebappCode { get; set; } = string.Empty;
        public string AuthBaseUrl { get; set; } = "https://login.xund.solutions/api";
    }
}
