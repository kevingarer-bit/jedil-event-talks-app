# BigQuery Release Notes Viewer

A sleek, dark-mode web dashboard that fetches the latest **Google BigQuery release notes** from the official Atom feed and presents them in a beautiful, interactive interface — with the ability to share any update directly on **𝕏 (Twitter)**.

![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.1-000000?logo=flask&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📡 **Live Feed** | Fetches release notes in real time from Google's official [BigQuery RSS/Atom feed](https://docs.cloud.google.com/feeds/bigquery-release-notes.xml) |
| 🔄 **Refresh** | One-click refresh button with an animated spinner and skeleton loading placeholders |
| 🐦 **Share on 𝕏** | Select any release note and compose a tweet — opens via Twitter's intent API with a pre-filled draft |
| 🎨 **Premium UI** | Dark-mode glassmorphism design with ambient gradient blobs, Inter typography, and micro-animations |
| 📱 **Responsive** | Fully responsive grid layout that adapts from desktop to mobile |
| 🔗 **Direct Links** | Each card links directly to the official Google Cloud documentation |

---

## 🖥️ Tech Stack

- **Backend:** Python 3 + Flask
- **Feed Parsing:** `feedparser` + `requests`
- **Frontend:** Vanilla HTML, CSS, JavaScript (no frameworks)
- **Fonts:** [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts

---

## 📁 Project Structure

```
.
├── app.py                  # Flask application (routes + feed parser)
├── requirements.txt        # Python dependencies
├── static/
│   ├── css/
│   │   └── style.css       # Design system (dark mode, animations, layout)
│   └── js/
│       └── app.js          # Client-side logic (fetch, render, tweet modal)
└── templates/
    └── index.html          # Main HTML page
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+** installed
- **pip** or [**uv**](https://docs.astral.sh/uv/) package manager

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/kevingarer-bit/jedil-event-talks-app.git
   cd jedil-event-talks-app
   ```

2. **Create a virtual environment and install dependencies:**

   Using `uv` (recommended):
   ```bash
   uv venv .venv
   source .venv/bin/activate
   uv pip install -r requirements.txt
   ```

   Or using `pip`:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Run the application:**

   ```bash
   python app.py
   ```

4. **Open your browser** and navigate to:

   ```
   http://127.0.0.1:5000
   ```

---

## 📖 How to Use

### Viewing Release Notes

When the app loads, it automatically fetches the latest BigQuery release notes from Google's feed. Each note is displayed as a card showing the **date**, **title**, and a **summary** of the update.

### Refreshing the Feed

Click the **Refresh** button in the top-right corner of the header. A spinner animation will appear along with skeleton placeholder cards while the new data is being fetched.

### Sharing on 𝕏 (Twitter)

1. Find the release note you want to share.
2. Click the **"Share on 𝕏"** button on that card.
3. A modal will open with a pre-composed tweet including the note title, link, and relevant hashtags (`#BigQuery`, `#GoogleCloud`, `#DataEngineering`).
4. Edit the text as you wish — a live character counter (max 280) is shown.
5. Click **"Post on 𝕏"** to open Twitter's compose window with your message ready to post.

### Opening the Full Release Note

Click the **"Open"** button on any card (or click the card title) to open the full release note on Google Cloud's official documentation in a new tab.

---

## 🔌 API Reference

The app exposes a single internal JSON API:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/notes` | Returns all parsed release notes as JSON |

**Example response:**

```json
{
  "feed_title": "BigQuery - Release notes",
  "feed_updated": "2026-06-17T00:00:00Z",
  "entries": [
    {
      "id": "...",
      "title": "June 17, 2026",
      "link": "https://cloud.google.com/bigquery/docs/release-notes#June_17_2026",
      "updated": "2026-06-17T00:00:00Z",
      "summary": "<p>BigQuery now supports...</p>"
    }
  ]
}
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).
