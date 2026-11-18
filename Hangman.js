<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Day 12 — Hangman</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      min-height: 100vh;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a, #1e293b);
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      color: #e2e8f0;
      padding: 30px 20px;
    }

    .app {
      background: #0b1220;
      border: 1px solid #1e293b;
      border-radius: 20px;
      padding: 28px;
      width: 100%;
      max-width: 560px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
    }

    h1 { font-size: 1.4rem; margin-bottom: 4px; text-align: center; }
    .sub { color: #94a3b8; font-size: 0.82rem; margin-bottom: 20px; text-align: center; }

    /* ---------- Category pills ---------- */
    .categories {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 20px;
    }
    .cat-btn {
      background: #020617;
      border: 1px solid #1e293b;
      color: #94a3b8;
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 0.78rem;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s;
    }
    .cat-btn:hover { color: #e2e8f0; }
    .cat-btn.active {
      background: #1e3a8a;
      border-color: #1e3a8a;
      color: #93c5fd;
    }

    /* ---------- Gallows + stats ---------- */
    .top {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 20px;
      align-items: center;
      margin-bottom: 20px;
    }

    .gallows {
      background: #020617;
      border: 1px solid #1e293b;
      border-radius: 12px;
      padding: 12px;
      font-family: "Courier New", monospace;
      font-size: 0.82rem;
      line-height: 1.15;
      white-space: pre;
      color: #94a3b8;
      min-width: 150px;
      text-align: left;
    }
    .gallows .head  { color: #f87171; font-weight: 700; }
    .gallows .body  { color: #fbbf24; font-weight: 700; }

    .stats {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .stat-line {
      font-size: 0.88rem;
      color: #94a3b8;
    }
    .stat-line strong { color: #e2e8f0; }
    .lives-dots {
      display: flex;
      gap: 4px;
      margin-top: 4px;
    }
    .life {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #ef4444;
      transition: background 0.3s, transform 0.3s;
    }
    .life.lost {
      background: #1e293b;
      transform: scale(0.75);
    }

    /* ---------- Word ---------- */
    .word {
      display: flex;
      gap: 6px;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 24px;
      min-height: 44px;
    }
    .letter-box {
      width: 34px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 3px solid #334155;
      font-size: 1.4rem;
      font-weight: 700;
      font-family: "Courier New", monospace;
      color: #e2e8f0;
      transition: color 0.2s, border-color 0.2s;
    }
    .letter-box.filled {
      color: #38bdf8;
      border-color: #38bdf8;
      animation: pop 0.2s ease;
    }
    .letter-box.missed {
      color: #f87171;
      border-color: #7f1d1d;
    }
    @keyframes pop {
      0%   { transform: scale(0.5); }
      100% { transform: scale(1); }
    }

    /* ---------- On-screen keyboard ---------- */
    .keyboard {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 6px;
      margin-bottom: 20px;
    }
    .key {
      background: #1e293b;
      border: none;
      color: #e2e8f0;
      padding: 12px 0;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s;
      font-family: inherit;
    }
    .key:hover:not(:disabled) { background: #334155; }
    .key:active:not(:disabled) { transform: scale(0.94); }
    .key:disabled { cursor: not-allowed; opacity: 0.85; }

    .key.correct {
      background: #064e3b;
      color: #10b981;
    }
    .key.wrong {
      background: #7f1d1d;
      color: #f87171;
    }

    /* ---------- Status ---------- */
    .status {
      text-align: center;
      font-size: 1rem;
      font-weight: 600;
      min-height: 26px;
      margin-bottom: 16px;
      color: #94a3b8;
    }
    .status.won  { color: #10b981; }
    .status.lost { color: #f87171; }

    /* ---------- Buttons ---------- */
    .actions { display: flex; gap: 8px; }
    .actions button {
      flex: 1;
      border: none;
      padding: 12px;
      border-radius: 10px;
      font-size: 0.92rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s, transform 0.08s;
      font-family: inherit;
    }
    .new-btn { background: #6366f1; color: #fff; }
    .new-btn:hover { background: #4f46e5; }
    .new-btn:active { transform: scale(0.97); }

    .reset-btn { background: #1e293b; color: #e2e8f0; }
    .reset-btn:hover { background: #334155; }

    footer {
      text-align: center;
      color: #64748b;
      font-size: 0.76rem;
      margin-top: 18px;
    }
  </style>
</head>
<body>
  <main class="app">
    <h1>🪢 Hangman</h1>
    <p class="sub">Day 12 — Guess the word before the gallows fill up</p>

    <div class="categories" id="categories"></div>

    <div class="top">
      <div class="gallows" id="gallows"></div>
      <div class="stats">
        <div class="stat-line">Category: <strong id="catLabel">—</strong></div>
        <div class="stat-line">Wrong guesses: <strong id="wrongCount">0 / 6</strong></div>
        <div class="lives-dots" id="livesDots"></div>
      </div>
    </div>

    <div class="word" id="word"></div>

    <div class="keyboard" id="keyboard"></div>

    <div class="status" id="status">Pick a letter to start 👇</div>

    <div class="actions">
      <button class="new-btn"   id="newBtn">🔄 New Word</button>
      <button class="reset-btn" id="resetBtn">Reset Stats</button>
    </div>

    <footer>Day 12 of my JavaScript challenge 🚀</footer>
  </main>

  <script>
    // ============================================
    // DAY 12 — Hangman
    // ============================================
    document.addEventListener("DOMContentLoaded", () => {
      const STATS_KEY  = "js-hangman-stats-day12";
      const MAX_LIVES  = 6;
      const ALPHABET   = "abcdefghijklmnopqrstuvwxyz".split("");

      const WORDS = {
        programming: ["python", "javascript", "developer", "keyboard", "algorithm", "variable", "function", "compiler", "database", "framework"],
        animals:     ["elephant", "giraffe", "penguin", "dolphin", "tiger", "kangaroo", "octopus", "cheetah", "flamingo"],
        countries:   ["kenya", "brazil", "canada", "japan", "germany", "nigeria", "australia", "mexico", "egypt"],
        food:        ["pizza", "sushi", "burger", "pasta", "chocolate", "banana", "mango", "avocado", "pancake"],
      };

      // Gallows stages (0 = safe, 6 = dead)
      const GALLOWS = [
        "  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========",
        "  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========",
        "  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========",
        "  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========",
        "  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========",
        "  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========",
        "  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n=========",
      ];

      const categoriesEl = document.getElementById("categories");
      const gallowsEl    = document.getElementById("gallows");
      const catLabelEl   = document.getElementById("catLabel");
      const wrongCountEl = document.getElementById("wrongCount");
      const livesDotsEl  = document.getElementById("livesDots");
      const wordEl       = document.getElementById("word");
      const keyboardEl   = document.getElementById("keyboard");
      const statusEl     = document.getElementById("status");
      const newBtn       = document.getElementById("newBtn");
      const resetBtn     = document.getElementById("resetBtn");

      let category  = "programming";
      let word      = "";
      let guessed   = new Set();
      let wrong     = 0;
      let gameOver  = false;
      let stats     = loadStats();

      // ---------- Stats ----------
      function loadStats() {
        try {
          const raw = localStorage.getItem(STATS_KEY);
          const s = raw ? JSON.parse(raw) : {};
          return {
            wins:   Number(s.wins)   || 0,
            losses: Number(s.losses) || 0,
          };
        } catch { return { wins: 0, losses: 0 }; }
      }
      function saveStats() {
        try { localStorage.setItem(STATS_KEY, JSON.stringify(stats)); } catch {}
      }

      // ---------- Render helpers ----------
      function renderCategories() {
        categoriesEl.innerHTML = Object.keys(WORDS)
          .map((c) => `<button class="cat-btn ${c === category ? "active" : ""}" data-cat="${c}">${cap(c)}</button>`)
          .join("");
        categoriesEl.querySelectorAll(".cat-btn").forEach((b) => {
          b.addEventListener("click", () => {
            if (b.dataset.cat === category) return;
            category = b.dataset.cat;
            newGame();
          });
        });
      }

      function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

      function renderGallows() {
        // simple: paint `O`, `|`, `/`, `\` in colors by swapping text nodes → keep raw
        // Using the text directly, browser shows it accurately.
        gallowsEl.textContent = GALLOWS[wrong];
      }

      function renderLives() {
        livesDotsEl.innerHTML = "";
        for (let i = 0; i < MAX_LIVES; i++) {
          const d = document.createElement("div");
          d.className = "life" + (i < MAX_LIVES - wrong ? "" : " lost");
          livesDotsEl.appendChild(d);
        }
        wrongCountEl.textContent = `${wrong} / ${MAX_LIVES}`;
      }

      function renderWord() {
        wordEl.innerHTML = "";
        for (const ch of word) {
          const box = document.createElement("div");
          box.className = "letter-box";
          if (guessed.has(ch)) {
            box.textContent = ch.toUpperCase();
            box.classList.add("filled");
          }
          wordEl.appendChild(box);
        }
      }

      function renderKeyboard() {
        keyboardEl.innerHTML = "";
        for (const ch of ALPHABET) {
          const b = document.createElement("button");
          b.className = "key";
          b.textContent = ch.toUpperCase();
          if (guessed.has(ch)) {
            b.disabled = true;
            b.classList.add(word.includes(ch) ? "correct" : "wrong");
          }
          if (gameOver) b.disabled = true;
          b.addEventListener("click", () => guess(ch));
          keyboardEl.appendChild(b);
        }
      }

      function setStatus(text, cls = "") {
        statusEl.textContent = text;
        statusEl.className = "status " + cls;
      }

      function renderAll() {
        renderGallows();
        renderLives();
        renderWord();
        renderKeyboard();
      }

      // ---------- Game flow ----------
      function newGame() {
        const pool = WORDS[category];
        word = pool[Math.floor(Math.random() * pool.length)];
        guessed = new Set();
        wrong = 0;
        gameOver = false;
        catLabelEl.textContent = cap(category);

        renderCategories();
        renderAll();
        setStatus("Pick a letter to start 👇");
      }

      function guess(ch) {
        if (gameOver) return;
        if (guessed.has(ch)) return;

        guessed.add(ch);

        if (word.includes(ch)) {
          if (isWordSolved()) {
            gameOver = true;
            stats.wins++;
            saveStats();
            renderAll();
            setStatus(`🎉 You won! Word: ${word.toUpperCase()} · W${stats.wins}/L${stats.losses}`, "won");
            return;
          }
          setStatus("✅ Nice guess!", "");
        } else {
          wrong++;
          if (wrong >= MAX_LIVES) {
            gameOver = true;
            stats.losses++;
            saveStats();
            renderAll();
            setStatus(`💀 You lost! Word was: ${word.toUpperCase()} · W${stats.wins}/L${stats.losses}`, "lost");
            return;
          }
          setStatus(`❌ "${ch.toUpperCase()}" isn't in the word.`, "");
        }

        renderAll();
      }

      function isWordSolved() {
        return [...word].every((c) => guessed.has(c));
      }

      function resetStats() {
        if (stats.wins === 0 && stats.losses === 0) return;
        if (!confirm("Reset win/loss stats to 0?")) return;
        stats = { wins: 0, losses: 0 };
        saveStats();
        setStatus("📊 Stats reset.", "");
      }

      // ---------- Physical keyboard ----------
      document.addEventListener("keydown", (e) => {
        const k = e.key.toLowerCase();
        if (k.length === 1 && k >= "a" && k <= "z") {
          // ignore if focus is on a button with real Enter/Space actions (safety)
          guess(k);
        } else if (k === "enter" && gameOver) {
          newGame();
        }
      });

      // ---------- Events ----------
      newBtn.addEventListener("click", newGame);
      resetBtn.addEventListener("click", resetStats);

      // ---------- Init ----------
      renderCategories();
      newGame();
    });
  </script>
</body>
</html>