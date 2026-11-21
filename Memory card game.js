<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Day 15 — Memory Card Game</title>
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
      max-width: 480px;
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
      padding: 8px;
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

    /* ---------- Stats ---------- */
    .stats {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
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
      font-size: 1.15rem;
      font-weight: 700;
      color: #38bdf8;
    }

    /* ---------- Board ---------- */
    .board {
      display: grid;
      gap: 8px;
      margin-bottom: 20px;
    }
    .board.easy   { grid-template-columns: repeat(4, 1fr); }
    .board.medium { grid-template-columns: repeat(4, 1fr); }
    .board.hard   { grid-template-columns: repeat(5, 1fr); }

    .card {
      aspect-ratio: 1 / 1;
      position: relative;
      cursor: pointer;
      perspective: 600px;
      user-select: none;
    }
    .card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .card.flipped .card-inner,
    .card.matched .card-inner {
      transform: rotateY(180deg);
    }

    .card-face {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      backface-visibility: hidden;
      font-size: 1.8rem;
    }

    .card-front {
      background: linear-gradient(135deg, #1e293b, #334155);
      border: 2px solid #334155;
      color: #64748b;
      font-size: 1.2rem;
    }

    .card-back {
      background: #020617;
      border: 2px solid #6366f1;
      transform: rotateY(180deg);
      font-size: 1.8rem;
    }

    .card.matched .card-back {
      border-color: #10b981;
      background: #064e3b;
      animation: matchPop 0.4s ease;
    }
    @keyframes matchPop {
      0%   { transform: rotateY(180deg) scale(1); }
      50%  { transform: rotateY(180deg) scale(1.1); }
      100% { transform: rotateY(180deg) scale(1); }
    }

    .card:hover:not(.flipped):not(.matched) .card-front {
      border-color: #6366f1;
      background: linear-gradient(135deg, #1e293b, #475569);
    }

    /* Shake on mismatch */
    .card.shake {
      animation: shake 0.4s ease;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25%      { transform: translateX(-6px); }
      75%      { transform: translateX(6px); }
    }

    /* ---------- Status ---------- */
    .status {
      font-size: 1rem;
      font-weight: 600;
      min-height: 26px;
      margin-bottom: 16px;
      color: #94a3b8;
      transition: color 0.2s;
    }
    .status.win { color: #10b981; font-size: 1.1rem; }

    /* ---------- New game ---------- */
    .new-btn {
      width: 100%;
      background: #6366f1;
      border: none;
      color: #fff;
      padding: 13px;
      border-radius: 10px;
      font-size: 0.92rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s, transform 0.08s;
      font-family: inherit;
    }
    .new-btn:hover  { background: #4f46e5; }
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
    <h1>🃏 Memory Card Game</h1>
    <p class="sub">Day 15 — Flip pairs, beat the clock</p>

    <div class="diffs" id="diffs">
      <button class="diff-btn" data-diff="easy">Easy · 4×2</button>
      <button class="diff-btn active" data-diff="medium">Medium · 4×3</button>
      <button class="diff-btn" data-diff="hard">Hard · 5×4</button>
    </div>

    <div class="stats">
      <div class="stat-box">
        <div class="stat-label">Moves</div>
        <div class="stat-value" id="moves">0</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Pairs</div>
        <div class="stat-value" id="pairs">0 / 6</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Time</div>
        <div class="stat-value" id="timer">0:00</div>
      </div>
    </div>

    <div class="board medium" id="board"></div>

    <div class="status" id="status">Find all matching pairs!</div>

    <button class="new-btn" id="newBtn">🔄 New Game</button>

    <footer>Day 15 of my JavaScript challenge 🚀</footer>
  </main>

  <script>
    // ============================================
    // DAY 15 — Memory Card Game
    // ============================================
    document.addEventListener("DOMContentLoaded", () => {
      const BEST_KEY = "js-memory-best-day15";

      const EMOJIS = ["🍎","🍌","🍇","🍓","🍊","🍋","🍉","🍒","🥝","🍑","🥥","🍍","🥕","🌽","🍄","🌶️"];

      const LEVELS = {
        easy:   { pairs: 6,  cols: 4, label: "4×2" }, // 12 cards = 6 pairs
        medium: { pairs: 9,  cols: 4, label: "4×3" }, // 18 cards = 9 pairs
        hard:   { pairs: 12, cols: 5, label: "5×4" }, // 24 cards = 12 pairs
      };

      const diffsEl    = document.getElementById("diffs");
      const boardEl    = document.getElementById("board");
      const movesEl    = document.getElementById("moves");
      const pairsEl    = document.getElementById("pairs");
      const timerEl    = document.getElementById("timer");
      const statusEl   = document.getElementById("status");
      const newBtn     = document.getElementById("newBtn");

      let level       = "medium";
      let cards       = [];         // array of emoji strings
      let flipped     = [];         // indices currently flipped
      let matched     = new Set();  // indices already matched
      let moves       = 0;
      let seconds     = 0;
      let timerId     = null;
      let gameOver    = false;
      let locked      = false;
      let started     = false;
      let bestScores  = loadBest();

      // ---------- Best scores ----------
      function loadBest() {
        try {
          const raw = localStorage.getItem(BEST_KEY);
          return raw ? JSON.parse(raw) : { easy: null, medium: null, hard: null };
        } catch { return { easy: null, medium: null, hard: null }; }
      }
      function saveBest() {
        try { localStorage.setItem(BEST_KEY, JSON.stringify(bestScores)); } catch {}
      }

      // ---------- Timer ----------
      function formatTime(s) {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${String(sec).padStart(2, "0")}`;
      }

      function startTimer() {
        if (timerId) return;
        timerId = setInterval(() => {
          seconds++;
          timerEl.textContent = formatTime(seconds);
        }, 1000);
      }

      function stopTimer() {
        if (timerId) { clearInterval(timerId); timerId = null; }
      }

      // ---------- Board ----------
      function buildDeck(cfg) {
        const pool = EMOJIS.slice(0, cfg.pairs);
        const deck = [...pool, ...pool];
        // shuffle
        for (let i = deck.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
      }

      function renderBoard() {
        boardEl.innerHTML = "";
        boardEl.className = "board " + level;
        cards.forEach((emoji, i) => {
          const card = document.createElement("div");
          card.className = "card";
          card.dataset.index = i;
          card.innerHTML = `
            <div class="card-inner">
              <div class="card-face card-front">❓</div>
              <div class="card-face card-back">${emoji}</div>
            </div>
          `;
          card.addEventListener("click", () => onCardClick(i));
          boardEl.appendChild(card);
        });
      }

      // ---------- Game flow ----------
      function startGame() {
        stopTimer();
        const cfg = LEVELS[level];

        cards = buildDeck(cfg);
        flipped = [];
        matched = new Set();
        moves = 0;
        seconds = 0;
        gameOver = false;
        locked = false;
        started = false;

        movesEl.textContent = "0";
        pairsEl.textContent = `0 / ${cfg.pairs}`;
        timerEl.textContent = "0:00";
        statusEl.textContent = "Find all matching pairs!";
        statusEl.className = "status";

        renderBoard();
        updateDifficultyUI();
      }

      function onCardClick(index) {
        if (gameOver || locked) return;
        if (matched.has(index) || flipped.includes(index)) return;

        if (!started) {
          started = true;
          startTimer();
        }

        // flip the card
        const cardEl = boardEl.children[index];
        cardEl.classList.add("flipped");
        flipped.push(index);

        if (flipped.length === 2) {
          moves++;
          movesEl.textContent = moves;
          checkMatch();
        }
      }

      function checkMatch() {
        const [a, b] = flipped;
        const cardA = boardEl.children[a];
        const cardB = boardEl.children[b];

        if (cards[a] === cards[b]) {
          // Match!
          matched.add(a);
          matched.add(b);
          cardA.classList.add("matched");
          cardB.classList.add("matched");
          flipped = [];

          const cfg = LEVELS[level];
          pairsEl.textContent = `${matched.size / 2} / ${cfg.pairs}`;

          if (matched.size === cards.length) {
            winGame();
          }
        } else {
          // Mismatch — wait then flip back
          locked = true;
          cardA.classList.add("shake");
          cardB.classList.add("shake");

          setTimeout(() => {
            cardA.classList.remove("flipped", "shake");
            cardB.classList.remove("flipped", "shake");
            flipped = [];
            locked = false;
          }, 800);
        }
      }

      function winGame() {
        gameOver = true;
        stopTimer();

        const prevBest = bestScores[level];
        const isNewBest =
          !prevBest || moves < prevBest.moves || (moves === prevBest.moves && seconds < prevBest.seconds);

        if (isNewBest) {
          bestScores[level] = { moves, seconds };
          saveBest();
        }

        statusEl.textContent =
          `🎉 You won in ${moves} moves and ${formatTime(seconds)}!` +
          (isNewBest ? " 🏆 NEW BEST!" : "");
        statusEl.className = "status win";
        updateDifficultyUI();
      }

      function updateDifficultyUI() {
        diffsEl.querySelectorAll(".diff-btn").forEach((b) => {
          const lv = b.dataset.diff;
          const active = lv === level;
          b.classList.toggle("active", active);

          const best = bestScores[lv];
          const base = `${LEVELS[lv].label}`;
          const suffix = best ? ` · best ${best.moves}m ${formatTime(best.seconds)}` : "";
          b.textContent = `${lv.charAt(0).toUpperCase() + lv.slice(1)} · ${base}${suffix}`;
        });
      }

      function setLevel(newLevel) {
        if (newLevel === level) return;
        level = newLevel;
        startGame();
      }

      // ---------- Events ----------
      diffsEl.querySelectorAll(".diff-btn").forEach((b) => {
        b.addEventListener("click", () => setLevel(b.dataset.diff));
      });

      newBtn.addEventListener("click", startGame);

      // ---------- Init ----------
      startGame();
    });
  </script>
</body>
</html>