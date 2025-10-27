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
        var hashedApiKey = computeSha256Hex(configuration.ApiKey);
        var state = Guid.NewGuid().ToString();
        var secretInput = string.Concat(state, configuration.ClientId);
        var secretHash = computeHmacSha256Hex(secretInput, hashedApiKey);

        var authorizeUri = buildAuthorizeUri(configuration.AuthBaseUrl, configuration.ClientId, secretHash, state);

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

    private static string computeSha256Hex(string input)
    {
        var bytes = Encoding.UTF8.GetBytes(input);
        var hash = SHA256.HashData(bytes);
        return Convert.ToHexString(hash).ToLowerInvariant();
    }

    private static string computeHmacSha256Hex(string payload, string secret)
    {
        var key = Encoding.UTF8.GetBytes(secret);
        using var hmac = new HMACSHA256(key);
        var payloadBytes = Encoding.UTF8.GetBytes(payload);
        var signature = hmac.ComputeHash(payloadBytes);
        return Convert.ToHexString(signature).ToLowerInvariant();
    }

    private static string buildAuthorizeUri(string baseUrl, string clientId, string secretHash, string state)
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

