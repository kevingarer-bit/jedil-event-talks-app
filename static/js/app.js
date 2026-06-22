/**
 * BigQuery Release Notes – Client-side logic
 */

(function () {
  "use strict";

  // ── DOM refs ──
  const refreshBtn   = document.getElementById("refresh-btn");
  const notesGrid    = document.getElementById("notes-grid");
  const feedUpdated  = document.getElementById("feed-updated");
  const noteCount    = document.getElementById("note-count");
  const emptyState   = document.getElementById("empty-state");
  const emptyMsg     = document.getElementById("empty-msg");

  // Modal refs
  const tweetModal   = document.getElementById("tweet-modal");
  const tweetText    = document.getElementById("tweet-text");
  const charCount    = document.getElementById("char-count");
  const modalClose   = document.getElementById("modal-close");
  const tweetCancel  = document.getElementById("tweet-cancel");
  const tweetSubmit  = document.getElementById("tweet-submit");

  // ── Helpers ──

  /** Format an ISO-ish date string to a friendly locale string. */
  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  /** Strip HTML tags and decode entities for plain text. */
  function stripHtml(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  /** Render n skeleton placeholder cards. */
  function showSkeletons(n) {
    notesGrid.innerHTML = "";
    for (let i = 0; i < n; i++) {
      const skel = document.createElement("div");
      skel.className = "skeleton-card";
      skel.innerHTML = `
        <div class="skeleton-line w40"></div>
        <div class="skeleton-line w70 h18"></div>
        <div class="skeleton-line w100"></div>
        <div class="skeleton-line w90"></div>
        <div class="skeleton-line w70"></div>
      `;
      notesGrid.appendChild(skel);
    }
  }

  // ── Fetch & Render ──

  async function loadNotes() {
    // Enter loading state
    refreshBtn.classList.add("loading");
    refreshBtn.disabled = true;
    emptyState.classList.add("hidden");
    showSkeletons(6);

    try {
      const res = await fetch("/api/notes");
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();

      if (data.error) {
        showError(data.error);
        return;
      }

      // Update header
      feedUpdated.textContent = data.feed_updated
        ? `Last updated: ${formatDate(data.feed_updated)}`
        : "Google BigQuery";

      const entries = data.entries || [];
      noteCount.textContent = `${entries.length} note${entries.length !== 1 ? "s" : ""}`;

      if (entries.length === 0) {
        notesGrid.innerHTML = "";
        showError("No release notes found.");
        return;
      }

      renderCards(entries);
    } catch (err) {
      console.error(err);
      showError("Could not load release notes. Please try again.");
    } finally {
      refreshBtn.classList.remove("loading");
      refreshBtn.disabled = false;
    }
  }

  function showError(msg) {
    notesGrid.innerHTML = "";
    emptyMsg.textContent = msg;
    emptyState.classList.remove("hidden");
  }

  function renderCards(entries) {
    notesGrid.innerHTML = "";
    emptyState.classList.add("hidden");

    entries.forEach((entry, idx) => {
      const card = document.createElement("article");
      card.className = "note-card";
      card.style.animationDelay = `${idx * 40}ms`;

      const dateStr = formatDate(entry.updated);
      const plainSummary = entry.summary || "";

      card.innerHTML = `
        <span class="card-date">${dateStr}</span>
        <h2 class="card-title"><a href="${entry.link}" target="_blank" rel="noopener noreferrer">${entry.title}</a></h2>
        <div class="card-summary">${plainSummary}</div>
        <div class="card-actions">
          <button class="btn-card btn-tweet-card" data-title="${encodeURIComponent(entry.title)}" data-link="${encodeURIComponent(entry.link)}">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Share on 𝕏
          </button>
          <a class="btn-card btn-open" href="${entry.link}" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Open
          </a>
        </div>
      `;

      notesGrid.appendChild(card);
    });

    // Attach tweet-card button listeners
    document.querySelectorAll(".btn-tweet-card").forEach((btn) => {
      btn.addEventListener("click", () => openTweetModal(btn));
    });
  }

  // ── Tweet Modal ──

  function openTweetModal(btn) {
    const title = decodeURIComponent(btn.dataset.title);
    const link  = decodeURIComponent(btn.dataset.link);
    const draft = `🚀 BigQuery Update: ${title}\n\nRead more → ${link}\n\n#BigQuery #GoogleCloud #DataEngineering`;
    tweetText.value = draft;
    updateCharCount();
    tweetModal.classList.remove("hidden");
    tweetText.focus();
  }

  function closeTweetModal() {
    tweetModal.classList.add("hidden");
  }

  function updateCharCount() {
    const len = tweetText.value.length;
    charCount.textContent = len;
    charCount.style.color = len > 260 ? "#f87171" : "";
  }

  function submitTweet() {
    const text = encodeURIComponent(tweetText.value);
    const url  = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=400");
    closeTweetModal();
  }

  // ── Events ──

  refreshBtn.addEventListener("click", loadNotes);

  tweetText.addEventListener("input", updateCharCount);
  modalClose.addEventListener("click", closeTweetModal);
  tweetCancel.addEventListener("click", closeTweetModal);
  tweetSubmit.addEventListener("click", submitTweet);

  // Close modal on overlay click
  tweetModal.addEventListener("click", (e) => {
    if (e.target === tweetModal) closeTweetModal();
  });

  // Close modal on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !tweetModal.classList.contains("hidden")) {
      closeTweetModal();
    }
  });

  // ── Init ──
  loadNotes();
})();
