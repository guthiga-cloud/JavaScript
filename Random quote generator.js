<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Day 7 — Random Quote Generator</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a, #1e293b);
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      color: #e2e8f0;
      padding: 20px;
      transition: background 0.4s ease;
    }

    /* Each new quote gently shifts the background hue */
    body.theme-1 { background: linear-gradient(135deg, #0f172a, #1e293b); }
    body.theme-2 { background: linear-gradient(135deg, #1a0f2a, #2e1b47); }
    body.theme-3 { background: linear-gradient(135deg, #0a2426, #0f3a3c); }
    body.theme-4 { background: linear-gradient(135deg, #2a1a0f, #3d2a18); }
    body.theme-5 { background: linear-gradient(135deg, #1a0f0f, #2e1b1b); }

    .card {
      background: rgba(11, 18, 32, 0.85);
      backdrop-filter: blur(10px);
      border: 1px solid #1e293b;
      border-radius: 20px;
      padding: 40px 32px;
      width: 100%;
      max-width: 520px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      text-align: center;
      position: relative;
    }

    h1 {
      font-size: 1.4rem;
      margin-bottom: 6px;
    }
    .sub {
      color: #94a3b8;
      font-size: 0.85rem;
      margin-bottom: 28px;
    }

    /* ---------- Quote ---------- */
    .quote-wrap {
      min-height: 160px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-bottom: 28px;
      padding: 20px;
      background: #020617;
      border-radius: 14px;
      position: relative;
    }

    .big-quote {
      position: absolute;
      top: 8px;
      left: 16px;
      font-size: 3rem;
      line-height: 1;
      color: #6366f1;
      opacity: 0.35;
      font-family: Georgia, serif;
      user-select: none;
    }

    .quote-text {
      font-size: 1.1rem;
      line-height: 1.6;
      font-weight: 500;
      color: #e2e8f0;
      margin-bottom: 14px;
      font-style: italic;
      position: relative;
      z-index: 1;
    }

    .quote-author {
      font-size: 0.9rem;
      color: #38bdf8;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .quote-author::before {
      content: "— ";
    }

    /* Fade animation on quote change */
    .fade-in {
      animation: fadeIn 0.4s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ---------- Status ---------- */
    .status {
      display: inline-block;
      font-size: 0.72rem;
      padding: 3px 10px;
      border-radius: 999px;
      background: #1e293b;
      color: #94a3b8;
      margin-bottom: 20px;
      letter-spacing: 0.5px;
    }
    .status.live    { color: #10b981; border: 1px solid #064e3b; }
    .status.offline { color: #fbbf24; border: 1px solid #78350f; }
    .status.loading { color: #94a3b8; }

    /* ---------- Buttons ---------- */
    .buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 20px;
    }
    .buttons .full { grid-column: span 2; }

    button {
      background: #6366f1;
      color: #fff;
      border: none;
      padding: 14px;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s, transform 0.08s, opacity 0.2s;
      font-family: inherit;
    }
    button:hover:not(:disabled)  { background: #4f46e5; }
    button:active:not(:disabled) { transform: scale(0.97); }
    button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    button.ghost {
      background: #1e293b;
      color: #e2e8f0;
    }
    button.ghost:hover:not(:disabled) { background: #334155; }

    /* ---------- Quote counter ---------- */
    .counter {
      color: #64748b;
      font-size: 0.78rem;
      margin-top: 4px;
    }

    footer {
      margin-top: 20px;
      color: #64748b;
      font-size: 0.8rem;
    }
  </style>
</head>
<body class="theme-1">
  <main class="card">
    <h1>💬 Random Quote</h1>
    <p class="sub">Day 7 — Fresh inspiration on demand</p>

    <div class="quote-wrap">
      <span class="big-quote">“</span>
      <div class="quote-text"   id="quoteText">Loading…</div>
      <div class="quote-author" id="quoteAuthor"></div>
    </div>

    <span class="status loading" id="status">initializing…</span>

    <div class="buttons">
      <button class="full" id="newBtn">🎲 New Quote</button>
      <button class="ghost" id="copyBtn" disabled>📋 Copy</button>
      <button class="ghost" id="tweetBtn" disabled>🐦 Tweet</button>
    </div>

    <div class="counter" id="counter"></div>

    <footer>Day 7 of my JavaScript challenge 🚀</footer>
  </main>

  <script>
    // ============================================
    // DAY 7 — Random Quote Generator
    // Fetches from api.quotable.io, falls back to
    // built-in quotes if the network fails.
    // ============================================
    document.addEventListener("DOMContentLoaded", () => {
      const API_URL = "https://api.quotable.io/random";

      const quoteTextEl   = document.getElementById("quoteText");
      const quoteAuthorEl = document.getElementById("quoteAuthor");
      const statusEl      = document.getElementById("status");
      const newBtn        = document.getElementById("newBtn");
      const copyBtn       = document.getElementById("copyBtn");
      const tweetBtn      = document.getElementById("tweetBtn");
      const counterEl     = document.getElementById("counter");

      // ---------- Offline fallback quotes ----------
      const FALLBACK = [
        { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { content: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
        { content: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
        { content: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
        { content: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
        { content: "First, solve the problem. Then, write the code.", author: "John Johnson" },
        { content: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
        { content: "The best way to predict the future is to invent it.", author: "Alan Kay" },
        { content: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
        { content: "Premature optimization is the root of all evil.", author: "Donald Knuth" },
      ];

      // ---------- State ----------
      let currentQuote = null;
      let fetchCount   = 0;
      const THEME_CLASSES = ["theme-1", "theme-2", "theme-3", "theme-4", "theme-5"];

      // ---------- Fetch ----------
      async function fetchQuote() {
        newBtn.disabled = true;
        copyBtn.disabled = true;
        tweetBtn.disabled = true;
        setStatus("loading", "fetching…");

        try {
          const res = await fetch(API_URL, { signal: AbortSignal.timeout(8000) });
          if (!res.ok) throw new Error("HTTP " + res.status);
          const data = await res.json();

          if (!data.content || !data.author) throw new Error("Bad response");

          currentQuote = { content: data.content, author: data.author };
          setStatus("live", "🌐 live API");
        } catch (err) {
          console.warn("API failed, using fallback:", err);
          const pick = FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
          currentQuote = pick;
          setStatus("offline", "📦 offline fallback");
        }

        renderQuote(currentQuote);
        fetchCount++;
        counterEl.textContent = `Loaded ${fetchCount} quote${fetchCount === 1 ? "" : "s"}`;

        newBtn.disabled = false;
        copyBtn.disabled = false;
        tweetBtn.disabled = false;
      }

      // ---------- Render ----------
      function renderQuote(q) {
        quoteTextEl.textContent   = q.content;
        quoteAuthorEl.textContent = q.author;

        // fade animation
        quoteTextEl.classList.remove("fade-in");
        quoteAuthorEl.classList.remove("fade-in");
        void quoteTextEl.offsetWidth; // force reflow
        quoteTextEl.classList.add("fade-in");
        quoteAuthorEl.classList.add("fade-in");

        // rotate background theme
        const next = THEME_CLASSES[Math.floor(Math.random() * THEME_CLASSES.length)];
        document.body.className = next;
      }

      function setStatus(kind, text) {
        statusEl.className = "status " + kind;
        statusEl.textContent = text;
      }

      // ---------- Actions ----------
      async function copyQuote() {
        if (!currentQuote) return;
        const full = `"${currentQuote.content}" — ${currentQuote.author}`;
        try {
          await navigator.clipboard.writeText(full);
          const original = copyBtn.textContent;
          copyBtn.textContent = "✅ Copied!";
          setTimeout(() => { copyBtn.textContent = original; }, 1500);
        } catch {
          // fallback for older browsers
          const ta = document.createElement("textarea");
          ta.value = full;
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand("copy"); copyBtn.textContent = "✅ Copied!"; }
          catch { copyBtn.textContent = "❌ Failed"; }
          setTimeout(() => { copyBtn.textContent = "📋 Copy"; }, 1500);
          document.body.removeChild(ta);
        }
      }

      function tweetQuote() {
        if (!currentQuote) return;
        const text = `"${currentQuote.content}" — ${currentQuote.author}`;
        const url  = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
        window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
      }

      // ---------- Events ----------
      newBtn.addEventListener("click", fetchQuote);
      copyBtn.addEventListener("click", copyQuote);
      tweetBtn.addEventListener("click", tweetQuote);

      // keyboard: Space / N → new quote
      document.addEventListener("keydown", (e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
        if (e.key === " " || e.key.toLowerCase() === "n") {
          e.preventDefault();
          if (!newBtn.disabled) fetchQuote();
        }
      });

      // ---------- Init ----------
      fetchQuote();
    });
  </script>
</body>
</html>