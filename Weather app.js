<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Day 8 — Weather App</title>
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
      padding: 40px 20px;
    }

    .app {
      background: #0b1220;
      border: 1px solid #1e293b;
      border-radius: 20px;
      padding: 32px;
      width: 100%;
      max-width: 520px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
    }

    h1 { font-size: 1.4rem; margin-bottom: 4px; }
    .sub { color: #94a3b8; font-size: 0.85rem; margin-bottom: 24px; }

    /* ---------- Search ---------- */
    .search {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }
    .search input {
      flex: 1;
      background: #020617;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 12px 14px;
      color: #e2e8f0;
      font-size: 0.95rem;
      outline: none;
      transition: border 0.15s;
      font-family: inherit;
    }
    .search input:focus { border-color: #6366f1; }
    .search button {
      background: #6366f1;
      border: none;
      color: #fff;
      padding: 0 22px;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s, transform 0.08s;
      font-family: inherit;
    }
    .search button:hover:not(:disabled)  { background: #4f46e5; }
    .search button:active:not(:disabled) { transform: scale(0.96); }
    .search button:disabled { opacity: 0.5; cursor: not-allowed; }

    .quick-cities {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }
    .chip {
      background: #1e293b;
      color: #94a3b8;
      border: none;
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 0.78rem;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
      font-family: inherit;
    }
    .chip:hover { background: #334155; color: #e2e8f0; }

    /* ---------- Status ---------- */
    .status {
      display: inline-block;
      font-size: 0.72rem;
      padding: 3px 10px;
      border-radius: 999px;
      background: #1e293b;
      color: #94a3b8;
      margin-bottom: 20px;
      letter-spacing: 0.5px;
    }
    .status.live    { color: #10b981; border: 1px solid #064e3b; }
    .status.demo    { color: #fbbf24; border: 1px solid #78350f; }
    .status.error   { color: #ef4444; border: 1px solid #7f1d1d; }
    .status.loading { color: #94a3b8; }

    /* ---------- Main weather card ---------- */
    .weather {
      background: #020617;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 20px;
      display: none;
    }
    .weather.show { display: block; }

    .weather-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .city {
      font-size: 1.35rem;
      font-weight: 700;
    }
    .desc {
      color: #94a3b8;
      font-size: 0.9rem;
      margin-top: 2px;
    }
    .emoji {
      font-size: 3rem;
      line-height: 1;
    }

    .temp-row {
      display: flex;
      align-items: baseline;
      gap: 12px;
      margin-bottom: 20px;
    }
    .temp {
      font-size: 3.2rem;
      font-weight: 700;
      color: #38bdf8;
      font-family: "Courier New", monospace;
    }
    .feels {
      color: #64748b;
      font-size: 0.9rem;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .stat {
      background: #0b1220;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 12px;
    }
    .stat-label {
      font-size: 0.72rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    .stat-value {
      font-size: 1.1rem;
      font-weight: 600;
      color: #e2e8f0;
    }

    /* ---------- Forecast ---------- */
    .forecast-title {
      font-size: 0.78rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
    }
    .forecast {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }
    .forecast-day {
      background: #020617;
      border-radius: 10px;
      padding: 12px;
      text-align: center;
    }
    .forecast-date {
      font-size: 0.75rem;
      color: #64748b;
      margin-bottom: 6px;
    }
    .forecast-emoji { font-size: 1.6rem; margin-bottom: 6px; }
    .forecast-temp {
      font-size: 0.88rem;
      font-weight: 600;
      color: #38bdf8;
    }
    .forecast-desc {
      font-size: 0.7rem;
      color: #94a3b8;
      margin-top: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ---------- Loading spinner ---------- */
    .spinner {
      display: none;
      justify-content: center;
      padding: 30px 0;
    }
    .spinner.show { display: flex; }
    .spinner::after {
      content: "";
      width: 32px;
      height: 32px;
      border: 3px solid #1e293b;
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

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
    <h1>🌤️ Weather App</h1>
    <p class="sub">Day 8 — Live weather + 3-day forecast</p>

    <div class="search">
      <input
        type="text"
        id="cityInput"
        placeholder="Enter city (e.g. Nairobi)"
        autocomplete="off"
        value="Nairobi"
      />
      <button id="searchBtn">Search</button>
    </div>

    <div class="quick-cities">
      <button class="chip" data-city="Nairobi">Nairobi</button>
      <button class="chip" data-city="London">London</button>
      <button class="chip" data-city="New York">New York</button>
      <button class="chip" data-city="Tokyo">Tokyo</button>
      <button class="chip" data-city="Paris">Paris</button>
    </div>

    <span class="status loading" id="status">ready</span>

    <div class="spinner" id="spinner"></div>

    <div class="weather" id="weather">
      <div class="weather-top">
        <div>
          <div class="city"  id="cityName">—</div>
          <div class="desc"  id="cityDesc">—</div>
        </div>
        <div class="emoji" id="weatherEmoji">🌡️</div>
      </div>

      <div class="temp-row">
        <div class="temp"  id="temp">—</div>
        <div class="feels" id="feels">feels like —</div>
      </div>

      <div class="stats">
        <div class="stat">
          <div class="stat-label">Humidity</div>
          <div class="stat-value" id="humidity">—</div>
        </div>
        <div class="stat">
          <div class="stat-label">Wind</div>
          <div class="stat-value" id="wind">—</div>
        </div>
        <div class="stat">
          <div class="stat-label">Pressure</div>
          <div class="stat-value" id="pressure">—</div>
        </div>
        <div class="stat">
          <div class="stat-label">Visibility</div>
          <div class="stat-value" id="visibility">—</div>
        </div>
      </div>
    </div>

    <div id="forecastSection" style="display:none">
      <div class="forecast-title">📅 3-Day Forecast</div>
      <div class="forecast" id="forecast"></div>
    </div>

    <footer>Day 8 of my JavaScript challenge 🚀</footer>
  </main>

  <script>
    // ============================================
    // DAY 8 — Weather App
    // Uses wttr.in (free, no API key needed)
    // Falls back to demo data if offline.
    // ============================================
    document.addEventListener("DOMContentLoaded", () => {
      const API_BASE = "https://wttr.in";

      const cityInput     = document.getElementById("cityInput");
      const searchBtn     = document.getElementById("searchBtn");
      const statusEl      = document.getElementById("status");
      const spinner       = document.getElementById("spinner");
      const weatherBox    = document.getElementById("weather");
      const cityNameEl    = document.getElementById("cityName");
      const cityDescEl    = document.getElementById("cityDesc");
      const weatherEmojiEl= document.getElementById("weatherEmoji");
      const tempEl        = document.getElementById("temp");
      const feelsEl       = document.getElementById("feels");
      const humidityEl    = document.getElementById("humidity");
      const windEl        = document.getElementById("wind");
      const pressureEl    = document.getElementById("pressure");
      const visibilityEl  = document.getElementById("visibility");
      const forecastSec   = document.getElementById("forecastSection");
      const forecastEl    = document.getElementById("forecast");

      // ---------- Emoji picker by weather code ----------
      function emojiFor(code, desc) {
        const d = (desc || "").toLowerCase();
        if (d.includes("thunder")) return "⛈️";
        if (d.includes("rain") || d.includes("drizzle") || d.includes("shower")) return "🌧️";
        if (d.includes("snow") || d.includes("sleet")) return "❄️";
        if (d.includes("fog") || d.includes("mist")) return "🌫️";
        if (d.includes("cloud") || d.includes("overcast")) return "☁️";
        if (d.includes("sun") || d.includes("clear")) return "☀️";
        return "🌤️";
      }

      // ---------- Demo data (offline fallback) ----------
      function demoData(city) {
        return {
          current_condition: [{
            temp_C: "22",
            FeelsLikeC: "23",
            humidity: "65",
            windspeedKmph: "12",
            winddir16Point: "NE",
            pressure: "1015",
            visibility: "10",
            weatherDesc: [{ value: "Partly cloudy" }],
          }],
          weather: [
            { date: "today",   maxtempC: "25", mintempC: "15", hourly: [{ weatherDesc: [{ value: "Partly cloudy" }] }] },
            { date: "tomorrow",maxtempC: "27", mintempC: "16", hourly: [{ weatherDesc: [{ value: "Sunny" }] }] },
            { date: "+2 days", maxtempC: "24", mintempC: "14", hourly: [{ weatherDesc: [{ value: "Light rain" }] }] },
          ],
          _demo: true,
          _city: city,
        };
      }

      // ---------- Status helpers ----------
      function setStatus(kind, text) {
        statusEl.className = "status " + kind;
        statusEl.textContent = text;
      }

      // ---------- Fetch weather ----------
      async function fetchWeather(city) {
        city = (city || "").trim();
        if (!city) {
          setStatus("error", "❌ Enter a city");
          return;
        }

        searchBtn.disabled = true;
        weatherBox.classList.remove("show");
        forecastSec.style.display = "none";
        spinner.classList.add("show");
        setStatus("loading", "fetching…");

        let data = null;
        let source = "demo";

        try {
          const url = `${API_BASE}/${encodeURIComponent(city)}?format=j1`;
          const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
          if (!res.ok) throw new Error("HTTP " + res.status);
          data = await res.json();
          if (!data || !data.current_condition) throw new Error("Bad response");
          source = "live";
        } catch (err) {
          console.warn("Live fetch failed:", err);
          data = demoData(city);
          source = "demo";
        }

        try {
          render(data, city, source);
        } catch (e) {
          console.error(e);
          setStatus("error", "❌ Could not parse data");
        } finally {
          spinner.classList.remove("show");
          searchBtn.disabled = false;
        }
      }

      // ---------- Render ----------
      function render(data, city, source) {
        const cur = data.current_condition[0];
        const desc = cur.weatherDesc[0].value;

        cityNameEl.textContent = data._city || city;
        cityDescEl.textContent = desc;
        weatherEmojiEl.textContent = emojiFor(null, desc);

        tempEl.textContent  = `${cur.temp_C}°C`;
        feelsEl.textContent = `feels like ${cur.FeelsLikeC}°C`;

        humidityEl.textContent   = `${cur.humidity}%`;
        windEl.textContent       = `${cur.windspeedKmph} km/h ${cur.winddir16Point}`;
        pressureEl.textContent   = `${cur.pressure} hPa`;
        visibilityEl.textContent = `${cur.visibility} km`;

        weatherBox.classList.add("show");

        // Forecast
        const days = (data.weather || []).slice(0, 3);
        if (days.length > 0) {
          forecastEl.innerHTML = days.map((d) => {
            const mid = d.hourly[Math.floor(d.hourly.length / 2)] || d.hourly[0];
            const ddesc = mid?.weatherDesc?.[0]?.value || "—";
            return `
              <div class="forecast-day">
                <div class="forecast-date">${d.date}</div>
                <div class="forecast-emoji">${emojiFor(null, ddesc)}</div>
                <div class="forecast-temp">${d.mintempC}° – ${d.maxtempC}°</div>
                <div class="forecast-desc" title="${ddesc}">${ddesc}</div>
              </div>
            `;
          }).join("");
          forecastSec.style.display = "block";
        }

        if (source === "live") setStatus("live", "🌐 live · wttr.in");
        else                    setStatus("demo", "📦 demo (offline)");
      }

      // ---------- Events ----------
      searchBtn.addEventListener("click", () => fetchWeather(cityInput.value));
      cityInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") fetchWeather(cityInput.value);
      });

      document.querySelectorAll(".chip").forEach((chip) => {
        chip.addEventListener("click", () => {
          cityInput.value = chip.dataset.city;
          fetchWeather(chip.dataset.city);
        });
      });

      // ---------- Init ----------
      fetchWeather("Nairobi");
    });
  </script>
</body>
</html>