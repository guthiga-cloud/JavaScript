<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Day 17 — Image Slider</title>
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
      padding: 28px;
      width: 100%;
      max-width: 640px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
    }

    h1 { font-size: 1.4rem; margin-bottom: 4px; text-align: center; }
    .sub { color: #94a3b8; font-size: 0.85rem; margin-bottom: 20px; text-align: center; }

    /* ---------- Slider ---------- */
    .slider-wrap {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 16px;
      aspect-ratio: 16 / 10;
      background: #020617;
      user-select: none;
      touch-action: pan-y;
    }

    .slides {
      display: flex;
      height: 100%;
      transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .slide {
      flex: 0 0 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      color: #fff;
      padding: 24px;
    }

    /* Each slide is a self-contained gradient scene */
    .slide::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 0;
    }
    .slide.s1::before { background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899); }
    .slide.s2::before { background: linear-gradient(135deg, #06b6d4, #3b82f6, #6366f1); }
    .slide.s3::before { background: linear-gradient(135deg, #f97316, #ef4444, #ec4899); }
    .slide.s4::before { background: linear-gradient(135deg, #10b981, #14b8a6, #0ea5e9); }
    .slide.s5::before { background: linear-gradient(135deg, #eab308, #f97316, #f43f5e); }

    .slide-emoji {
      font-size: 4.5rem;
      margin-bottom: 12px;
      position: relative;
      z-index: 1;
      filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4));
    }
    .slide-title {
      font-size: 1.6rem;
      font-weight: 800;
      position: relative;
      z-index: 1;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
      text-align: center;
    }
    .slide-desc {
      font-size: 0.9rem;
      opacity: 0.9;
      margin-top: 6px;
      position: relative;
      z-index: 1;
      text-align: center;
      max-width: 400px;
    }

    /* ---------- Arrow buttons ---------- */
    .arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(148, 163, 184, 0.25);
      color: #fff;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 1.3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 5;
      transition: background 0.15s, transform 0.15s;
    }
    .arrow:hover { background: rgba(99, 102, 241, 0.7); }
    .arrow:active { transform: translateY(-50%) scale(0.9); }
    .arrow.prev { left: 12px; }
    .arrow.next { right: 12px; }

    /* ---------- Dots ---------- */
    .dots {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-bottom: 16px;
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #334155;
      border: none;
      cursor: pointer;
      padding: 0;
      transition: background 0.2s, transform 0.2s, width 0.3s;
    }
    .dot:hover { background: #475569; }
    .dot.active {
      background: #6366f1;
      width: 28px;
      border-radius: 5px;
    }

    /* ---------- Controls row ---------- */
    .controls {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
      margin-bottom: 12px;
    }
    .ctrl-btn {
      background: #1e293b;
      border: none;
      color: #e2e8f0;
      padding: 11px;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s, transform 0.08s;
      font-family: inherit;
    }
    .ctrl-btn:hover  { background: #334155; }
    .ctrl-btn:active { transform: scale(0.97); }
    .ctrl-btn.active { background: #1e3a8a; color: #93c5fd; }

    /* ---------- Counter ---------- */
    .counter {
      text-align: center;
      color: #64748b;
      font-size: 0.8rem;
      font-family: "Courier New", monospace;
    }

    footer {
      text-align: center;
      color: #64748b;
      font-size: 0.78rem;
      margin-top: 16px;
    }

    /* Slide fade on active */
    .slide.fading { animation: fadeIn 0.45s ease; }
    @keyframes fadeIn {
      from { opacity: 0.6; }
      to   { opacity: 1; }
    }
  </style>
</head>
<body>
  <main class="app">
    <h1>🖼️ Image Slider</h1>
    <p class="sub">Day 17 — Auto-play carousel with swipe & keyboard</p>

    <div class="slider-wrap" id="sliderWrap">
      <div class="slides" id="slides">
        <div class="slide s1">
          <div class="slide-emoji">🚀</div>
          <div class="slide-title">Launch Into Code</div>
          <div class="slide-desc">Start small, ship something every day.</div>
        </div>
        <div class="slide s2">
          <div class="slide-emoji">🌊</div>
          <div class="slide-title">Go With the Flow</div>
          <div class="slide-desc">CSS gradients + JS transitions = smooth sailing.</div>
        </div>
        <div class="slide s3">
          <div class="slide-emoji">🔥</div>
          <div class="slide-title">Keep the Fire</div>
          <div class="slide-desc">Consistency beats intensity. Every time.</div>
        </div>
        <div class="slide s4">
          <div class="slide-emoji">🌿</div>
          <div class="slide-title">Grow Steady</div>
          <div class="slide-desc">Small improvements compound fast.</div>
        </div>
        <div class="slide s5">
          <div class="slide-emoji">⭐</div>
          <div class="slide-title">Shine Bright</div>
          <div class="slide-desc">You've made it this far. Keep going.</div>
        </div>
      </div>

      <button class="arrow prev" id="prevBtn" title="Previous">‹</button>
      <button class="arrow next" id="nextBtn" title="Next">›</button>
    </div>

    <div class="dots" id="dots"></div>

    <div class="controls">
      <button class="ctrl-btn active" id="autoplayBtn">⏸ Pause</button>
      <button class="ctrl-btn" id="speedBtn">⏱ 4s</button>
      <button class="ctrl-btn" id="fullscreenBtn">⛶ Full</button>
    </div>

    <div class="counter" id="counter">1 / 5</div>

    <footer>Day 17 of my JavaScript challenge 🚀</footer>
  </main>

  <script>
    // ============================================
    // DAY 17 — Image Slider / Carousel
    // ============================================
    document.addEventListener("DOMContentLoaded", () => {
      const slidesEl     = document.getElementById("slides");
      const slidesCount  = slidesEl.children.length;
      const dotsEl       = document.getElementById("dots");
      const prevBtn      = document.getElementById("prevBtn");
      const nextBtn      = document.getElementById("nextBtn");
      const autoplayBtn  = document.getElementById("autoplayBtn");
      const speedBtn     = document.getElementById("speedBtn");
      const fullscreenBtn= document.getElementById("fullscreenBtn");
      const counterEl    = document.getElementById("counter");
      const sliderWrap   = document.getElementById("sliderWrap");

      const SPEEDS       = [2000, 3000, 4000, 6000];
      let current        = 0;
      let autoplay       = true;
      let speedIndex     = 2;
      let timerId        = null;
      let touchStartX    = 0;
      let touchEndX      = 0;

      // ---------- Render dots ----------
      function renderDots() {
        dotsEl.innerHTML = "";
        for (let i = 0; i < slidesCount; i++) {
          const d = document.createElement("button");
          d.className = "dot" + (i === current ? " active" : "");
          d.setAttribute("aria-label", `Go to slide ${i + 1}`);
          d.addEventListener("click", () => goTo(i));
          dotsEl.appendChild(d);
        }
      }

      // ---------- Move slider ----------
      function goTo(index, fromAutoplay = false) {
        current = (index + slidesCount) % slidesCount;
        slidesEl.style.transform = `translateX(-${current * 100}%)`;

        // active dot
        [...dotsEl.children].forEach((d, i) =>
          d.classList.toggle("active", i === current)
        );

        // counter
        counterEl.textContent = `${current + 1} / ${slidesCount}`;

        // fade animation on active slide
        const activeSlide = slidesEl.children[current];
        activeSlide.classList.remove("fading");
        void activeSlide.offsetWidth; // reflow
        activeSlide.classList.add("fading");

        if (!fromAutoplay) restartAutoplay();
      }

      function next() { goTo(current + 1); }
      function prev() { goTo(current - 1); }

      // ---------- Autoplay ----------
      function startAutoplay() {
        stopAutoplay();
        if (!autoplay) return;
        timerId = setInterval(next, SPEEDS[speedIndex]);
        autoplayBtn.textContent = "⏸ Pause";
        autoplayBtn.classList.add("active");
      }
      function stopAutoplay() {
        if (timerId) { clearInterval(timerId); timerId = null; }
        if (autoplay) {
          autoplayBtn.textContent = "▶ Play";
          autoplayBtn.classList.remove("active");
        }
      }
      function restartAutoplay() {
        if (autoplay) startAutoplay();
      }
      function toggleAutoplay() {
        autoplay = !autoplay;
        if (autoplay) startAutoplay();
        else stopAutoplay();
      }

      // ---------- Speed ----------
      function cycleSpeed() {
        speedIndex = (speedIndex + 1) % SPEEDS.length;
        speedBtn.textContent = `⏱ ${SPEEDS[speedIndex] / 1000}s`;
        restartAutoplay();
      }

      // ---------- Fullscreen ----------
      function toggleFullscreen() {
        if (!document.fullscreenElement) {
          sliderWrap.requestFullscreen?.().catch((err) => {
            console.warn("Fullscreen failed:", err);
          });
        } else {
          document.exitFullscreen?.();
        }
      }
      document.addEventListener("fullscreenchange", () => {
        fullscreenBtn.classList.toggle("active", !!document.fullscreenElement);
      });

      // ---------- Swipe support ----------
      sliderWrap.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      sliderWrap.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          diff > 0 ? next() : prev();
        }
      }, { passive: true });

      // ---------- Events ----------
      prevBtn.addEventListener("click", prev);
      nextBtn.addEventListener("click", next);
      autoplayBtn.addEventListener("click", toggleAutoplay);
      speedBtn.addEventListener("click", cycleSpeed);
      fullscreenBtn.addEventListener("click", toggleFullscreen);

      // Keyboard
      document.addEventListener("keydown", (e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
        if (e.key === "ArrowLeft")  { e.preventDefault(); prev(); }
        if (e.key === "ArrowRight") { e.preventDefault(); next(); }
        if (e.key === " ")          { e.preventDefault(); toggleAutoplay(); }
      });

      // Pause when tab hidden
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) stopAutoplay();
        else if (autoplay) startAutoplay();
      });

      // ---------- Init ----------
      renderDots();
      goTo(0, true);
      startAutoplay();
    });
  </script>
</body>
</html>