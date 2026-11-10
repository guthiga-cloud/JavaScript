<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Day 5 — Dark Mode Toggle</title>
  <style>
    :root,
    [data-theme="light"] {
      --bg: #f8fafc;
      --bg-card: #ffffff;
      --bg-soft: #f1f5f9;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --accent: #6366f1;
      --accent-h: #4f46e5;
      --shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      --toggle-bg: #e2e8f0;
    }

    [data-theme="dark"] {
      --bg: #0f172a;
      --bg-card: #1e293b;
      --bg-soft: #020617;
      --text: #e2e8f0;
      --text-muted: #94a3b8;
      --border: #334155;
      --accent: #818cf8;
      --accent-h: #6366f1;
      --shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      --toggle-bg: #334155;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
    }

    body {
      min-height: 100vh;
      background: var(--bg);
      color: var(--text);
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
    }

    .container {
      width: 100%;
      max-width: 560px;
    }

    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
    }

    .brand {
      font-size: 1.1rem;
      font-weight: 700;
    }

    .toggle {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      user-select: none;
    }

    .toggle-label {
      font-size: 0.85rem;
      color: var(--text-muted);
      min-width: 44px;
      text-align: right;
    }

    .switch {
      position: relative;
      width: 56px;
      height: 30px;
      background: var(--toggle-bg);
      border-radius: 30px;
      transition: background 0.3s ease;
    }

    .switch::after {
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 24px;
      height: 24px;
      background: #fff;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
      transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    }

    [data-theme="dark"] .switch::after {
      transform: translateX(26px);
    }

    [data-theme="dark"] .switch {
      background: var(--accent);
    }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      box-shadow: var(--shadow);
      margin-bottom: 20px;
    }

    .card h1 {
      font-size: 1.6rem;
      margin-bottom: 8px;
    }

    .card p {
      color: var(--text-muted);
      line-height: 1.6;
      margin-bottom: 16px;
    }

    .card p:last-child {
      margin-bottom: 0;
    }

    .card ul {
      margin: 12px 0 0 20px;
      color: var(--text-muted);
      line-height: 1.8;
      font-size: 0.95rem;
    }

    .btn-row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .btn {
      background: var(--accent);
      color: #fff;
      border: none;
      border-radius: 10px;
      padding: 12px 20px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.15s, transform 0.08s;
    }

    .btn:hover {
      background: var(--accent-h);
    }

    .btn:active {
      transform: scale(0.97);
    }

    .btn.ghost {
      background: transparent;
      color: var(--text);
      border: 1px solid var(--border);
    }

    .btn.ghost:hover {
      background: var(--bg-soft);
    }

    .status {
      display: inline-block;
      font-size: 0.8rem;
      padding: 4px 10px;
      border-radius: 999px;
      background: var(--bg-soft);
      color: var(--text-muted);
      margin-left: 8px;
      border: 1px solid var(--border);
    }

    footer {
      text-align: center;
      color: var(--text-muted);
      font-size: 0.82rem;
    }
  </style>
</head>
<body>
  <main class="container">
    <div class="topbar">
      <div class="brand">Theme</div>

      <div class="toggle" id="themeToggle" role="button" tabindex="0" aria-label="Toggle dark mode">
        <span class="toggle-label" id="themeLabel">Light</span>
        <div class="switch"></div>
      </div>
    </div>

    <div class="card">
      <h1>Dark Mode Toggle</h1>
      <p>
        A themeable page using <strong>CSS variables</strong> and a JavaScript toggle.
        Your choice is saved to <code>localStorage</code> and restored on each visit.
      </p>

      <p>
        Current theme: <strong id="themeName">Light</strong>
        <span class="status" id="source">auto-detected</span>
      </p>

      <ul>
        <li>CSS variables control the colors</li>
        <li>Smooth transitions</li>
        <li>Uses your OS preference on first load</li>
        <li>Persists across reloads</li>
        <li>Keyboard accessible</li>
      </ul>
    </div>

    <div class="card">
      <p>Try the buttons below and see the theme update automatically.</p>
      <div class="btn-row">
        <button class="btn" id="toggleBtn">Toggle Theme</button>
        <button class="btn ghost" id="resetBtn">Reset to OS Preference</button>
      </div>
    </div>

    <footer>Theme challenge</footer>
  </main>

  <script>
    document.addEventListener("DOMContentLoaded", () => {
      const STORAGE_KEY = "js-theme-day5";
      const html = document.documentElement;
      const toggleEl = document.getElementById("themeToggle");
      const toggleBtn = document.getElementById("toggleBtn");
      const resetBtn = document.getElementById("resetBtn");
      const themeLabel = document.getElementById("themeLabel");
      const themeNameEl = document.getElementById("themeName");
      const sourceEl = document.getElementById("source");

      const osPrefersDark = () =>
        window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

      function loadSavedTheme() {
        try {
          return localStorage.getItem(STORAGE_KEY);
        } catch {
          return null;
        }
      }

      function saveTheme(theme) {
        try {
          localStorage.setItem(STORAGE_KEY, theme);
        } catch {}
      }

      function clearSavedTheme() {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {}
      }

      function applyTheme(theme, source) {
        html.setAttribute("data-theme", theme);

        const isDark = theme === "dark";
        themeLabel.textContent = isDark ? "Dark" : "Light";
        themeNameEl.textContent = isDark ? "Dark" : "Light";
        sourceEl.textContent = source;
      }

      function initTheme() {
        const saved = loadSavedTheme();

        if (saved === "dark" || saved === "light") {
          applyTheme(saved, "saved choice");
        } else {
          applyTheme(osPrefersDark() ? "dark" : "light", "OS preference");
        }
      }

      function toggleTheme() {
        const current = html.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";

        applyTheme(next, "your choice");
        saveTheme(next);
      }

      function resetTheme() {
        clearSavedTheme();
        applyTheme(osPrefersDark() ? "dark" : "light", "OS preference");
      }

      if (window.matchMedia) {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const listener = (event) => {
          if (!loadSavedTheme()) {
            applyTheme(event.matches ? "dark" : "light", "OS preference");
          }
        };

        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener("change", listener);
        } else if (mediaQuery.addListener) {
          mediaQuery.addListener(listener);
        }
      }

      toggleEl.addEventListener("click", toggleTheme);
      toggleEl.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleTheme();
        }
      });

      toggleBtn.addEventListener("click", toggleTheme);
      resetBtn.addEventListener("click", resetTheme);

      initTheme();
    });
  </script>
</body>
</html>