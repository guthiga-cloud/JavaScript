<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Day 6 — Stopwatch</title>
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
      padding: 36px 32px;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
      text-align: center;
    }

    h1 {
      font-size: 1.35rem;
      margin-bottom: 4px;
    }
    .sub {
      color: #94a3b8;
      font-size: 0.85rem;
      margin-bottom: 28px;
    }

    /* ---------- Time display ---------- */
    .time {
      font-family: "Courier New", monospace;
      font-size: 3rem;
      font-weight: 700;
      letter-spacing: 2px;
      color: #38bdf8;
      padding: 24px 12px;
      background: #020617;
      border-radius: 14px;
      margin-bottom: 24px;
      font-variant-numeric: tabular-nums;
      user-select: none;
    }
    .time .ms {
      font-size: 1.8rem;
      color: #64748b;
    }
    .time.running { color: #10b981; }

    /* ---------- Buttons ---------- */
    .buttons {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 24px;
    }

    button {
      border: none;
      padding: 14px 0;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s, transform 0.08s, opacity 0.2s;
      font-family: inherit;
    }
    button:active:not(:disabled) { transform: scale(0.96); }
    button:disabled { opacity: 0.35; cursor: not-allowed; }

    .start  { background: #10b981; color: #fff; }
    .start:hover:not(:disabled)  { background: #059669; }

    .stop   { background: #ef4444; color: #fff; }
    .stop:hover:not(:disabled)   { background: #dc2626; }

    .lap    { background: #6366f1; color: #fff; }
    .lap:hover:not(:disabled)    { background: #4f46e5; }

    .reset  { background: #1e293b; color: #e2e8f0; }
    .reset:hover:not(:disabled)  { background: #334155; }

    /* ---------- Lap list ---------- */
    .laps-wrap {
      background: #020617;
      border-radius: 12px;
      padding: 4px;
      max-height: 240px;
      overflow-y: auto;
      text-align: left;
    }
    .laps-wrap::-webkit-scrollbar { width: 6px; }
    .laps-wrap::-webkit-scrollbar-thumb {
      background: #334155; border-radius: 3px;
    }

    .laps-header {
      display: flex;
      justify-content: space-between;
      padding: 10px 14px;
      font-size: 0.78rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 1px solid #1e293b;
    }

    .lap {
      display: flex;
      justify-content: space-between;
      padding: 10px 14px;
      font-size: 0.92rem;
      font-family: "Courier New", monospace;
      border-bottom: 1px solid #0f172a;
      color: #cbd5e1;
    }
    .lap:last-child { border-bottom: none; }
    .lap .lap-num  { color: #6366f1; font-weight: 700; }
    .lap .lap-time { color: #38bdf8; }

    .empty {
      padding: 20px;
      text-align: center;
      color: #475569;
      font-size: 0.85rem;
    }

    footer {
      margin-top: 24px;
      color: #64748b;
      font-size: 0.8rem;
    }

    kbd {
      background: #1e293b;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.75rem;
      color: #94a3b8;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <main class="app">
    <h1>⏱️ Stopwatch</h1>
    <p class="sub">Day 6 — Millisecond precision + laps</p>

    <div class="time" id="time">
      00:00<span class="ms">.000</span>
    </div>

    <div class="buttons">
      <button class="start" id="startBtn" disabled>Start</button>
      <button class="stop"  id="stopBtn"  disabled>Stop</button>
      <button class="lap"   id="lapBtn"   disabled>Lap</button>
    </div>
    <div class="buttons" style="grid-template-columns: 1fr; margin-bottom: 20px;">
      <button class="reset" id="resetBtn">Reset</button>
    </div>

    <div class="laps-wrap">
      <div class="laps-header">
        <span>Lap</span>
        <span>Time</span>
      </div>
      <div id="lapList">
        <div class="empty">No laps yet</div>
      </div>
    </div>

    <footer>
      Keyboard: <kbd>S</kbd> start/stop · <kbd>L</kbd> lap · <kbd>R</kbd> reset
    </footer>
  </main>

  <script>
    // ============================================
    // DAY 6 — Stopwatch
    // Uses performance.now() for accurate timing
    // ============================================
    document.addEventListener("DOMContentLoaded", () => {
      const timeEl   = document.getElementById("time");
      const startBtn = document.getElementById("startBtn");
      const stopBtn  = document.getElementById("stopBtn");
      const lapBtn   = document.getElementById("lapBtn");
      const resetBtn = document.getElementById("resetBtn");
      const lapList  = document.getElementById("lapList");

      let startTime = 0;      // performance.now() at start
      let elapsed   = 0;      // ms accumulated before last pause
      let rafId     = null;   // requestAnimationFrame handle
      let running   = false;
      let laps      = [];

      // ---------- Format ----------
      function pad(n, len = 2) {
        return String(n).padStart(len, "0");
      }

      function formatMs(ms) {
        const totalSec = Math.floor(ms / 1000);
        const minutes  = Math.floor(totalSec / 60);
        const seconds  = totalSec % 60;
        const millis   = Math.floor(ms % 1000);
        return {
          main: `${pad(minutes)}:${pad(seconds)}`,
          ms:   `.${pad(millis, 3)}`,
        };
      }

      function currentMs() {
        return running ? elapsed + (performance.now() - startTime) : elapsed;
      }

      // ---------- Render ----------
      function renderTime() {
        const ms = currentMs();
        const { main, ms: msPart } = formatMs(ms);
        timeEl.innerHTML = `${main}<span class="ms">${msPart}</span>`;
        timeEl.classList.toggle("running", running);

        if (running) {
          rafId = requestAnimationFrame(renderTime);
        }
      }

      function renderLaps() {
        if (laps.length === 0) {
          lapList.innerHTML = `<div class="empty">No laps yet</div>`;
          return;
        }
        lapList.innerHTML = laps
          .map(
            (l, i) => `
            <div class="lap">
              <span class="lap-num">Lap ${i + 1}</span>
              <span class="lap-time">${l.text}</span>
            </div>
          `
          )
          .join("");
      }

      function updateButtons() {
        startBtn.disabled = running;
        stopBtn.disabled  = !running;
        lapBtn.disabled   = !running;
        resetBtn.disabled = running || (elapsed === 0 && laps.length === 0);
      }

      // ---------- Actions ----------
      function start() {
        if (running) return;
        running = true;
        startTime = performance.now();
        renderTime();
        updateButtons();
      }

      function stop() {
        if (!running) return;
        elapsed += performance.now() - startTime;
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        renderTime();
        updateButtons();
      }

      function lap() {
        if (!running) return;
        const ms = currentMs();
        const { main, ms: msPart } = formatMs(ms);
        laps.push({ time: ms, text: `${main}${msPart}` });
        renderLaps();
      }

      function reset() {
        if (running) {
          if (rafId) cancelAnimationFrame(rafId);
          rafId = null;
          running = false;
        }
        elapsed = 0;
        startTime = 0;
        laps = [];
        timeEl.innerHTML = `00:00<span class="ms">.000</span>`;
        timeEl.classList.remove("running");
        renderLaps();
        updateButtons();
      }

      // ---------- Events ----------
      startBtn.addEventListener("click", start);
      stopBtn.addEventListener("click", stop);
      lapBtn.addEventListener("click", lap);
      resetBtn.addEventListener("click", reset);

      document.addEventListener("keydown", (e) => {
        // ignore if typing in an input
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

        const k = e.key.toLowerCase();
        if (k === "s") {
          e.preventDefault();
          running ? stop() : start();
        } else if (k === "l") {
          e.preventDefault();
          lap();
        } else if (k === "r") {
          e.preventDefault();
          reset();
        }
      });

      // ---------- Init ----------
      updateButtons();
    });
  </script>
</body>
</html>