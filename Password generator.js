<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Day 9 — Password Generator</title>
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
    }

    h1 { font-size: 1.4rem; margin-bottom: 4px; }
    .sub { color: #94a3b8; font-size: 0.85rem; margin-bottom: 24px; }

    /* ---------- Output ---------- */
    .output-wrap {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }
    .output {
      flex: 1;
      background: #020617;
      border: 2px solid #1e293b;
      border-radius: 12px;
      padding: 16px 18px;
      font-family: "Courier New", monospace;
      font-size: 1.2rem;
      color: #38bdf8;
      word-break: break-all;
      min-height: 58px;
      display: flex;
      align-items: center;
      transition: border 0.15s;
      user-select: all;
    }
    .output:empty::before {
      content: "Click Generate ↓";
      color: #475569;
      font-style: italic;
      font-family: inherit;
      font-size: 0.9rem;
    }

    .icon-btn {
      background: #1e293b;
      border: none;
      border-radius: 12px;
      width: 56px;
      color: #e2e8f0;
      font-size: 1.3rem;
      cursor: pointer;
      transition: background 0.15s, transform 0.08s;
    }
    .icon-btn:hover  { background: #334155; }
    .icon-btn:active { transform: scale(0.94); }

    /* ---------- Strength meter ---------- */
    .strength-wrap {
      margin-bottom: 24px;
    }
    .strength-bar-track {
      height: 6px;
      background: #020617;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 8px;
    }
    .strength-bar {
      height: 100%;
      width: 0;
      border-radius: 3px;
      transition: width 0.3s ease, background 0.3s ease;
    }
    .strength-info {
      display: flex;
      justify-content: space-between;
      font-size: 0.78rem;
      color: #64748b;
    }
    .strength-label { font-weight: 600; }

    /* ---------- Options ---------- */
    .options { margin-bottom: 20px; }

    .option-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
    }
    .option-row label { font-size: 0.9rem; color: #cbd5e1; }

    /* Length slider */
    .length-value {
      font-family: "Courier New", monospace;
      font-weight: 700;
      color: #38bdf8;
      font-size: 1.1rem;
      min-width: 32px;
      text-align: right;
    }
    input[type="range"] {
      width: 100%;
      height: 6px;
      -webkit-appearance: none;
      background: #020617;
      border-radius: 3px;
      outline: none;
      margin: 8px 0 14px;
    }
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #6366f1;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
    }
    input[type="range"]::-moz-range-thumb {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #6366f1;
      cursor: pointer;
      border: none;
    }

    /* Toggles */
    .toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #1e293b;
    }
    .toggle-row:last-child { border-bottom: none; }

    .switch {
      position: relative;
      width: 46px;
      height: 26px;
      background: #1e293b;
      border-radius: 26px;
      cursor: pointer;
      transition: background 0.2s;
      flex-shrink: 0;
    }
    .switch::after {
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #fff;
      transition: transform 0.25s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    }
    .switch.on { background: #6366f1; }
    .switch.on::after { transform: translateX(20px); }

    /* ---------- Generate button ---------- */
    .gen-btn {
      width: 100%;
      background: #6366f1;
      border: none;
      color: #fff;
      padding: 16px;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.15s, transform 0.08s;
      font-family: inherit;
    }
    .gen-btn:hover  { background: #4f46e5; }
    .gen-btn:active { transform: scale(0.98); }

    /* ---------- Copy feedback ---------- */
    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: #10b981;
      color: #fff;
      padding: 12px 24px;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
      transition: transform 0.3s ease, opacity 0.3s ease;
      opacity: 0;
    }
    .toast.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }

    footer {
      text-align: center;
      color: #64748b;
      font-size: 0.78rem;
      margin-top: 24px;
    }
  </style>
</head>
<body>
  <main class="app">
    <h1>🔐 Password Generator</h1>
    <p class="sub">Day 9 — Cryptographically secure (Web Crypto API)</p>

    <div class="output-wrap">
      <div class="output" id="output"></div>
      <button class="icon-btn" id="copyBtn" title="Copy">📋</button>
    </div>

    <div class="strength-wrap">
      <div class="strength-bar-track">
        <div class="strength-bar" id="strengthBar"></div>
      </div>
      <div class="strength-info">
        <span class="strength-label" id="strengthLabel">—</span>
        <span id="entropyText">0 bits</span>
      </div>
    </div>

    <div class="options">
      <div class="option-row">
        <label>Length</label>
        <span class="length-value" id="lengthValue">16</span>
      </div>
      <input type="range" id="lengthSlider" min="4" max="64" value="16" />

      <div class="toggle-row">
        <label for="upper">Uppercase (A-Z)</label>
        <div class="switch on" id="upper" data-opt="upper"></div>
      </div>
      <div class="toggle-row">
        <label for="lower">Lowercase (a-z)</label>
        <div class="switch on" id="lower" data-opt="lower"></div>
      </div>
      <div class="toggle-row">
        <label for="digits">Digits (0-9)</label>
        <div class="switch on" id="digits" data-opt="digits"></div>
      </div>
      <div class="toggle-row">
        <label for="symbols">Symbols (!@#$…)</label>
        <div class="switch on" id="symbols" data-opt="symbols"></div>
      </div>
    </div>

    <button class="gen-btn" id="genBtn">🎲 Generate Password</button>

    <footer>Day 9 of my JavaScript challenge 🚀</footer>
  </main>

  <div class="toast" id="toast">✅ Copied to clipboard</div>

  <script>
    // ============================================
    // DAY 9 — Password Generator
    // Uses crypto.getRandomValues() — cryptographically secure
    // ============================================
    document.addEventListener("DOMContentLoaded", () => {
      const SETS = {
        upper:   "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        lower:   "abcdefghijklmnopqrstuvwxyz",
        digits:  "0123456789",
        symbols: "!@#$%^&*()-_=+[]{};:,.<>?/",
      };

      const outputEl      = document.getElementById("output");
      const copyBtn       = document.getElementById("copyBtn");
      const genBtn        = document.getElementById("genBtn");
      const lengthSlider  = document.getElementById("lengthSlider");
      const lengthValue   = document.getElementById("lengthValue");
      const strengthBar   = document.getElementById("strengthBar");
      const strengthLabel = document.getElementById("strengthLabel");
      const entropyText   = document.getElementById("entropyText");
      const toast         = document.getElementById("toast");

      const switches = {};
      document.querySelectorAll(".switch").forEach((sw) => {
        switches[sw.dataset.opt] = sw;
        sw.addEventListener("click", () => {
          sw.classList.toggle("on");
        });
      });

      // ---------- Secure random integer in [0, max) ----------
      // Uses rejection sampling to avoid modulo bias.
      function secureRandomInt(max) {
        if (max <= 0 || max > 256) {
          // fall back for very large sets (not used here, but safe)
          const buf = new Uint32Array(1);
          crypto.getRandomValues(buf);
          return buf[0] % max;
        }
        const limit = 256 - (256 % max);
        const buf = new Uint8Array(1);
        while (true) {
          crypto.getRandomValues(buf);
          if (buf[0] < limit) return buf[0] % max;
        }
      }

      // ---------- Build pool ----------
      function getSelectedSets() {
        const selected = [];
        for (const key of Object.keys(SETS)) {
          if (switches[key].classList.contains("on")) {
            selected.push(SETS[key]);
          }
        }
        return selected;
      }

      // ---------- Generate ----------
      function generate() {
        const sets = getSelectedSets();
        const length = parseInt(lengthSlider.value, 10);

        if (sets.length === 0) {
          outputEl.textContent = "⚠️ Select at least one character type";
          outputEl.style.color = "#fbbf24";
          updateStrength(0, 0);
          return;
        }

        // Guarantee at least one char from each selected set
        const chars = [];
        for (const s of sets) {
          chars.push(s[secureRandomInt(s.length)]);
        }

        const pool = sets.join("");
        while (chars.length < length) {
          chars.push(pool[secureRandomInt(pool.length)]);
        }

        // Shuffle securely (Fisher-Yates with secure random)
        for (let i = chars.length - 1; i > 0; i--) {
          const j = secureRandomInt(i + 1);
          [chars[i], chars[j]] = [chars[j], chars[i]];
        }

        const password = chars.join("");
        outputEl.textContent = password;
        outputEl.style.color = "#38bdf8";

        updateStrength(password, pool.length);
        return password;
      }

      // ---------- Strength meter ----------
      function updateStrength(password, poolSize) {
        if (!password || password.length === 0) {
          strengthBar.style.width = "0%";
          strengthBar.style.background = "transparent";
          strengthLabel.textContent = "—";
          strengthLabel.style.color = "#64748b";
          entropyText.textContent = "0 bits";
          return;
        }

        const entropy = password.length * Math.log2(poolSize || 1);
        const pct = Math.min(100, (entropy / 128) * 100);

        let label, color;
        if (entropy < 28)      { label = "Very weak"; color = "#ef4444"; }
        else if (entropy < 40) { label = "Weak";      color = "#f97316"; }
        else if (entropy < 60) { label = "Fair";      color = "#eab308"; }
        else if (entropy < 80) { label = "Strong";    color = "#10b981"; }
        else                   { label = "Very strong";color = "#06b6d4"; }

        strengthBar.style.width = pct + "%";
        strengthBar.style.background = color;
        strengthLabel.textContent = label;
        strengthLabel.style.color = color;
        entropyText.textContent = `${Math.round(entropy)} bits`;
      }

      // ---------- Copy ----------
      async function copyPassword() {
        const pw = outputEl.textContent;
        if (!pw || pw.startsWith("⚠️")) return;
        try {
          await navigator.clipboard.writeText(pw);
          showToast("✅ Copied to clipboard");
        } catch {
          // fallback
          const ta = document.createElement("textarea");
          ta.value = pw;
          document.body.appendChild(ta);
          ta.select();
          try {
            document.execCommand("copy");
            showToast("✅ Copied to clipboard");
          } catch {
            showToast("❌ Copy failed");
          }
          document.body.removeChild(ta);
        }
      }

      function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add("show");
        clearTimeout(showToast._t);
        showToast._t = setTimeout(() => toast.classList.remove("show"), 2000);
      }

      // ---------- Events ----------
      lengthSlider.addEventListener("input", () => {
        lengthValue.textContent = lengthSlider.value;
        if (outputEl.textContent && !outputEl.textContent.startsWith("⚠️")) {
          generate();
        }
      });

      genBtn.addEventListener("click", generate);
      copyBtn.addEventListener("click", copyPassword);

      document.addEventListener("keydown", (e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
        if (e.key === " " || e.key.toLowerCase() === "g") {
          e.preventDefault();
          generate();
        }
      });

      // ---------- Init ----------
      generate();
    });
  </script>
</body>
</html>