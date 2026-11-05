<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Day 1 — Hello JavaScript</title>
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

    .card {
      background: #0b1220;
      border: 1px solid #1e293b;
      border-radius: 16px;
      padding: 40px;
      max-width: 480px;
      width: 100%;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
      text-align: center;
    }

    h1 { font-size: 1.8rem; margin-bottom: 8px; }
    .sub { color: #94a3b8; margin-bottom: 24px; }

    .clock {
      font-family: "Courier New", monospace;
      font-size: 2.4rem;
      font-weight: bold;
      letter-spacing: 4px;
      color: #38bdf8;
      padding: 16px;
      background: #020617;
      border-radius: 12px;
      margin-bottom: 24px;
    }

    .btn {
      background: #6366f1;
      color: #fff;
      border: none;
      padding: 14px 28px;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, transform 0.1s;
    }
    .btn:hover  { background: #4f46e5; }
    .btn:active { transform: scale(0.97); }

    .output {
      margin-top: 24px;
      padding: 16px;
      background: #020617;
      border-radius: 10px;
      min-height: 50px;
      color: #a5b4fc;
      font-size: 1.05rem;
      transition: color 0.2s;
    }
    .output.greet { color: #10b981; }

    footer { margin-top: 28px; color: #64748b; }
  </style>
</head>
<body>
  <main class="card">
    <h1>👋 Hello, JavaScript!</h1>
    <p class="sub">Day 1 — first commit in the JS challenge.</p>

    <div class="clock" id="clock">--:--:--</div>

    <button id="greetBtn" class="btn">Say Hello</button>

    <div id="output" class="output">Your message will appear here…</div>

    <footer>
      <small>Day <strong>1</strong> of my JavaScript challenge 🚀</small>
    </footer>
  </main>

  <script>
    // ============================================
    // DAY 1 — Hello JavaScript (single-file)
    // ============================================
    document.addEventListener("DOMContentLoaded", () => {
      const clockEl  = document.getElementById("clock");
      const btn      = document.getElementById("greetBtn");
      const outputEl = document.getElementById("output");

      // 1. Live clock
      const pad = (n) => String(n).padStart(2, "0");

      function updateClock() {
        const now = new Date();
        clockEl.textContent =
          `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      }
      updateClock();
      setInterval(updateClock, 1000);

      // 2. Greeting button
      const greetings = [
        "Hello, world! 🌍",
        "Jambo! 🇰🇪",
        "Bonjour! 🇫🇷",
        "こんにちは! 🇯🇵",
        "Hola! 🇪🇸",
        "Ciao! 🇮🇹",
        "Habari yako? 👋",
        "JavaScript is alive! ⚡",
      ];

      btn.addEventListener("click", () => {
        const msg = greetings[Math.floor(Math.random() * greetings.length)];
        outputEl.textContent = msg;
        outputEl.classList.add("greet");
        console.log("[Greet] " + msg);
      });
    });
  </script>
</body>
</html>