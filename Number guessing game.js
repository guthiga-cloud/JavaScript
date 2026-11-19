<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Day 13 — Rock Paper Scissors</title>
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
      max-width: 480px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
      text-align: center;
    }

    h1 { font-size: 1.4rem; margin-bottom: 4px; }
    .sub { color: #94a3b8; font-size: 0.85rem; margin-bottom: 20px; }

    /* ---------- Best-of selector ---------- */
    .bestof {
      display: flex;
      gap: 6px;
      margin-bottom: 20px;
      justify-content: center;
    }
    .best-btn {
      background: #020617;
      border: 1px solid #1e293b;
      color: #94a3b8;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 0.78rem;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s;
    }
    .best-btn:hover { color: #e2e8f0; }
    .best-btn.active {
      background: #1e3a8a;
      border-color: #1e3a8a;
      color: #93c5fd;
    }

    /* ---------- Scoreboard ---------- */
    .scoreboard {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 10px;
      align-items: center;
      margin-bottom: 24px;
    }
    .score-side {
      background: #020617;
      border-radius: 12px;
      padding: 12px;
    }
    .score-side .label {
      font-size: 0.7rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    .score-side .val {
      font-size: 1.6rem;
      font-weight: 700;
      font-family: "Courier New", monospace;
    }
    .score-side.you .val  { color: #38bdf8; }
    .score-side.cpu .val  { color: #f472b6; }
    .score-side.target {
      font-size: 0.75rem;
      color: #64748b;
      min-width: 36px;
    }

    /* ---------- Hands ---------- */
    .arena {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    .hand {
      background: #020617;
      border-radius: 14px;
      padding: 24px 12px;
      font-size: 3.4rem;
      line-height: 1;
      transition: transform 0.15s;
      min-height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hand.shake {
      animation: shake 0.5s ease;
    }
    .hand.reveal {
      animation: pop 0.25s ease;
    }
    @keyframes shake {
      0%, 100% { transform: rotate(0deg) translateY(0); }
      25%      { transform: rotate(-10deg) translateY(-4px); }
      50%      { transform: rotate(10deg) translateY(-4px); }
      75%      { transform: rotate(-6deg) translateY(-2px); }
    }
    @keyframes pop {
      0%   { transform: scale(0.5); opacity: 0.5; }
      100% { transform: scale(1); opacity: 1; }
    }

    .hand-label {
      font-size: 0.72rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 6px;
    }

    /* ---------- Result text ---------- */
    .result {
      font-size: 1.1rem;
      font-weight: 600;
      min-height: 28px;
      margin-bottom: 20px;
      color: #94a3b8;
      transition: color 0.2s;
    }
    .result.win  { color: #10b981; }
    .result.lose { color: #ef4444; }
    .result.draw { color: #eab308; }

    /* ---------- Choice buttons ---------- */
    .choices {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 20px;
    }
    .choice {
      background: #1e293b;
      border: 2px solid #334155;
      color: #e2e8f0;
      padding: 18px 0;
      border-radius: 14px;
      font-size: 1.8rem;
      cursor: pointer;
      transition: all 0.15s;
      font-family: inherit;
      line-height: 1;
    }
    .choice:hover:not(:disabled)  { background: #334155; border-color: #6366f1; transform: translateY(-3px); }
    .choice:active:not(:disabled) { transform: scale(0.95); }
    .choice:disabled { opacity: 0.4; cursor: not-allowed; }
    .choice .name {
      display: block;
      font-size: 0.72rem;
      color: #94a3b8;
      margin-top: 6px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    /* ---------- Actions ---------- */
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
    .reset-btn { background: #1e293b; color: #e2e8f0; }
    .reset-btn:hover { background: #334155; }

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
    <h1>✊ Rock · Paper · Scissors ✂️</h1>
    <p class="sub">Day 13 — Best of N with score tracking</p>

    <div class="bestof" id="bestof">
      <button class="best-btn" data-best="3">Best of 3</button>
      <button class="best-btn active" data-best="5">Best of 5</button>
      <button class="best-btn" data-best="7">Best of 7</button>
    </div>

    <div class="scoreboard">
      <div class="score-side you">
        <div class="label">You</div>
        <div class="val" id="youScore">0</div>
      </div>
      <div class="score-side target" id="target">of 3</div>
      <div class="score-side cpu">
        <div class="label">CPU</div>
        <div class="val" id="cpuScore">0</div>
      </div>
    </div>

    <div class="arena">
      <div>
        <div class="hand" id="playerHand">✊</div>
        <div class="hand-label">You</div>
      </div>
      <div>
        <div class="hand" id="cpuHand">✊</div>
        <div class="hand-label">CPU</div>
      </div>
    </div>

    <div class="result" id="result">Pick your move 👇</div>

    <div class="choices">
      <button class="choice" data-pick="rock">
        ✊<span class="name">Rock</span>
      </button>
      <button class="choice" data-pick="paper">
        📄<span class="name">Paper</span>
      </button>
      <button class="choice" data-pick="scissors">
        ✂️<span class="name">Scissors</span>
      </button>
    </div>

    <div class="actions">
      <button class="new-btn"   id="newBtn">🔄 New Game</button>
      <button class="reset-btn" id="resetBtn">Reset All Scores</button>
    </div>

    <footer>Day 13 of my JavaScript challenge 🚀</footer>
  </main>

  <script>
    // ============================================
    // DAY 13 — Rock Paper Scissors
    // ============================================
    document.addEventListener("DOMContentLoaded", () => {
      const STATS_KEY = "js-rps-stats-day13";

      const EMOJI = { rock: "✊", paper: "📄", scissors: "✂️" };
      const BEATS = { rock: "scissors", paper: "rock", scissors: "paper" };
      const OPTIONS = ["rock", "paper", "scissors"];

      const playerHandEl = document.getElementById("playerHand");
      const cpuHandEl    = document.getElementById("cpuHand");
      const youScoreEl   = document.getElementById("youScore");
      const cpuScoreEl   = document.getElementById("cpuScore");
      const targetEl     = document.getElementById("target");
      const resultEl     = document.getElementById("result");
      const bestofEl     = document.getElementById("bestof");
      const choiceBtns   = document.querySelectorAll(".choice");
      const newBtn       = document.getElementById("newBtn");
      const resetBtn     = document.getElementById("resetBtn");

      let bestOf       = 5;                // 3, 5, or 7 → first to ceil(N/2) wins
      let youScore     = 0;
      let cpuScore     = 0;
      let gameOver     = false;
      let animating    = false;
      let lifetime     = loadStats();      // { wins, losses, draws } across matches

      // ---------- Persist stats ----------
      function loadStats() {
        try {
          const raw = localStorage.getItem(STATS_KEY);
          const s = raw ? JSON.parse(raw) : {};
          return {
            wins:   Number(s.wins)   || 0,
            losses: Number(s.losses) || 0,
            draws:  Number(s.draws)  || 0,
          };
        } catch { return { wins: 0, losses: 0, draws: 0 }; }
      }
      function saveStats() {
        try { localStorage.setItem(STATS_KEY, JSON.stringify(lifetime)); } catch {}
      }

      // ---------- Helpers ----------
      function winsNeeded() { return Math.ceil(bestOf / 2); }

      function updateScoreboard() {
        youScoreEl.textContent = youScore;
        cpuScoreEl.textContent = cpuScore;
        targetEl.textContent   = `of ${winsNeeded()}`;
      }

      function setResult(text, cls = "") {
        resultEl.textContent = text;
        resultEl.className = "result " + cls;
      }

      function setChoicesDisabled(disabled) {
        choiceBtns.forEach((b) => (b.disabled = disabled));
      }

      // ---------- Play one round ----------
      function playRound(playerPick) {
        if (gameOver || animating) return;
        animating = true;
        setChoicesDisabled(true);

        // 1. Shake animation on both hands
        playerHandEl.textContent = "✊";
        cpuHandEl.textContent    = "✊";
        playerHandEl.classList.remove("reveal");
        cpuHandEl.classList.remove("reveal");
        playerHandEl.classList.add("shake");
        cpuHandEl.classList.add("shake");

        setResult("Rock… Paper… Scissors…");

        setTimeout(() => {
          // 2. Reveal
          const cpuPick = OPTIONS[Math.floor(Math.random() * OPTIONS.length)];

          playerHandEl.classList.remove("shake");
          cpuHandEl.classList.remove("shake");
          playerHandEl.classList.add("reveal");
          cpuHandEl.classList.add("reveal");

          playerHandEl.textContent = EMOJI[playerPick];
          cpuHandEl.textContent    = EMOJI[cpuPick];

          // 3. Decide
          let outcome;
          if (playerPick === cpuPick) outcome = "draw";
          else if (BEATS[playerPick] === cpuPick) outcome = "win";
          else outcome = "lose";

          if (outcome === "win") {
            youScore++;
            lifetime.wins++;
            setResult(`You win this round! ${EMOJI[playerPick]} beats ${EMOJI[cpuPick]}`, "win");
          } else if (outcome === "lose") {
            cpuScore++;
            lifetime.losses++;
            setResult(`CPU wins this round. ${EMOJI[cpuPick]} beats ${EMOJI[playerPick]}`, "lose");
          } else {
            lifetime.draws++;
            setResult(`Draw — both chose ${EMOJI[playerPick]}`, "draw");
          }
          saveStats();
          updateScoreboard();

          // 4. Check match end
          if (youScore >= winsNeeded()) {
            gameOver = true;
            setResult(`🏆 You WIN the match! (${youScore} – ${cpuScore})`, "win");
            setChoicesDisabled(true);
          } else if (cpuScore >= winsNeeded()) {
            gameOver = true;
            setResult(`💻 CPU wins the match. (${cpuScore} – ${youScore})`, "lose");
            setChoicesDisabled(true);
          } else {
            setChoicesDisabled(false);
          }

          animating = false;
        }, 500);
      }

      // ---------- New game ----------
      function newGame() {
        youScore = 0;
        cpuScore = 0;
        gameOver = false;
        animating = false;
        playerHandEl.textContent = "✊";
        cpuHandEl.textContent    = "✊";
        playerHandEl.classList.remove("reveal", "shake");
        cpuHandEl.classList.remove("reveal", "shake");
        updateScoreboard();
        setResult("Pick your move 👇");
        setChoicesDisabled(false);
      }

      // ---------- Best-of selector ----------
      function setBestOf(n) {
        bestOf = n;
        bestofEl.querySelectorAll(".best-btn").forEach((b) => {
          b.classList.toggle("active", Number(b.dataset.best) === n);
        });
        newGame();
      }

      // ---------- Reset lifetime stats ----------
      function resetAll() {
        if (lifetime.wins === 0 && lifetime.losses === 0 && lifetime.draws === 0) {
          setResult("No stats to reset.", "draw");
          return;
        }
        if (!confirm("Reset ALL lifetime stats (wins/losses/draws) to 0?")) return;
        lifetime = { wins: 0, losses: 0, draws: 0 };
        saveStats();
        newGame();
        setResult("📊 Stats reset. Pick your move 👇");
      }

      // ---------- Events ----------
      choiceBtns.forEach((b) => {
        b.addEventListener("click", () => playRound(b.dataset.pick));
      });

      bestofEl.querySelectorAll(".best-btn").forEach((b) => {
        b.addEventListener("click", () => setBestOf(Number(b.dataset.best)));
      });

      newBtn.addEventListener("click", newGame);
      resetBtn.addEventListener("click", resetAll);

      // Keyboard: 1/2/3 or R/P/S
      document.addEventListener("keydown", (e) => {
        if (gameOver || animating) {
          if (e.key === "Enter") newGame();
          return;
        }
        const k = e.key.toLowerCase();
        if (k === "1" || k === "r") playRound("rock");
        else if (k === "2" || k === "p") playRound("paper");
        else if (k === "3" || k === "s") playRound("scissors");
      });

      // ---------- Init ----------
      updateScoreboard();
    });
  </script>
</body>
</html>