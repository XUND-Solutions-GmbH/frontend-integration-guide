package com.xund.androidwebapp

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.URL
import java.security.MessageDigest
import java.util.UUID
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec

object XundAuthHelper {

    // Values are injected at build time from secrets.properties via BuildConfig.
    private val API_KEY        get() = BuildConfig.XUND_API_KEY
    val CLIENT_ID              get() = BuildConfig.XUND_CLIENT_ID
    val WEBAPP_CODE            get() = BuildConfig.XUND_WEBAPP_CODE
    val WEBAPP_BASE_URL        get() = BuildConfig.XUND_WEBAPP_BASE_URL
    private const val AUTH_BASE_URL = "https://login.xund.solutions/api"

    /**
     * Fetches a fresh auth code from the XUND authorizer service.
     * Must be called from a coroutine (runs on IO dispatcher).
     *
     * Steps (mirroring the PHP reference implementation):
     *   1. SHA-256 hash the API key
     *   2. Generate a UUID as the state parameter
     *   3. HMAC-SHA-256("{state}{clientId}", hashedApiKey) → secretHash
     *   4. GET /authorize?clientId=&secretHash=&state=
     *   5. Return authCode from the JSON response
     */
    suspend fun getAuthCode(): String = withContext(Dispatchers.IO) {
        val hashedApiKey = sha256(API_KEY)
        val state = UUID.randomUUID().toString()
        val secretHash = hmacSha256("$state$CLIENT_ID", hashedApiKey)

        val url = "$AUTH_BASE_URL/authorize" +
                "?clientId=$CLIENT_ID" +
                "&secretHash=$secretHash" +
                "&state=$state"

        val response = URL(url).readText()
        JSONObject(response).getString("authCode")
    }

    private fun sha256(input: String): String {
        val bytes = MessageDigest.getInstance("SHA-256").digest(input.toByteArray())
        return bytes.joinToString("") { "%02x".format(it) }
    }

    private fun hmacSha256(data: String, key: String): String {
        val mac = Mac.getInstance("HmacSHA256")
        mac.init(SecretKeySpec(key.toByteArray(), "HmacSHA256"))
        return mac.doFinal(data.toByteArray()).joinToString("") { "%02x".format(it) }
    }
}
