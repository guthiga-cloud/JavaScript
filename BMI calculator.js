<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Day 19 — BMI Calculator</title>
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
    }

    h1 { font-size: 1.4rem; margin-bottom: 4px; text-align: center; }
    .sub { color: #94a3b8; font-size: 0.85rem; margin-bottom: 24px; text-align: center; }

    /* ---------- Unit selector ---------- */
    .units {
      display: flex;
      gap: 0;
      background: #020617;
      border-radius: 10px;
      padding: 4px;
      margin-bottom: 20px;
    }
    .unit-btn {
      flex: 1;
      background: transparent;
      border: none;
      color: #94a3b8;
      padding: 9px;
      border-radius: 7px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s;
    }
    .unit-btn:hover { color: #e2e8f0; }
    .unit-btn.active {
      background: #6366f1;
      color: #fff;
    }

    /* ---------- Form ---------- */
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 16px;
    }
    .form-grid.single { grid-template-columns: 1fr; }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .input-group label {
      font-size: 0.72rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .input-group input {
      background: #020617;
      border: 2px solid #1e293b;
      border-radius: 10px;
      padding: 13px 14px;
      color: #38bdf8;
      font-size: 1.1rem;
      font-family: "Courier New", monospace;
      font-weight: 700;
      outline: none;
      transition: border 0.15s;
      width: 100%;
    }
    .input-group input:focus { border-color: #6366f1; }
    .input-group input.error  { border-color: #ef4444; }

    .gender-row {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }
    .gender-btn {
      flex: 1;
      background: #020617;
      border: 2px solid #1e293b;
      color: #94a3b8;
      padding: 10px;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s;
    }
    .gender-btn.active {
      background: #1e3a8a;
      border-color: #6366f1;
      color: #93c5fd;
    }

    .calc-btn {
      width: 100%;
      background: #6366f1;
      border: none;
      color: #fff;
      padding: 14px;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.15s, transform 0.08s;
      font-family: inherit;
      margin-bottom: 16px;
    }
    .calc-btn:hover  { background: #4f46e5; }
    .calc-btn:active { transform: scale(0.98); }

    /* ---------- Result card ---------- */
    .result-card {
      background: #020617;
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      margin-bottom: 16px;
      opacity: 0.4;
      transition: opacity 0.3s;
    }
    .result-card.show { opacity: 1; }

    .bmi-value {
      font-size: 3.4rem;
      font-weight: 800;
      font-family: "Courier New", monospace;
      line-height: 1;
      color: #38bdf8;
      transition: color 0.3s;
    }
    .bmi-label {
      font-size: 0.75rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 8px;
    }
    .bmi-category {
      font-size: 1.05rem;
      font-weight: 700;
      margin-top: 8px;
      transition: color 0.3s;
    }
    .bmi-hint {
      font-size: 0.8rem;
      color: #94a3b8;
      margin-top: 10px;
      line-height: 1.5;
    }

    /* ---------- Gauge ---------- */
    .gauge-wrap {
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid #1e293b;
    }
    .gauge-bar {
      position: relative;
      height: 12px;
      background: linear-gradient(90deg,
        #38bdf8 0%,
        #10b981 25%,
        #eab308 50%,
        #f97316 75%,
        #ef4444 100%);
      border-radius: 6px;
      margin-bottom: 6px;
    }
    .gauge-marker {
      position: absolute;
      top: -5px;
      width: 4px;
      height: 22px;
      background: #fff;
      border-radius: 2px;
      box-shadow: 0 0 8px rgba(255, 255, 255, 0.7);
      transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      transform: translateX(-50%);
    }
    .gauge-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.65rem;
      color: #64748b;
    }

    /* ---------- History ---------- */
    .history-title {
      font-size: 0.72rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .history-title button {
      background: none;
      border: none;
      color: #ef4444;
      font-size: 0.72rem;
      cursor: pointer;
      text-decoration: underline;
      font-family: inherit;
    }

    .history {
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-height: 160px;
      overflow-y: auto;
    }
    .history::-webkit-scrollbar { width: 4px; }
    .history::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }

    .history-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #020617;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 0.8rem;
    }
    .history-item .val {
      font-family: "Courier New", monospace;
      font-weight: 700;
    }
    .history-item .date {
      color: #64748b;
      font-size: 0.7rem;
    }
    .history-empty {
      color: #475569;
      font-size: 0.8rem;
      text-align: center;
      padding: 12px;
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
    <h1>⚖️ BMI Calculator</h1>
    <p class="sub">Day 19 — Track your body mass index</p>

    <!-- Units -->
    <div class="units" id="units">
      <button class="unit-btn active" data-unit="metric">📏 Metric (kg / cm)</button>
      <button class="unit-btn" data-unit="imperial">📐 Imperial (lb / in)</button>
    </div>

    <!-- Gender -->
    <div class="gender-row" id="genderRow">
      <button class="gender-btn active" data-gender="male">👨 Male</button>
      <button class="gender-btn" data-gender="female">👩 Female</button>
    </div>

    <!-- Form -->
    <div class="form-grid" id="formGrid">
      <div class="input-group">
        <label id="weightLabel">Weight (kg)</label>
        <input type="number" id="weightInput" min="0" step="0.1" placeholder="e.g. 70" />
      </div>
      <div class="input-group">
        <label id="heightLabel">Height (cm)</label>
        <input type="number" id="heightInput" min="0" step="0.1" placeholder="e.g. 175" />
      </div>
    </div>

    <button class="calc-btn" id="calcBtn">Calculate BMI</button>

    <!-- Result -->
    <div class="result-card" id="resultCard">
      <div class="bmi-label">Your BMI</div>
      <div class="bmi-value" id="bmiValue">—</div>
      <div class="bmi-category" id="bmiCategory">—</div>
      <div class="bmi-hint" id="bmiHint"></div>

      <div class="gauge-wrap">
        <div class="gauge-bar">
          <div class="gauge-marker" id="gaugeMarker" style="left:0%"></div>
        </div>
        <div class="gauge-labels">
          <span>Under</span>
          <span>Normal</span>
          <span>Over</span>
          <span>Obese</span>
        </div>
      </div>
    </div>

    <!-- History -->
    <div class="history-title">
      <span>📊 History</span>
      <button id="clearHistory">Clear</button>
    </div>
    <div class="history" id="history">
      <div class="history-empty">No entries yet</div>
    </div>

    <footer>Day 19 of my JavaScript challenge 🚀</footer>
  </main>

  <script>
    // ============================================
    // DAY 19 — BMI Calculator
    // ============================================
    document.addEventListener("DOMContentLoaded", () => {
      const HISTORY_KEY = "js-bmi-history-day19";

      const unitsEl      = document.getElementById("units");
      const genderRow    = document.getElementById("genderRow");
      const formGrid     = document.getElementById("formGrid");
      const weightLabel  = document.getElementById("weightLabel");
      const heightLabel  = document.getElementById("heightLabel");
      const weightInput  = document.getElementById("weightInput");
      const heightInput  = document.getElementById("heightInput");
      const calcBtn      = document.getElementById("calcBtn");
      const resultCard   = document.getElementById("resultCard");
      const bmiValueEl   = document.getElementById("bmiValue");
      const bmiCatEl     = document.getElementById("bmiCategory");
      const bmiHintEl    = document.getElementById("bmiHint");
      const gaugeMarker  = document.getElementById("gaugeMarker");
      const historyEl    = document.getElementById("history");
      const clearHistBtn = document.getElementById("clearHistory");

      let unit   = "metric";
      let gender = "male";
      let history = loadHistory();

      // ---------- Storage ----------
      function loadHistory() {
        try {
          const raw = localStorage.getItem(HISTORY_KEY);
          const data = raw ? JSON.parse(raw) : [];
          return Array.isArray(data) ? data : [];
        } catch { return []; }
      }
      function saveHistory() {
        try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch {}
      }

      // ---------- Units ----------
      function setUnit(u) {
        unit = u;
        unitsEl.querySelectorAll(".unit-btn").forEach((b) =>
          b.classList.toggle("active", b.dataset.unit === u)
        );
        if (u === "metric") {
          weightLabel.textContent = "Weight (kg)";
          heightLabel.textContent = "Height (cm)";
          weightInput.placeholder = "e.g. 70";
          heightInput.placeholder = "e.g. 175";
        } else {
          weightLabel.textContent = "Weight (lb)";
          heightLabel.textContent = "Height (in)";
          weightInput.placeholder = "e.g. 154";
          heightInput.placeholder = "e.g. 69";
        }
        resetResult();
      }

      function setGender(g) {
        gender = g;
        genderRow.querySelectorAll(".gender-btn").forEach((b) =>
          b.classList.toggle("active", b.dataset.gender === g)
        );
      }

      // ---------- BMI categories ----------
      function getCategory(bmi) {
        if (bmi < 18.5) {
          return {
            label: "Underweight",
            color: "#38bdf8",
            hint: "Consider eating more nutritious meals. Consult a doctor if concerned.",
            pct: 10,
          };
        }
        if (bmi < 25) {
          return {
            label: "Normal weight",
            color: "#10b981",
            hint: "You're in the healthy range. Keep up the good habits!",
            pct: 38,
          };
        }
        if (bmi < 30) {
          return {
            label: "Overweight",
            color: "#eab308",
            hint: "Light exercise and balanced meals can help you get back on track.",
            pct: 62,
          };
        }
        if (bmi < 35) {
          return {
            label: "Obese (Class I)",
            color: "#f97316",
            hint: "Talk to a healthcare provider about a personalized plan.",
            pct: 80,
          };
        }
        return {
          label: "Obese (Class II+)",
          color: "#ef4444",
          hint: "Seek medical advice for guidance on safe, sustainable weight loss.",
          pct: 95,
        };
      }

      // ---------- Reset ----------
      function resetResult() {
        resultCard.classList.remove("show");
        bmiValueEl.textContent = "—";
        bmiCatEl.textContent = "—";
        bmiCatEl.style.color = "";
        bmiHintEl.textContent = "";
        gaugeMarker.style.left = "0%";
        weightInput.classList.remove("error");
        heightInput.classList.remove("error");
      }

      // ---------- Validate ----------
      function validate(weight, height) {
        let ok = true;
        weightInput.classList.remove("error");
        heightInput.classList.remove("error");

        if (!weight || weight <= 0 || weight > 1000) {
          weightInput.classList.add("error");
          ok = false;
        }
        // metric height in cm → 50–250, imperial in in → 20–100
        const maxH = unit === "metric" ? 250 : 100;
        const minH = unit === "metric" ? 50  : 20;
        if (!height || height < minH || height > maxH) {
          heightInput.classList.add("error");
          ok = false;
        }
        return ok;
      }

      // ---------- Calculate ----------
      function calculate() {
        const w = parseFloat(weightInput.value);
        const h = parseFloat(heightInput.value);

        if (!validate(w, h)) {
          showError("⚠️ Enter valid weight and height.");
          return;
        }

        let bmi;
        if (unit === "metric") {
          const m = h / 100;
          bmi = w / (m * m);
        } else {
          // imperial: 703 * lb / in²
          bmi = (703 * w) / (h * h);
        }

        if (!isFinite(bmi) || bmi <= 0) {
          showError("⚠️ Invalid values.");
          return;
        }

        bmi = Math.round(bmi * 10) / 10;
        const cat = getCategory(bmi);

        // Update result card
        resultCard.classList.add("show");
        bmiValueEl.textContent = bmi.toFixed(1);
        bmiValueEl.style.color = cat.color;
        bmiCatEl.textContent = cat.label;
        bmiCatEl.style.color = cat.color;
        bmiHintEl.textContent = cat.hint;
        gaugeMarker.style.left = cat.pct + "%";

        // Add to history
        history.unshift({
          bmi: bmi,
          weight: w,
          height: h,
          unit: unit,
          gender: gender,
          category: cat.label,
          timestamp: Date.now(),
        });
        history = history.slice(0, 20);
        saveHistory();
        renderHistory();
      }

      function showError(msg) {
        resultCard.classList.add("show");
        bmiValueEl.textContent = "—";
        bmiCatEl.textContent = "";
        bmiHintEl.textContent = msg;
        bmiHintEl.style.color = "#f87171";
        setTimeout(() => { bmiHintEl.style.color = ""; }, 3000);
      }

      // ---------- History render ----------
      function renderHistory() {
        if (history.length === 0) {
          historyEl.innerHTML = `<div class="history-empty">No entries yet</div>`;
          return;
        }
        historyEl.innerHTML = "";
        for (const entry of history) {
          const cat = getCategory(entry.bmi);
          const d = new Date(entry.timestamp);
          const dateStr = d.toLocaleDateString([], { month: "short", day: "numeric" })
            + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

          const item = document.createElement("div");
          item.className = "history-item";
          item.innerHTML = `
            <div>
              <span class="val" style="color:${cat.color}">${entry.bmi.toFixed(1)}</span>
              <span style="color:#64748b;font-size:0.72rem;margin-left:6px">${cat.label}</span>
            </div>
            <div class="date">${dateStr}</div>
          `;
          historyEl.appendChild(item);
        }
      }

      function clearHistory() {
        if (history.length === 0) return;
        if (!confirm("Clear all history entries?")) return;
        history = [];
        saveHistory();
        renderHistory();
      }

      // ---------- Events ----------
      unitsEl.querySelectorAll(".unit-btn").forEach((b) => {
        b.addEventListener("click", () => setUnit(b.dataset.unit));
      });

      genderRow.querySelectorAll(".gender-btn").forEach((b) => {
        b.addEventListener("click", () => setGender(b.dataset.gender));
      });

      calcBtn.addEventListener("click", calculate);

      // Enter key on inputs → calculate
      [weightInput, heightInput].forEach((el) => {
        el.addEventListener("keydown", (e) => {
          if (e.key === "Enter") { e.preventDefault(); calculate(); }
        });
      });

      clearHistBtn.addEventListener("click", clearHistory);

      // ---------- Init ----------
      renderHistory();
    });
  </script>
</body>
</html>