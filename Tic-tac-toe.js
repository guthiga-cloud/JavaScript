<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Day 11 — Tic-Tac-Toe</title>
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
      max-width: 420px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
      text-align: center;
    }

    h1 { font-size: 1.5rem; margin-bottom: 4px; }
    .sub { color: #94a3b8; font-size: 0.85rem; margin-bottom: 20px; }

    /* ---------- Mode selector ---------- */
    .modes {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
    }
    .mode-btn {
      flex: 1;
      background: #020617;
      border: 1px solid #1e293b;
      color: #94a3b8;
      padding: 10px;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      font-family: inherit;
    }
    .mode-btn:hover { color: #e2e8f0; }
    .mode-btn.active {
      background: #1e3a8a;
      border-color: #1e3a8a;
      color: #93c5fd;
    }

    /* ---------- Scoreboard ---------- */
    .scoreboard {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
      margin-bottom: 20px;
    }
    .score {
      background: #020617;
      border-radius: 10px;
      padding: 10px;
    }
    .score-label {
      font-size: 0.7rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    .score-value {
      font-size: 1.4rem;
      font-weight: 700;
      font-family: "Courier New", monospace;
    }
    .score.x .score-value { color: #38bdf8; }
    .score.o .score-value { color: #f472b6; }
    .score.d .score-value { color: #94a3b8; }

    /* ---------- Status ---------- */
    .status {
      font-size: 0.95rem;
      font-weight: 600;
      color: #94a3b8;
      margin-bottom: 16px;
      min-height: 22px;
      transition: color 0.2s;
    }
    .status.x-turn  { color: #38bdf8; }
    .status.o-turn  { color: #f472b6; }
    .status.winner  { color: #10b981; font-size: 1.1rem; }
    .status.draw    { color: #eab308; }

    /* ---------- Board ---------- */
    .board {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 20px;
      aspect-ratio: 1 / 1;
    }

    .cell {
      background: #020617;
      border: 2px solid #1e293b;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s, transform 0.1s;
      user-select: none;
      color: #e2e8f0;
      font-family: inherit;
    }
    .cell:hover:not(.filled):not(.disabled) {
      background: #0f172a;
      border-color: #6366f1;
    }
    .cell:active:not(.filled):not(.disabled) {
      transform: scale(0.96);
    }
    .cell.filled { cursor: default; }
    .cell.disabled { cursor: not-allowed; }

    .cell.x {
      color: #38bdf8;
      text-shadow: 0 0 20px rgba(56, 189, 248, 0.4);
      animation: pop 0.2s ease;
    }
    .cell.o {
      color: #f472b6;
      text-shadow: 0 0 20px rgba(244, 114, 182, 0.4);
      animation: pop 0.2s ease;
    }
    @keyframes pop {
      0%   { transform: scale(0.4); opacity: 0; }
      100% { transform: scale(1);   opacity: 1; }
    }

    .cell.win {
      background: #064e3b;
      border-color: #10b981;
      animation: winPulse 0.8s ease infinite alternate;
    }
    @keyframes winPulse {
      from { box-shadow: 0 0 0 rgba(16, 185, 129, 0.3); }
      to   { box-shadow: 0 0 30px rgba(16, 185, 129, 0.6); }
    }

    /* ---------- Buttons ---------- */
    .actions {
      display: flex;
      gap: 8px;
    }
    .actions button {
      flex: 1;
      border: none;
      padding: 13px;
      border-radius: 10px;
      font-size: 0.92rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s, transform 0.08s;
      font-family: inherit;
    }
    .new-btn {
      background: #6366f1;
      color: #fff;
    }
    .new-btn:hover  { background: #4f46e5; }
    .new-btn:active { transform: scale(0.97); }

    .reset-btn {
      background: #1e293b;
      color: #e2e8f0;
    }
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
    <h1>⭕ Tic-Tac-Toe ❌</h1>
    <p class="sub">Day 11 — Play a friend or the unbeatable AI</p>

    <div class="modes">
      <button class="mode-btn active" data-mode="pvp">👥 2 Players</button>
      <button class="mode-btn" data-mode="ai">🤖 vs AI</button>
    </div>

    <div class="scoreboard">
      <div class="score x">
        <div class="score-label">X</div>
        <div class="score-value" id="scoreX">0</div>
      </div>
      <div class="score d">
        <div class="score-label">Draws</div>
        <div class="score-value" id="scoreD">0</div>
      </div>
      <div class="score o">
        <div class="score-label" id="oLabel">O</div>
        <div class="score-value" id="scoreO">0</div>
      </div>
    </div>

    <div class="status x-turn" id="status">X's turn</div>

    <div class="board" id="board">
      <div class="cell" data-i="0"></div>
      <div class="cell" data-i="1"></div>
      <div class="cell" data-i="2"></div>
      <div class="cell" data-i="3"></div>
      <div class="cell" data-i="4"></div>
      <div class="cell" data-i="5"></div>
      <div class="cell" data-i="6"></div>
      <div class="cell" data-i="7"></div>
      <div class="cell" data-i="8"></div>
    </div>

    <div class="actions">
      <button class="new-btn"   id="newBtn">🔄 New Round</button>
      <button class="reset-btn" id="resetBtn">Reset Scores</button>
    </div>

    <footer>Day 11 of my JavaScript challenge 🚀</footer>
  </main>

  <script>
    // ============================================
    // DAY 11 — Tic-Tac-Toe with Minimax AI
    // ============================================
    document.addEventListener("DOMContentLoaded", () => {
      const SCORE_KEY = "js-ttt-scores-day11";
      const WIN_LINES = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6],
      ];

      const boardEl    = document.getElementById("board");
      const cells      = [...boardEl.querySelectorAll(".cell")];
      const statusEl   = document.getElementById("status");
      const scoreXEl   = document.getElementById("scoreX");
      const scoreOEl   = document.getElementById("scoreO");
      const scoreDEl   = document.getElementById("scoreD");
      const oLabelEl   = document.getElementById("oLabel");
      const newBtn     = document.getElementById("newBtn");
      const resetBtn   = document.getElementById("resetBtn");
      const modeBtns   = document.querySelectorAll(".mode-btn");

      const HUMAN = "X";
      const AI    = "O";

      let board     = Array(9).fill("");
      let current   = HUMAN;
      let gameOver  = false;
      let mode      = "pvp";  // "pvp" | "ai"
      let scores    = loadScores();
      let aiThinking = false;

      // ---------- Storage ----------
      function loadScores() {
        try {
          const raw = localStorage.getItem(SCORE_KEY);
          if (!raw) return { X: 0, O: 0, D: 0 };
          const s = JSON.parse(raw);
          return {
            X: Number(s.X) || 0,
            O: Number(s.O) || 0,
            D: Number(s.D) || 0,
          };
        } catch { return { X: 0, O: 0, D: 0 }; }
      }
      function saveScores() {
        try { localStorage.setItem(SCORE_KEY, JSON.stringify(scores)); } catch {}
      }

      // ---------- Status ----------
      function setStatus(text, cls = "") {
        statusEl.textContent = text;
        statusEl.className = "status " + cls;
      }

      function updateScoresUI() {
        scoreXEl.textContent = scores.X;
        scoreOEl.textContent = scores.O;
        scoreDEl.textContent = scores.D;
        oLabelEl.textContent = mode === "ai" ? "AI" : "O";
      }

      // ---------- Render ----------
      function renderBoard(highlight = []) {
        cells.forEach((cell, i) => {
          const v = board[i];
          cell.textContent = v;
          cell.classList.toggle("filled", v !== "");
          cell.classList.toggle("x", v === "X");
          cell.classList.toggle("o", v === "O");
          cell.classList.toggle("win", highlight.includes(i));
          cell.classList.toggle(
            "disabled",
            gameOver || (mode === "ai" && (current === AI || aiThinking))
          );
        });
      }

      // ---------- Win logic ----------
      function getWinner(b) {
        for (const [a, c, d] of WIN_LINES) {
          if (b[a] && b[a] === b[c] && b[a] === b[d]) {
            return { player: b[a], line: [a, c, d] };
          }
        }
        return null;
      }

      function isFull(b) {
        return b.every((v) => v !== "");
      }

      // ---------- Minimax AI ----------
      function minimax(b, depth, isMaximizing) {
        const w = getWinner(b);
        if (w) return w.player === AI ? 10 - depth : depth - 10;
        if (isFull(b)) return 0;

        const empty = b.map((v, i) => v === "" ? i : -1).filter(i => i !== -1);

        if (isMaximizing) {
          let best = -Infinity;
          for (const i of empty) {
            b[i] = AI;
            best = Math.max(best, minimax(b, depth + 1, false));
            b[i] = "";
          }
          return best;
        } else {
          let best = Infinity;
          for (const i of empty) {
            b[i] = HUMAN;
            best = Math.min(best, minimax(b, depth + 1, true));
            b[i] = "";
          }
          return best;
        }
      }

      function bestAIMove(b) {
        let bestScore = -Infinity;
        let move = -1;
        const empty = b.map((v, i) => v === "" ? i : -1).filter(i => i !== -1);
        for (const i of empty) {
          b[i] = AI;
          const score = minimax(b, 0, false);
          b[i] = "";
          if (score > bestScore) {
            bestScore = score;
            move = i;
          }
        }
        return move;
      }

      // ---------- Core flow ----------
      function handleClick(i) {
        if (gameOver || board[i] !== "") return;
        if (mode === "ai" && (current !== HUMAN || aiThinking)) return;

        place(i);

        if (!gameOver && mode === "ai" && current === AI) {
          scheduleAIMove();
        }
      }

      function place(i) {
        board[i] = current;
        renderBoard();

        const w = getWinner(board);
        if (w) {
          endGame(w.player, w.line);
          return;
        }
        if (isFull(board)) {
          endGame("draw");
          return;
        }

        current = current === "X" ? "O" : "X";
        updateTurnUI();
        renderBoard();
      }

      function updateTurnUI() {
        if (gameOver) return;
        if (mode === "ai" && current === AI) {
          setStatus("🤖 AI is thinking…", "o-turn");
        } else {
          setStatus(
            `${current}'s turn${mode === "ai" && current === HUMAN ? " (you)" : ""}`,
            current === "X" ? "x-turn" : "o-turn"
          );
        }
      }

      function scheduleAIMove() {
        aiThinking = true;
        renderBoard();
        setTimeout(() => {
          if (gameOver) { aiThinking = false; return; }
          const move = bestAIMove(board);
          aiThinking = false;
          if (move !== -1 && board[move] === "") {
            place(move);
            if (!gameOver && mode === "ai" && current === AI) {
              // extremely rare, but in case board advanced
              scheduleAIMove();
            }
          }
        }, 300);
      }

      function endGame(result, line = []) {
        gameOver = true;

        if (result === "draw") {
          scores.D++;
          saveScores();
          updateScoresUI();
          setStatus("🤝 It's a draw!", "draw");
          renderBoard();
        } else {
          scores[result]++;
          saveScores();
          updateScoresUI();
          const label = mode === "ai" && result === AI ? "🤖 AI" : result;
          setStatus(
            result === AI && mode === "ai"
              ? "🤖 AI wins!"
              : `🏆 ${label} wins!`,
            "winner"
          );
          renderBoard(line);
        }

        // visually disable board
        cells.forEach((c) => c.classList.add("disabled"));
      }

      function newRound() {
        board = Array(9).fill("");
        current = HUMAN;
        gameOver = false;
        aiThinking = false;
        renderBoard();
        updateTurnUI();

        // AI starts in ai mode if desired: keep X as human, so human starts
        // (change below if you want AI to start)
        if (mode === "ai" && current === AI) {
          scheduleAIMove();
        }
      }

      function resetScores() {
        if (scores.X === 0 && scores.O === 0 && scores.D === 0) return;
        if (!confirm("Reset all scores to 0?")) return;
        scores = { X: 0, O: 0, D: 0 };
        saveScores();
        updateScoresUI();
      }

      function setMode(m) {
        if (m === mode) return;
        mode = m;
        modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === m));
        updateScoresUI();
        newRound();
      }

      // ---------- Events ----------
      cells.forEach((c, i) => {
        c.addEventListener("click", () => handleClick(i));
      });

      modeBtns.forEach((b) => {
        b.addEventListener("click", () => setMode(b.dataset.mode));
      });

      newBtn.addEventListener("click", newRound);
      resetBtn.addEventListener("click", resetScores);

      // ---------- Init ----------
      updateScoresUI();
      newRound();
    });
  </script>
</body>
</html>