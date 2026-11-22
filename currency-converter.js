<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Day 16 — Currency Converter</title>
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
    }

    h1 { font-size: 1.4rem; margin-bottom: 4px; text-align: center; }
    .sub { color: #94a3b8; font-size: 0.85rem; margin-bottom: 20px; text-align: center; }

    /* ---------- Status chip ---------- */
    .status-wrap {
      text-align: center;
      margin-bottom: 20px;
    }
    .status {
      display: inline-block;
      font-size: 0.72rem;
      padding: 3px 10px;
      border-radius: 999px;
      background: #1e293b;
      color: #94a3b8;
      letter-spacing: 0.5px;
    }
    .status.live    { color: #10b981; border: 1px solid #064e3b; }
    .status.offline { color: #fbbf24; border: 1px solid #78350f; }
    .status.loading { color: #94a3b8; }
    .status.error   { color: #ef4444; border: 1px solid #7f1d1d; }

    /* ---------- Converter row ---------- */
    .converter {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 10px;
      align-items: end;
      margin-bottom: 16px;
    }

    .field { display: flex; flex-direction: column; gap: 6px; }
    .field label {
      font-size: 0.72rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .field input,
    .field select {
      background: #020617;
      border: 2px solid #1e293b;
      border-radius: 10px;
      padding: 12px 14px;
      color: #38bdf8;
      font-size: 1.2rem;
      font-family: "Courier New", monospace;
      font-weight: 700;
      outline: none;
      transition: border 0.15s;
      width: 100%;
    }
    .field select {
      color: #e2e8f0;
      font-size: 0.95rem;
      font-family: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    .field input:focus,
    .field select:focus { border-color: #6366f1; }

    .swap-btn {
      background: #1e293b;
      border: none;
      color: #e2e8f0;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      font-size: 1.2rem;
      cursor: pointer;
      transition: background 0.15s, transform 0.4s;
      font-family: inherit;
      margin-bottom: 4px;
    }
    .swap-btn:hover { background: #334155; }
    .swap-btn.spin { transform: rotate(180deg); }

    /* ---------- Result ---------- */
    .result {
      background: linear-gradient(135deg, #1e1b4b, #312e81);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 16px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .result::after {
      content: "💱";
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 2.6rem;
      opacity: 0.2;
    }
    .result-amount {
      font-size: 2.2rem;
      font-weight: 700;
      font-family: "Courier New", monospace;
      color: #fff;
      word-break: break-all;
    }
    .result-from {
      font-size: 0.85rem;
      color: #c7d2fe;
      margin-top: 6px;
    }
    .result-rate {
      font-size: 0.78rem;
      color: #a5b4fc;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid rgba(165, 180, 252, 0.2);
    }

    /* ---------- Favorite pairs ---------- */
    .favorites-title {
      font-size: 0.72rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    .favorites {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-bottom: 16px;
      min-height: 28px;
    }
    .fav-chip {
      background: #1e293b;
      border: 1px solid #334155;
      color: #94a3b8;
      padding: 5px 10px;
      border-radius: 999px;
      font-size: 0.78rem;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s;
    }
    .fav-chip:hover {
      color: #e2e8f0;
      border-color: #6366f1;
    }
    .fav-chip .x {
      color: #ef4444;
      margin-left: 6px;
      font-weight: 700;
    }

    /* ---------- Buttons ---------- */
    .btn-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .btn {
      background: #6366f1;
      border: none;
      color: #fff;
      padding: 12px;
      border-radius: 10px;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s, transform 0.08s;
      font-family: inherit;
    }
    .btn:hover  { background: #4f46e5; }
    .btn:active { transform: scale(0.97); }
    .btn.ghost {
      background: #1e293b;
      color: #e2e8f0;
    }
    .btn.ghost:hover { background: #334155; }

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
    <h1>💱 Currency Converter</h1>
    <p class="sub">Day 16 — Live rates, offline fallback, favorites</p>

    <div class="status-wrap">
      <span class="status loading" id="status">loading rates…</span>
    </div>

    <div class="converter">
      <div class="field">
        <label>From</label>
        <input type="number" id="amount" value="100" min="0" step="0.01" />
        <select id="fromCurrency"></select>
      </div>
      <button class="swap-btn" id="swapBtn" title="Swap">⇄</button>
      <div class="field">
        <label>To</label>
        <input type="text" id="resultInput" readonly />
        <select id="toCurrency"></select>
      </div>
    </div>

    <div class="result">
      <div class="result-amount" id="resultAmount">—</div>
      <div class="result-from"   id="resultFrom"></div>
      <div class="result-rate"   id="resultRate"></div>
    </div>

    <div class="favorites-title">⭐ Favorites</div>
    <div class="favorites" id="favorites"></div>

    <div class="btn-row">
      <button class="btn"       id="favoriteBtn">⭐ Save Pair</button>
      <button class="btn ghost" id="refreshBtn">🔄 Refresh Rates</button>
    </div>

    <footer>Day 16 of my JavaScript challenge 🚀</footer>
  </main>

  <script>
    // ============================================
    // DAY 16 — Currency Converter
    // Primary API: open.er-api.com (free, no key)
    // Fallback: built-in approximate rates
    // ============================================
    document.addEventListener("DOMContentLoaded", () => {
      const API_URL   = "https://open.er-api.com/v6/latest/USD";
      const FAV_KEY   = "js-currency-favs-day16";

      // Fallback rates (approx, per 1 USD)
      const FALLBACK_RATES = {
        USD: 1,    EUR: 0.92, GBP: 0.79, KES: 129,  NGN: 1500,
        ZAR: 18.5, JPY: 149,  CNY: 7.25, INR: 83,   CAD: 1.36,
        AUD: 1.52, CHF: 0.88, AED: 3.67, SAR: 3.75, UGX: 3800,
        TZS: 2500, RWF: 1300, BIF: 2800, EGP: 31,   GHS: 15,
      };

      const POPULAR_CURRENCIES = ["USD","EUR","GBP","KES","NGN","ZAR","JPY","CNY","INR","CAD","AUD","CHF","AED"];

      const amountEl      = document.getElementById("amount");
      const fromSel       = document.getElementById("fromCurrency");
      const toSel         = document.getElementById("toCurrency");
      const resultInput   = document.getElementById("resultInput");
      const resultAmount  = document.getElementById("resultAmount");
      const resultFrom    = document.getElementById("resultFrom");
      const resultRate    = document.getElementById("resultRate");
      const statusEl      = document.getElementById("status");
      const favoritesEl   = document.getElementById("favorites");
      const swapBtn       = document.getElementById("swapBtn");
      const favoriteBtn   = document.getElementById("favoriteBtn");
      const refreshBtn    = document.getElementById("refreshBtn");

      let rates  = null;
      let source = "loading";
      let favorites = loadFavorites();

      // ---------- Storage ----------
      function loadFavorites() {
        try {
          const raw = localStorage.getItem(FAV_KEY);
          return raw ? JSON.parse(raw) : [["USD","KES"]];
        } catch { return [["USD","KES"]]; }
      }
      function saveFavorites() {
        try { localStorage.setItem(FAV_KEY, JSON.stringify(favorites)); } catch {}
      }

      // ---------- Fetch rates ----------
      async function fetchRates() {
        setStatus("loading", "loading rates…");
        source = "loading";

        try {
          const res = await fetch(API_URL, { signal: AbortSignal.timeout(8000) });
          if (!res.ok) throw new Error("HTTP " + res.status);
          const data = await res.json();
          if (!data.rates || data.result !== "success") throw new Error("bad response");
          rates = data.rates;
          source = "live";
          setStatus("live", "🌐 live rates · open.er-api.com");
        } catch (err) {
          console.warn("Live failed:", err);
          rates = FALLBACK_RATES;
          source = "offline";
          setStatus("offline", "📦 offline fallback");
        }

        ensureCurrencyOptions();
        convert();
      }

      // ---------- Status ----------
      function setStatus(kind, text) {
        statusEl.className = "status " + kind;
        statusEl.textContent = text;
      }

      // ---------- Populate select ----------
      function ensureCurrencyOptions() {
        if (!rates) return;
        const codes = Object.keys(rates).sort();
        const previousFrom = fromSel.value || "USD";
        const previousTo   = toSel.value   || "KES";

        fillSelect(fromSel, codes, previousFrom);
        fillSelect(toSel,   codes, previousTo);
      }

      function fillSelect(sel, codes, value) {
        sel.innerHTML = "";
        // Popular first, then the rest
        const popular = POPULAR_CURRENCIES.filter((c) => codes.includes(c));
        const rest = codes.filter((c) => !popular.includes(c));

        const addGroup = (label, arr) => {
          if (arr.length === 0) return;
          const og = document.createElement("optgroup");
          og.label = label;
          for (const c of arr) {
            const opt = document.createElement("option");
            opt.value = c;
            opt.textContent = c;
            og.appendChild(opt);
          }
          sel.appendChild(og);
        };

        addGroup("Popular", popular);
        addGroup("All", rest);

        if ([...sel.options].some((o) => o.value === value)) {
          sel.value = value;
        }
      }

      // ---------- Conversion ----------
      function convert() {
        if (!rates) return;
        const from = fromSel.value;
        const to   = toSel.value;
        const amt  = parseFloat(amountEl.value);

        if (!from || !to || !rates[from] || !rates[to]) return;

        if (isNaN(amt) || amt < 0) {
          resultAmount.textContent = "—";
          resultFrom.textContent   = "";
          resultRate.textContent   = "";
          resultInput.value        = "";
          return;
        }

        const rate   = rates[to] / rates[from];   // 1 FROM = rate TO
        const result = amt * rate;

        resultAmount.textContent = `${fmt(result)} ${to}`;
        resultFrom.textContent   = `${fmt(amt)} ${from} =`;
        resultRate.textContent   = `1 ${from} = ${rate.toFixed(6)} ${to}`;
        resultInput.value        = result.toFixed(2);
      }

      function fmt(n) {
        // large numbers → thin out decimals
        if (n >= 1_000_000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
        if (n >= 1000)      return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
        if (n >= 1)         return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
        return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
      }

      // ---------- Favorites ----------
      function renderFavorites() {
        if (favorites.length === 0) {
          favoritesEl.innerHTML = `<span style="color:#475569;font-size:0.78rem">No favorites yet</span>`;
          return;
        }
        favoritesEl.innerHTML = "";
        favorites.forEach(([f, t], i) => {
          const chip = document.createElement("button");
          chip.className = "fav-chip";
          chip.innerHTML = `${f}→${t} <span class="x" title="Remove">×</span>`;
          chip.addEventListener("click", (e) => {
            if (e.target.classList.contains("x")) {
              favorites.splice(i, 1);
              saveFavorites();
              renderFavorites();
              return;
            }
            setPair(f, t);
          });
          favoritesEl.appendChild(chip);
        });
      }

      function setPair(f, t) {
        if (rates && rates[f] && rates[t]) {
          fromSel.value = f;
          toSel.value   = t;
          convert();
        }
      }

      function addFavorite() {
        const f = fromSel.value;
        const t = toSel.value;
        if (!f || !t || f === t) return;
        if (favorites.some(([a, b]) => a === f && b === t)) {
          setStatus("live", "⚠️ Pair already saved");
          return;
        }
        favorites.unshift([f, t]);
        favorites = favorites.slice(0, 8); // cap at 8
        saveFavorites();
        renderFavorites();
      }

      // ---------- Events ----------
      amountEl.addEventListener("input", convert);
      fromSel.addEventListener("change", convert);
      toSel.addEventListener("change", convert);

      swapBtn.addEventListener("click", () => {
        const f = fromSel.value;
        const t = toSel.value;
        fromSel.value = t;
        toSel.value   = f;
        swapBtn.classList.add("spin");
        setTimeout(() => swapBtn.classList.remove("spin"), 400);
        convert();
      });

      favoriteBtn.addEventListener("click", addFavorite);
      refreshBtn.addEventListener("click", fetchRates);

      // ---------- Init ----------
      renderFavorites();
      fetchRates();
    });
  </script>
</body>
</html>