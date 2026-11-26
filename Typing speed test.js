<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Day 20 — Typing Speed Test</title>
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
      max-width: 620px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
    }

    h1 { font-size: 1.4rem; margin-bottom: 4px; text-align: center; }
    .sub { color: #94a3b8; font-size: 0.85rem; margin-bottom: 20px; text-align: center; }

    /* ---------- Stats bar ---------- */
    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-bottom: 20px;
    }
    .stat-box {
      background: #020617;
      border-radius: 10px;
      padding: 10px;
      text-align: center;
    }
    .stat-label {
      font-size: 0.66rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 3px;
    }
    .stat-value {
      font-family: "Courier New", monospace;
      font-size: 1.25rem;
      font-weight: 700;
      color: #38bdf8;
      transition: color 0.2s;
    }
    .stat-value.warn { color: #fbbf24; }
    .stat-value.good { color: #10b981; }

    /* ---------- Text display ---------- */
    .text-display {
      background: #020617;
      border: 2px solid #1e293b;
      border-radius: 14px;
      padding: 20px;
      margin-bottom: 14px;
      font-family: "Courier New", monospace;
      font-size: 1.05rem;
      line-height: 1.9;
      user-select: none;
      min-height: 120px;
      transition: border 0.2s;
      letter-spacing: 0.3px;
    }
    .text-display.focused { border-color: #6366f1; }
    .text-display.done    { border-color: #10b981; }

    .char {
      display: inline;
      transition: color 0.1s;
    }
    .char.correct  { color: #10b981; }
    .char.incorrect { color: #ef4444; background: #7f1d1d; border-radius: 3px; }
    .char.current {
      border-left: 2px solid #38bdf8;
      margin-left: -2px;
      animation: blink 1s infinite;
    }
    .char.pending  { color: #475569; }

    @keyframes blink {
      0%, 50% { border-color: #38bdf8; }
      51%, 100% { border-color: transparent; }
    }

    /* ---------- Input ---------- */
    .input-area {
      background: #020617;
      border: 2px solid #1e293b;
      border-radius: 14px;
      padding: 14px;
      font-size: 1rem;
      color: #e2e8f0;
      font-family: inherit;
      resize: none;
      width: 100%;
      outline: none;
      min-height: 56px;
      margin-bottom: 14px;
      transition: border 0.15s;
      display: none;
    }
    .input-area:focus { border-color: #6366f1; }
    .input-area.show { display: block; }
    .input-area:disabled { opacity: 0.5; }

    /* ---------- Buttons ---------- */
    .buttons {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }
    .btn {
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
    .btn:hover  { transform: translateY(-1px); }
    .btn:active { transform: scale(0.97); }
    .btn.primary { background: #6366f1; color: #fff; }
    .btn.primary:hover { background: #4f46e5; }
    .btn.ghost { background: #1e293b; color: #e2e8f0; }
    .btn.ghost:hover { background: #334155; }
    .btn.restart { background: #10b981; color: #fff; display: none; }
    .btn.restart:hover { background: #059669; }
    .btn.restart.show { display: block; }

    /* ---------- Best score ---------- */
    .best {
      text-align: center;
      font-size: 0.8rem;
      color: #64748b;
      padding: 10px;
      background: #020617;
      border-radius: 10px;
    }
    .best strong { color: #fbbf24; }
    .best.new { animation: pulse 0.6s ease 3; }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.03); background: #1e293b; }
    }

    /* ---------- Result modal ---------- */
    .result-modal {
      background: #020617;
      border: 2px solid #10b981;
      border-radius: 14px;
      padding: 20px;
      margin-bottom: 16px;
      text-align: center;
      display: none;
    }
    .result-modal.show { display: block; animation: slideIn 0.3s ease; }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .result-modal h2 {
      font-size: 1.2rem;
      color: #10b981;
      margin-bottom: 12px;
    }
    .result-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    .result-grid > div {
      background: #0b1220;
      padding: 10px;
      border-radius: 8px;
    }
    .result-grid .k {
      font-size: 0.68rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .result-grid .v {
      font-family: "Courier New", monospace;
      font-size: 1.2rem;
      font-weight: 700;
      color: #38bdf8;
      margin-top: 4px;
    }

    footer {
      text-align: center;
      color: #64748b;
      font-size: 0.78rem;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <main class="app">
    <h1>⌨️ Typing Speed Test</h1>
    <p class="sub">Day 20 — Measure your WPM & accuracy</p>

    <div class="stats">
      <div class="stat-box">
        <div class="stat-label">WPM</div>
        <div class="stat-value" id="wpmStat">0</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Accuracy</div>
        <div class="stat-value" id="accStat">100%</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Time</div>
        <div class="stat-value" id="timeStat">0s</div>
      </div>
    </div>

    <div class="text-display" id="textDisplay"></div>

    <textarea
      class="input-area"
      id="inputArea"
      placeholder="Start typing here…"
      spellcheck="false"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
    ></textarea>

    <div class="result-modal" id="resultModal">
      <h2>🎉 Test Complete!</h2>
      <div class="result-grid">
        <div>
          <div class="k">WPM</div>
          <div class="v" id="finalWpm">0</div>
        </div>
        <div>
          <div class="k">Accuracy</div>
          <div class="v" id="finalAcc">0%</div>
        </div>
        <div>
          <div class="k">Time</div>
          <div class="v" id="finalTime">0s</div>
        </div>
      </div>
    </div>

    <div class="buttons">
      <button class="btn primary" id="startBtn">▶ Start Test</button>
      <button class="btn restart" id="restartBtn">🔄 Try Again</button>
      <button class="btn ghost"   id="newTextBtn">📄 New Text</button>
    </div>

    <div class="best" id="bestBox">
      🏆 Best WPM: <strong id="bestWpm">0</strong> · Best Accuracy: <strong id="bestAcc">0%</strong>
    </div>

    <footer>Day 20 of my JavaScript challenge 🚀</footer>
  </main>

  <script>
    // ============================================
    // DAY 20 — Typing Speed Test
    // ============================================
    document.addEventListener("DOMContentLoaded", () => {
      const BEST_KEY = "js-typing-best-day20";

      // Text samples
      const TEXTS = [
        "The quick brown fox jumps over the lazy dog and keeps running through the meadow without a care in the world.",
        "Programming is the art of telling another human what one wants the computer to do. Clear code is better than clever code.",
        "Success is not final, failure is not fatal, it is the courage to continue that counts in everything you do.",
        "The best way to predict the future is to invent it. Start small, dream big, and never stop learning new things.",
        "A journey of a thousand miles begins with a single step. Every expert was once a beginner who refused to give up.",
        "Simplicity is the ultimate sophistication. Remove what does not matter and focus on what truly does in your life.",
        "Talk is cheap. Show me the code and let the results speak for themselves in a world full of empty promises.",
      ];

      const textDisplay   = document.getElementById("textDisplay");
      const inputArea     = document.getElementById("inputArea");
      const wpmStat       = document.getElementById("wpmStat");
      const accStat       = document.getElementById("accStat");
      const timeStat      = document.getElementById("timeStat");
      const startBtn      = document.getElementById("startBtn");
      const restartBtn    = document.getElementById("restartBtn");
      const newTextBtn    = document.getElementById("newTextBtn");
      const resultModal   = document.getElementById("resultModal");
      const finalWpm      = document.getElementById("finalWpm");
      const finalAcc      = document.getElementById("finalAcc");
      const finalTime     = document.getElementById("finalTime");
      const bestBox       = document.getElementById("bestBox");
      const bestWpmEl     = document.getElementById("bestWpm");
      const bestAccEl     = document.getElementById("bestAcc");

      let text         = "";
      let textChars    = [];   // span elements
      let started      = false;
      let finished     = false;
      let startTime    = 0;
      let timerId      = null;
      let correctChars = 0;
      let typedChars   = 0;
      let best         = loadBest();

      // ---------- Storage ----------
      function loadBest() {
        try {
          const raw = localStorage.getItem(BEST_KEY);
          const s = raw ? JSON.parse(raw) : {};
          return { wpm: Number(s.wpm) || 0, acc: Number(s.acc) || 0 };
        } catch { return { wpm: 0, acc: 0 }; }
      }
      function saveBest() {
        try { localStorage.setItem(BEST_KEY, JSON.stringify(best)); } catch {}
      }
      function renderBest() {
        bestWpmEl.textContent = best.wpm;
        bestAccEl.textContent = best.acc + "%";
      }

      // ---------- Helpers ----------
      function pickText() {
        return TEXTS[Math.floor(Math.random() * TEXTS.length)];
      }

      function renderText() {
        textDisplay.innerHTML = "";
        textChars = [];
        for (let i = 0; i < text.length; i++) {
          const span = document.createElement("span");
          span.className = "char pending";
          span.textContent = text[i];
          if (i === 0) span.classList.add("current");
          textDisplay.appendChild(span);
          textChars.push(span);
        }
      }

      function reset() {
        clearInterval(timerId);
        timerId = null;
        started = false;
        finished = false;
        startTime = 0;
        correctChars = 0;
        typedChars = 0;

        wpmStat.textContent = "0";
        wpmStat.className = "stat-value";
        accStat.textContent = "100%";
        accStat.className = "stat-value";
        timeStat.textContent = "0s";
        timeStat.className = "stat-value";

        inputArea.value = "";
        inputArea.disabled = false;
        inputArea.classList.remove("show");
        textDisplay.classList.remove("focused", "done");
        resultModal.classList.remove("show");
        startBtn.style.display = "";
        restartBtn.classList.remove("show");

        text = pickText();
        renderText();
      }

      // ---------- Live update ----------
      function updateLiveStats(elapsedSec) {
        const minutes = elapsedSec / 60;
        const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
        const accuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;

        wpmStat.textContent = wpm;
        wpmStat.className = "stat-value" + (wpm >= 60 ? " good" : wpm >= 30 ? " warn" : "");

        accStat.textContent = accuracy + "%";
        accStat.className = "stat-value" +
          (accuracy >= 95 ? " good" : accuracy >= 80 ? " warn" : "");

        timeStat.textContent = Math.floor(elapsedSec) + "s";
        return { wpm, accuracy };
      }

      // ---------- Process input ----------
      function handleInput() {
        if (finished) return;
        const typed = inputArea.value;

        // First character starts the timer
        if (!started && typed.length > 0) {
          started = true;
          startTime = performance.now();
          timerId = setInterval(() => {
            if (!finished) {
              updateLiveStats((performance.now() - startTime) / 1000);
            }
          }, 200);
          textDisplay.classList.add("focused");
        }

        // Compute stats from this keystroke
        correctChars = 0;
        typedChars = typed.length;

        let firstWrongIndex = -1;

        for (let i = 0; i < textChars.length; i++) {
          const span = textChars[i];
          span.classList.remove("correct", "incorrect", "current");

          if (i < typed.length) {
            const typedCh = typed[i];
            if (typedCh === text[i]) {
              span.classList.add("correct");
              correctChars++;
            } else {
              span.classList.add("incorrect");
              if (firstWrongIndex === -1) firstWrongIndex = i;
            }
          } else if (i === typed.length) {
            span.classList.add("current");
          } else {
            span.classList.add("pending");
          }
        }

        // Update live stats
        if (started) {
          updateLiveStats((performance.now() - startTime) / 1000);
        }

        // Completion? — typed length reached text length
        if (typed.length >= text.length) {
          finish();
        }
      }

      // ---------- Finish ----------
      function finish() {
        finished = true;
        clearInterval(timerId);
        timerId = null;

        const elapsedSec = Math.max(0.1, (performance.now() - startTime) / 1000);
        const minutes = elapsedSec / 60;
        const wpm = Math.round((correctChars / 5) / minutes);
        const accuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 0;

        inputArea.disabled = true;
        textDisplay.classList.remove("focused");
        textDisplay.classList.add("done");

        wpmStat.textContent = wpm;
        accStat.textContent = accuracy + "%";
        timeStat.textContent = Math.floor(elapsedSec) + "s";

        finalWpm.textContent  = wpm;
        finalAcc.textContent  = accuracy + "%";
        finalTime.textContent = Math.floor(elapsedSec) + "s";
        resultModal.classList.add("show");

        startBtn.style.display = "none";
        restartBtn.classList.add("show");

        // Update best
        let isNewBest = false;
        if (wpm > best.wpm) { best.wpm = wpm; isNewBest = true; }
        if (accuracy > best.acc) { best.acc = accuracy; isNewBest = true; }
        if (isNewBest) {
          saveBest();
          renderBest();
          bestBox.classList.remove("new");
          void bestBox.offsetWidth;
          bestBox.classList.add("new");
        }
      }

      // ---------- Start test ----------
      function startTest() {
        reset();
        inputArea.classList.add("show");
        inputArea.disabled = false;
        inputArea.focus();
        startBtn.style.display = "none";
      }

      // ---------- Events ----------
      startBtn.addEventListener("click", startTest);
      restartBtn.addEventListener("click", startTest);
      newTextBtn.addEventListener("click", () => {
        reset();
        startBtn.style.display = "";
        resultModal.classList.remove("show");
      });

      inputArea.addEventListener("input", handleInput);

      // Prevent paste (fair-play)
      inputArea.addEventListener("paste", (e) => e.preventDefault());

      // ---------- Init ----------
      renderBest();
      reset();
    });
  </script>
</body>