"""
BigQuery Release Notes Viewer
Flask application that fetches and displays BigQuery release notes.
"""

import requests
import feedparser
from flask import Flask, render_template, jsonify

app = Flask(__name__)

FEED_URL = "https://docs.cloud.google.com/feeds/bigquery-release-notes.xml"


def fetch_release_notes():
    """Fetch and parse BigQuery release notes from the Atom/XML feed."""
    try:
        response = requests.get(FEED_URL, timeout=15)
        response.raise_for_status()
    except requests.RequestException as e:
        return {"error": f"Failed to fetch feed: {e}", "entries": []}

    feed = feedparser.parse(response.text)

    entries = []
    for entry in feed.entries:
        entries.append({
            "id": entry.get("id", ""),
            "title": entry.get("title", "Untitled"),
            "link": entry.get("link", "#"),
            "updated": entry.get("updated", ""),
            "summary": entry.get("summary", ""),
        })

    return {
        "feed_title": feed.feed.get("title", "BigQuery Release Notes"),
        "feed_updated": feed.feed.get("updated", ""),
        "entries": entries,
    }


@app.route("/")
def index():
    """Render the main page."""
    return render_template("index.html")


@app.route("/api/notes")
def api_notes():
    """API endpoint returning release notes as JSON."""
    data = fetch_release_notes()
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
