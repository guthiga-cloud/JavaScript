<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Day 14 — Number Guessing Game</title>
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
    }

    .app {
      background: #0b1220;
      border: 1px solid #1e293b;
      border-radius: 20px;
      padding: 32px;
      width: 100%;
      max-width: 460px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
      text-align: center;
    }

    h1 { font-size: 1.4rem; margin-bottom: 4px; }
    .sub { color: #94a3b8; font-size: 0.85rem; margin-bottom: 20px; }

    /* ---------- Difficulty ---------- */
    .diffs {
      display: flex;
      gap: 6px;
      margin-bottom: 20px;
    }
    .diff-btn {
      flex: 1;
      background: #020617;
      border: 1px solid #1e293b;
      color: #94a3b8;
      padding: 10px 8px;
      border-radius: 10px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      font-family: inherit;
    }
    .diff-btn:hover { color: #e2e8f0; }
    .diff-btn.active {
      background: #1e3a8a;
      border-color: #1e3a8a;
      color: #93c5fd;
    }
    .diff-btn small {
      display: block;
      font-size: 0.65rem;
      color: #64748b;
      margin-top: 2px;
      font-weight: 400;
    }
    .diff-btn.active small { color: #93c5fd; }

    /* ---------- Stats ---------- */
    .stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 20px;
    }
    .stat-box {
      background: #020617;
      border-radius: 10px;
      padding: 10px;
    }
    .stat-label {
      font-size: 0.68rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 3px;
    }
    .stat-value {
      font-family: "Courier New", monospace;
      font-size: 1.2rem;
      font-weight: 700;
      color: #38bdf8;
    }
    .stat-value.warn { color: #fbbf24; }
    .stat-value.danger { color: #ef4444; }

    /* ---------- Message ---------- */
    .message {
      background: #020617;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 16px;
      font-size: 1.05rem;
      font-weight: 600;
      min-height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s;
      color: #94a3b8;
    }
    .message.high  { color: #38bdf8; }
    .message.low   { color: #fbbf24; }
    .message.win   { color: #10b981; font-size: 1.2rem; }
    .message.lose  { color: #ef4444; font-size: 1.15rem; }
    .message.error { color: #f87171; }

    /* ---------- Input row ---------- */
    .input-row {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }
    .input-row input {
      flex: 1;
      background: #020617;
      border: 2px solid #1e293b;
      border-radius: 10px;
      padding: 14px 16px;
      color: #38bdf8;
      font-size: 1.3rem;
      font-family: "Courier New", monospace;
      font-weight: 700;
      text-align: center;
      outline: none;
      transition: border 0.15s;
    }
    .input-row input:focus { border-color: #6366f1; }
    .input-row input:disabled { opacity: 0.5; cursor: not-allowed; }

    .guess-btn {
      background: #6366f1;
      border: none;
      color: #fff;
      padding: 0 22px;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.15s, transform 0.08s;
      font-family: inherit;
    }
    .guess-btn:hover:not(:disabled)  { background: #4f46e5; }
    .guess-btn:active:not(:disabled) { transform: scale(0.96); }
    .guess-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    /* ---------- Guess history ---------- */
    .history {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      justify-content: center;
      min-height: 28px;
      margin-bottom: 16px;
    }
    .guess-chip {
      background: #1e293b;
      color: #94a3b8;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.78rem;
      font-family: "Courier New", monospace;
    }
    .guess-chip.high { color: #38bdf8; }
    .guess-chip.low  { color: #fbbf24; }
    .guess-chip.hit  { background: #064e3b; color: #10b981; font-weight: 700; }

    /* ---------- Action button ---------- */
    .new-btn {
      width: 100%;
      background: #1e293b;
      border: none;
      color: #e2e8f0;
      padding: 13px;
      border-radius: 10px;
      font-size: 0.92rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s, transform 0.08s;
      font-family: inherit;
    }
    .new-btn:hover  { background: #334155; }
    .new-btn:active { transform: scale(0.98); }

    footer {
      text-align: center;
      color: #64748b;
      font-size: 0.78rem;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <main class="app">
    <h1>🔢 Number Guessing</h1>
    <p class="sub">Day 14 — Guess the secret number</p>

    <div class="diffs" id="diffs">
      <button class="diff-btn" data-diff="easy">
        Easy<small>1–50 · 10 tries</small>
      </button>
      <button class="diff-btn active" data-diff="medium">
        Medium<small>1–100 · 7 tries</small>
      </button>
      <button class="diff-btn" data-diff="hard">
        Hard<small>1–500 · 6 tries</small>
      </button>
    </div>

    <div class="stats">
      <div class="stat-box">
        <div class="stat-label">Range</div>
        <div class="stat-value" id="rangeLabel">1 – 100</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Attempts Left</div>
        <div class="stat-value" id="attemptsLeft">7</div>
      </div>
    </div>

    <div class="message" id="message">Enter a number and guess! 👇</div>

    <div class="input-row">
      <input
        type="number"
        id="guessInput"
        placeholder="?"
        autocomplete="off"
        inputmode="numeric"
      />
      <button class="guess-btn" id="guessBtn">Guess</button>
    </div>

    <div class="history" id="history"></div>

    <button class="new-btn" id="newBtn">🔄 New Game</button>

    <footer>Day 14 of my JavaScript challenge 🚀</footer>
  </main>

  <script>
    // ============================================
    // DAY 14 — Number Guessing Game
    // ============================================
    document.addEventListener("DOMContentLoaded", () => {
      const BEST_KEY = "js-guess-best-day14";

      const LEVELS = {
        easy:   { min: 1, max: 50,  tries: 10, label: "1 – 50",  key: "easy"   },
        medium: { min: 1, max: 100, tries: 7,  label: "1 – 100", key: "medium" },
        hard:   { min: 1, max: 500, tries: 6,  label: "1 – 500", key: "hard"   },
      };

      const diffsEl     = document.getElementById("diffs");
      const rangeEl     = document.getElementById("rangeLabel");
      const attemptsEl  = document.getElementById("attemptsLeft");
      const messageEl   = document.getElementById("message");
      const inputEl     = document.getElementById("guessInput");
      const guessBtn    = document.getElementById("guessBtn");
      const historyEl   = document.getElementById("history");
      const newBtn      = document.getElementById("newBtn");

      let level       = "medium";
      let secret      = 0;
      let triesLeft   = 0;
      let guesses     = [];         // [{value, result: 'high'|'low'|'hit'}]
      let gameOver    = false;
      let bestScores  = loadBest();

      // ---------- Best scores ----------
      function loadBest() {
        try {
          const raw = localStorage.getItem(BEST_KEY);
          const data = raw ? JSON.parse(raw) : {};
          return {
            easy:   Number(data.easy)   || 0,
            medium: Number(data.medium) || 0,
            hard:   Number(data.hard)   || 0,
          };
        } catch { return { easy: 0, medium: 0, hard: 0 }; }
      }
      function saveBest() {
        try { localStorage.setItem(BEST_KEY, JSON.stringify(bestScores)); } catch {}
      }

      // ---------- Start game ----------
      function startGame() {
        const cfg = LEVELS[level];
        secret = Math.floor(Math.random() * (cfg.max - cfg.min + 1)) + cfg.min;
        triesLeft = cfg.tries;
        guesses = [];
        gameOver = false;

        rangeEl.textContent    = cfg.label;
        inputEl.value          = "";
        inputEl.disabled       = false;
        guessBtn.disabled      = false;
        inputEl.min             = cfg.min;
        inputEl.max             = cfg.max;

        updateAttemptsUI();
        renderHistory();
        setMessage("Enter a number and guess! 👇");
        updateDifficultyUI();
        inputEl.focus();
      }

      // ---------- Difficulty ----------
      function updateDifficultyUI() {
        diffsEl.querySelectorAll(".diff-btn").forEach((b) => {
          const active = b.dataset.diff === level;
          b.classList.toggle("active", active);
          if (active) {
            const best = bestScores[level];
            b.querySelector("small").textContent =
              best > 0
                ? `${LEVELS[level].label} · best: ${best} tries`
                : `${LEVELS[level].label} · ${LEVELS[level].tries} tries`;
          } else {
            b.querySelector("small").textContent =
              `${LEVELS[level] ? LEVELS[b.dataset.diff].label : ""} · ${LEVELS[b.dataset.diff].tries} tries`;
          }
        });
      }

      function setLevel(newLevel) {
        if (newLevel === level) return;
        level = newLevel;
        startGame();
      }

      // ---------- Guess ----------
      function submitGuess() {
        if (gameOver) return;

        const raw = inputEl.value.trim();
        if (!raw) {
          setMessage("⚠️ Enter a number first.", "error");
          inputEl.focus();
          return;
        }

        const val = Number(raw);
        const cfg = LEVELS[level];

        if (!Number.isInteger(val) || val < cfg.min || val > cfg.max) {
          setMessage(`⚠️ Enter a whole number between ${cfg.min} and ${cfg.max}.`, "error");
          inputEl.value = "";
          inputEl.focus();
          return;
        }

        // Prevent duplicate guesses — still count? Better: warn but don't count
        if (guesses.some((g) => g.value === val)) {
          setMessage(`⚠️ You already guessed ${val}. Try another number.`, "error");
          inputEl.value = "";
          inputEl.focus();
          return;
        }

        // Valid guess
        triesLeft--;

        let outcome;
        let message = "";
        let cls = "";

        if (val === secret) {
          outcome = "hit";
          gameOver = true;
          inputEl.disabled  = true;
          guessBtn.disabled = true;
          message = `🎉 Correct! The number was ${secret}. You got it in ${cfg.tries - triesLeft} tr${(cfg.tries - triesLeft) === 1 ? "y" : "ies"}.`;
          cls = "win";

          // Update best score
          const used = cfg.tries - triesLeft;
          const prevBest = bestScores[level];
          if (prevBest === 0 || used < prevBest) {
            bestScores[level] = used;
            saveBest();
            message += " 🏆 NEW BEST!";
          }
          updateDifficultyUI();
        } else {
          const distance = Math.abs(val - secret);

          if (val < secret) {
            outcome = "low";
            cls = "low";
            message = `⬆️ Higher! ${distance > cfg.tries * 3 ? "You're far off." : "Getting closer."}`;
          } else {
            outcome = "high";
            cls = "high";
            message = `⬇️ Lower! ${distance > cfg.tries * 3 ? "You're far off." : "Getting closer."}`;
          }

          if (triesLeft === 0) {
            gameOver = true;
            inputEl.disabled  = true;
            guessBtn.disabled = true;
            message = `💀 Out of tries! The number was ${secret}.`;
            cls = "lose";
          }
        }

        guesses.push({ value: val, result: outcome });

        // Hot/cold micro-hint appended (only on non-terminal outcomes)
        if (!gameOver && outcome !== "hit") {
          const distance = Math.abs(val - secret);
          if (distance <= 3) message += " 🔥 Very hot!";
          else if (distance <= 10) message += " 🌡️ Warm.";
          else if (distance <= 30) message += " ❄️ Cold.";
          else message += " 🧊 Freezing!";
        }

        setMessage(message, cls);
        updateAttemptsUI();
        renderHistory();

        if (!gameOver) {
          inputEl.value = "";
          inputEl.focus();
        } else {
          inputEl.value = "";
        }
      }

      function updateAttemptsUI() {
        attemptsEl.textContent = triesLeft;
        attemptsEl.className = "stat-value";
        if (triesLeft <= 2) attemptsEl.classList.add("danger");
        else if (triesLeft <= 4) attemptsEl.classList.add("warn");
      }

      function renderHistory() {
        historyEl.innerHTML = "";
        for (const g of guesses) {
          const chip = document.createElement("span");
          chip.className = "guess-chip " + (g.result === "hit" ? "hit" : g.result);
          chip.textContent = g.value;
          historyEl.appendChild(chip);
        }
      }

      function setMessage(text, cls = "") {
        messageEl.textContent = text;
        messageEl.className = "message " + cls;
      }

      // ---------- Events ----------
      guessBtn.addEventListener("click", submitGuess);
      inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") submitGuess();
      });
      newBtn.addEventListener("click", startGame);

      diffsEl.querySelectorAll(".diff-btn").forEach((b) => {
        b.addEventListener("click", () => setLevel(b.dataset.diff));
      });

      // ---------- Init ----------
      startGame();
    });
  </script>
</body>
</html>