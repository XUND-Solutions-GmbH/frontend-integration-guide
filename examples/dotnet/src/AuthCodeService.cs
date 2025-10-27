using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.WebUtilities;

namespace FrontendIntegrationDemo;

public class AuthCodeService
{
    private readonly IHttpClientFactory _httpClientFactory;

    public AuthCodeService(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task<string> FetchAuthCodeAsync(IntegrationConfiguration configuration)
    {
        var hashedApiKey = ComputeSha256Hex(configuration.ApiKey);
        var state = Guid.NewGuid().ToString(); // Random UUID as a state parameter
        var secretInput = string.Concat(state, configuration.ClientId);
        
        var secretHash = ComputeHmacSha256Hex(secretInput, hashedApiKey);

        var authorizeUri = BuildAuthorizeUri(configuration.AuthBaseUrl, configuration.ClientId, secretHash, state);

        using var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        var response = await client.GetAsync(authorizeUri);
        if (!response.IsSuccessStatusCode)
        {
            var detail = await response.Content.ReadAsStringAsync();
            throw new InvalidOperationException($"Authorize request failed with {(int)response.StatusCode}: {detail}");
        }

        var payload = await response.Content.ReadFromJsonAsync<AuthorizeResponse>();
        if (payload == null || string.IsNullOrWhiteSpace(payload.AuthCode))
        {
            throw new InvalidOperationException("Authorize response did not include authCode");
        }

        return payload.AuthCode;
    }

    private static string ComputeSha256Hex(string input)
    {
        var inputBytes = Encoding.UTF8.GetBytes(input);
        var hashBytes = SHA256.HashData(inputBytes);
        return Convert.ToHexString(hashBytes).ToLowerInvariant();
    }

    private static string ComputeHmacSha256Hex(string payload, string secret)
    {
        var secretBytes = Encoding.UTF8.GetBytes(secret);
        var payloadBytes = Encoding.UTF8.GetBytes(payload);
        var hashBytes = HMACSHA256.HashData(secretBytes, payloadBytes);
        return Convert.ToHexString(hashBytes).ToLowerInvariant();
    }

    private static string BuildAuthorizeUri(string baseUrl, string clientId, string secretHash, string state)
    {
        var parameters = new Dictionary<string, string>
        {
            ["clientId"] = clientId,
            ["secretHash"] = secretHash,
            ["state"] = state

            // Add "scope" if you want to get back the state in a webhook callback
            // ["scope"] = "state" 
        };
        return QueryHelpers.AddQueryString($"{baseUrl}/authorize", parameters);
    }
}

public sealed record AuthorizeResponse(string AuthCode);

