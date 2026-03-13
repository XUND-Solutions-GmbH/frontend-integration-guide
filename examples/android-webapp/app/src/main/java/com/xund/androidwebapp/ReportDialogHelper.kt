package com.xund.androidwebapp

import android.app.AlertDialog
import android.graphics.Color
import android.graphics.Typeface
import android.widget.HorizontalScrollView
import android.widget.ScrollView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import org.json.JSONArray
import org.json.JSONObject

/**
 * Displays XUND report data in alert dialogs.
 * Extracted from WebViewActivity to keep the integration code focused.
 */
class ReportDialogHelper(private val activity: AppCompatActivity) {

    /** Notification shown when the report screen appears via the onReportShown hook. */
    fun showReportReceived(reportJson: String) {
        AlertDialog.Builder(activity)
            .setTitle("Report Received")
            .setMessage("A check report has been generated.")
            .setPositiveButton("View Report") { dialog, _ ->
                dialog.dismiss()
                showReportJson(reportJson)
            }
            .setNegativeButton("Dismiss", null)
            .show()
    }

    /** Shows the report as pretty-printed JSON in a scrollable dialog. */
    fun showReportJson(reportJson: String) {
        val tv = TextView(activity).apply {
            text = prettyPrint(reportJson)
            textSize = 12f
            typeface = Typeface.MONOSPACE
            setTextColor(Color.parseColor("#1A1A2E"))
            setPadding(48, 32, 48, 32)
            isSingleLine = false
            setHorizontallyScrolling(true)
        }

        AlertDialog.Builder(activity)
            .setTitle("Report Data")
            .setView(ScrollView(activity).apply {
                addView(HorizontalScrollView(activity).apply { addView(tv) })
            })
            .setPositiveButton("Close", null)
            .show()
    }

    /** Shown when no report is available yet. */
    fun showNoReport() {
        AlertDialog.Builder(activity)
            .setTitle("No Report Available")
            .setMessage("Complete a symptom check first to generate a report.")
            .setPositiveButton("OK", null)
            .show()
    }

    private fun prettyPrint(json: String): String {
        return try {
            val trimmed = json.trim()
            if (trimmed.startsWith("[")) JSONArray(trimmed).toString(4)
            else JSONObject(trimmed).toString(4)
        } catch (e: Exception) {
            json
        }
    }
}
