package com.xund.androidwebapp

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.View
import android.webkit.JavascriptInterface
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.xund.androidwebapp.databinding.ActivityWebviewBinding
import kotlinx.coroutines.launch

class WebViewActivity : AppCompatActivity() {

    private lateinit var binding: ActivityWebviewBinding
    private lateinit var reportDialog: ReportDialogHelper

    // Holds the latest report captured by the onReportShown hook.
    private var lastReportJson: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityWebviewBinding.inflate(layoutInflater)
        setContentView(binding.root)

        reportDialog = ReportDialogHelper(this)

        setupWebView()
        binding.btnBack.setOnClickListener { finish() }
        binding.btnGetReport.setOnClickListener {
            val report = lastReportJson
            if (report != null) reportDialog.showReportJson(report)
            else reportDialog.showNoReport()
        }

        loadXundChecker()
    }

    // ---------------------------------------------------------------------------
    // WebView setup
    // ---------------------------------------------------------------------------

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        binding.webView.apply {
            webViewClient = WebViewClient()
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            addJavascriptInterface(XundBridge(), "AndroidXund")
        }
    }

    // ---------------------------------------------------------------------------
    // Load the XUND Symptom Checker
    // ---------------------------------------------------------------------------

    private fun loadXundChecker() {
        binding.progressBar.visibility = View.VISIBLE
        binding.webView.visibility = View.GONE
        binding.tvError.visibility = View.GONE

        lifecycleScope.launch {
            try {
                val authCode = XundAuthHelper.getAuthCode()
                binding.webView.loadDataWithBaseURL(
                    XundAuthHelper.WEBAPP_BASE_URL,
                    buildXundHtml(authCode),
                    "text/html",
                    "UTF-8",
                    null
                )
                binding.webView.visibility = View.VISIBLE
            } catch (e: Exception) {
                binding.tvError.text = "Failed to load XUND checker:\n${e.message}"
                binding.tvError.visibility = View.VISIBLE
            } finally {
                binding.progressBar.visibility = View.GONE
            }
        }
    }

    // ---------------------------------------------------------------------------
    // XUND JS API — embedded HTML
    // ---------------------------------------------------------------------------

    private fun buildXundHtml(authCode: String) = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>XUND Symptom Checker</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                html, body, #xundwebapp { width: 100%; height: 100%; }
            </style>
        </head>
        <body>
            <div id="xundwebapp" style="width:100vw; height:100vh;"></div>

            <!-- Load the XUND SDK (no data-attributes = JS API mode) -->
            <script src="https://public.xund.solutions/embed.js"></script>

            <script>
                (function () {
                    var xundApp = XUND.scic.init({
                        clientId:          '${XundAuthHelper.CLIENT_ID}',
                        webappCode:        '${XundAuthHelper.WEBAPP_CODE}',
                        authCode:          '$authCode',
                        targetContainerId: 'xundwebapp',
                        customization: {
                            directCheck: 'SYMPTOM_CHECK',
                            checkReport: {
                                actionButton: {
                                    labelText: 'Save Report',
                                    onClick: function () {
                                        xundApp.getReportData().then(function (report) {
                                            if (report) {
                                                AndroidXund.onReportReceived(JSON.stringify(report));
                                            } else {
                                                AndroidXund.onReportNotAvailable();
                                            }
                                        }).catch(function () {
                                            AndroidXund.onReportNotAvailable();
                                        });
                                    }
                                }
                            },
                            onReportShown: function (payload) {
                                // Fired automatically when the report screen appears.
                                // payload = { reportData: { ... } }
                                var data = (payload && payload.reportData) ? payload.reportData : payload;
                                AndroidXund.onReportShown(JSON.stringify(data));
                            }
                        }
                    });
                })();
            </script>
        </body>
        </html>
    """.trimIndent()

    // ---------------------------------------------------------------------------
    // JavaScript → Kotlin bridge
    // Registered as "AndroidXund" — called from the XUND JS API callbacks above.
    // ---------------------------------------------------------------------------

    inner class XundBridge {

        /** Called by the onReportShown customization hook when the report screen appears. */
        @JavascriptInterface
        fun onReportShown(reportJson: String) {
            lastReportJson = reportJson
            runOnUiThread { reportDialog.showReportReceived(reportJson) }
        }

        /** Called by the checkReport actionButton onClick handler. */
        @JavascriptInterface
        fun onReportReceived(reportJson: String) {
            lastReportJson = reportJson
            runOnUiThread { reportDialog.showReportJson(reportJson) }
        }

        /** Called when getReportData() resolves with no data. */
        @JavascriptInterface
        fun onReportNotAvailable() {
            runOnUiThread { reportDialog.showNoReport() }
        }
    }
}
