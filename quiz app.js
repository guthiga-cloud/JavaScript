<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Day 4 — Quiz App</title>
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
      border-radius: 18px;
      padding: 32px;
      width: 100%;
      max-width: 540px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }

    h1 { font-size: 1.5rem; margin-bottom: 4px; }
    .sub { color: #94a3b8; font-size: 0.9rem; margin-bottom: 24px; }

    /* ---------- Progress bar ---------- */
    .progress-wrap {
      height: 6px;
      background: #020617;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 8px;
    }
    .progress-bar {
      height: 100%;
      width: 0;
      background: linear-gradient(90deg, #6366f1, #38bdf8);
      transition: width 0.35s ease;
    }
    .progress-text {
      font-size: 0.8rem;
      color: #64748b;
      margin-bottom: 24px;
    }

    /* ---------- Question ---------- */
    .question {
      font-size: 1.15rem;
      font-weight: 600;
      line-height: 1.4;
      margin-bottom: 20px;
      min-height: 3.4rem;
    }

    /* ---------- Answers ---------- */
    .answers {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 20px;
    }
    .answer {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #020617;
      border: 2px solid #1e293b;
      border-radius: 10px;
      padding: 14px 16px;
      font-size: 0.98rem;
      text-align: left;
      color: #e2e8f0;
      cursor: pointer;
      transition: all 0.15s;
      font-family: inherit;
    }
    .answer:hover:not(:disabled) {
      border-color: #6366f1;
      background: #1e1b4b;
    }
    .answer:disabled { cursor: not-allowed; }

    .answer .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: #1e293b;
      font-size: 0.85rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .answer.correct {
      border-color: #10b981;
      background: #064e3b;
    }
    .answer.correct .badge { background: #10b981; color: #fff; }

    .answer.wrong {
      border-color: #ef4444;
      background: #7f1d1d;
    }
    .answer.wrong .badge { background: #ef4444; color: #fff; }

    /* ---------- Next button ---------- */
    .next-btn {
      width: 100%;
      background: #6366f1;
      border: none;
      color: #fff;
      padding: 14px;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s, transform 0.08s;
      font-family: inherit;
    }
    .next-btn:hover  { background: #4f46e5; }
    .next-btn:active { transform: scale(0.98); }
    .next-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    /* ---------- Results ---------- */
    .results { text-align: center; padding: 8px 0; }
    .results h2 { font-size: 1.6rem; margin-bottom: 8px; }
    .results .score {
      font-size: 2.6rem;
      font-weight: 700;
      color: #38bdf8;
      margin: 16px 0;
      font-family: "Courier New", monospace;
    }
    .results .msg {
      color: #94a3b8;
      margin-bottom: 8px;
    }
    .results .high {
      color: #fbbf24;
      font-size: 0.9rem;
      margin-bottom: 24px;
    }

    footer {
      text-align: center;
      margin-top: 20px;
      color: #64748b;
      font-size: 0.8rem;
    }
  </style>
</head>
<body>
  <main class="card" id="app">
    <!-- Rendered by JS -->
  </main>

  <script>
    // ============================================
    //  Quiz App
    // Features: shuffled questions/answers, live
    // feedback, progress bar, persistent high score.
    // ============================================
    document.addEventListener("DOMContentLoaded", () => {
      const STORAGE_KEY = "js-quiz-day4";
      const app = document.getElementById("app");

      // ---------- Question bank ----------
      const QUESTIONS = [
        {
          q: "Which language runs natively in a web browser?",
          a: ["Python", "JavaScript", "C++", "Java"],
          c: 1,
        },
        {
          q: "What does HTML stand for?",
          a: [
            "HyperText Markup Language",
            "HighText Machine Language",
            "HyperTool Multi Language",
            "Home Tool Markup Language",
          ],
          c: 0,
        },
        {
          q: "Which keyword declares a constant in modern JS?",
          a: ["var", "let", "const", "static"],
          c: 2,
        },
        {
          q: "What does `DOM` stand for?",
          a: [
            "Document Object Model",
            "Data Object Method",
            "Display Oriented Mode",
            "Dynamic Output Map",
          ],
          c: 0,
        },
        {
          q: "Which method adds an item to the end of an array?",
          a: ["push()", "pop()", "shift()", "unshift()"],
          c: 0,
        },
        {
          q: "What is the result of `typeof null` in JavaScript?",
          a: ["\"null\"", "\"undefined\"", "\"object\"", "\"number\""],
          c: 2,
        },
        {
          q: "Which operator checks strict equality?",
          a: ["==", "===", "=", "!="],
          c: 1,
        },
        {
          q: "How do you write a single-line comment in JS?",
          a: ["<!-- -->", "#", "//", "/* */"],
          c: 2,
        },
      ];

      // ---------- State ----------
      let quiz = [];
      let current = 0;
      let score = 0;
      let locked = false; // prevent double-click after answering
      let highScore = loadHighScore();

      // ---------- Storage ----------
      function loadHighScore() {
        try {
          const v = parseInt(localStorage.getItem(STORAGE_KEY), 10);
          return isNaN(v) ? 0 : v;
        } catch {
          return 0;
        }
      }
      function saveHighScore(v) {
        try {
          localStorage.setItem(STORAGE_KEY, String(v));
        } catch {}
      }

      // ---------- Helpers ----------
      function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      }

      function prepareQuiz() {
        // shuffle questions AND answers while tracking the correct index
        quiz = shuffle(QUESTIONS).map((item) => {
          const pairs = item.a.map((text, i) => ({ text, correct: i === item.c }));
          const shuffled = shuffle(pairs);
          return {
            q: item.q,
            answers: shuffled.map((p) => p.text),
            correctIndex: shuffled.findIndex((p) => p.correct),
          };
        });
        current = 0;
        score = 0;
        locked = false;
      }

      // ---------- Render: Start ----------
      function renderStart() {
        app.innerHTML = `
          <h1>🧠 Quiz App</h1>
          <p class="sub">Day 4 — ${QUESTIONS.length} questions. Good luck!</p>
          <div class="results">
            <p class="msg">Your best score so far</p>
            <div class="score">${highScore} / ${QUESTIONS.length}</div>
            <button class="next-btn" id="startBtn">Start Quiz →</button>
          </div>
          <footer>Day 4 of my JavaScript challenge 🚀</footer>
        `;
        document.getElementById("startBtn").addEventListener("click", () => {
          prepareQuiz();
          renderQuestion();
        });
      }

      // ---------- Render: Question ----------
      function renderQuestion() {
        locked = false;
        const item = quiz[current];
        const pct = (current / quiz.length) * 100;

        app.innerHTML = `
          <h1>🧠 Quiz App</h1>
          <p class="sub">Question ${current + 1} of ${quiz.length}</p>

          <div class="progress-wrap">
            <div class="progress-bar" style="width:${pct}%"></div>
          </div>
          <div class="progress-text">Score: ${score} / ${quiz.length}</div>

          <div class="question">${item.q}</div>

          <div class="answers" id="answers"></div>

          <button class="next-btn" id="nextBtn" disabled>
            ${current === quiz.length - 1 ? "See Results →" : "Next →"}
          </button>

          <footer>Day 4 of my JavaScript challenge 🚀</footer>
        `;

        const answersEl = document.getElementById("answers");
        const letters = ["A", "B", "C", "D"];

        item.answers.forEach((text, i) => {
          const btn = document.createElement("button");
          btn.className = "answer";
          btn.innerHTML = `
            <span class="badge">${letters[i]}</span>
            <span>${text}</span>
          `;
          btn.addEventListener("click", () => chooseAnswer(i, btn));
          answersEl.appendChild(btn);
        });

        document.getElementById("nextBtn").addEventListener("click", () => {
          current++;
          if (current < quiz.length) renderQuestion();
          else renderResults();
        });
      }

      // ---------- Answer click ----------
      function chooseAnswer(index, btn) {
        if (locked) return;
        locked = true;

        const item = quiz[current];
        const answerButtons = document.querySelectorAll(".answer");
        answerButtons.forEach((b) => (b.disabled = true));

        if (index === item.correctIndex) {
          btn.classList.add("correct");
          score++;
        } else {
          btn.classList.add("wrong");
          answerButtons[item.correctIndex].classList.add("correct");
        }

        document.getElementById("nextBtn").disabled = false;
      }

      // ---------- Render: Results ----------
      function renderResults() {
        const pct = Math.round((score / quiz.length) * 100);
        const isNewHigh = score > highScore;
        if (isNewHigh) {
          highScore = score;
          saveHighScore(score);
        }

        let msg = "Keep practicing! 💪";
        if (pct >= 90) msg = "Outstanding! 🏆";
        else if (pct >= 70) msg = "Great job! 🎉";
        else if (pct >= 50) msg = "Not bad! 👍";

        app.innerHTML = `
          <h1>🧠 Quiz App</h1>
          <p class="sub">Quiz complete!</p>

          <div class="results">
            <h2>${msg}</h2>
            <div class="score">${score} / ${quiz.length}</div>
            <p class="msg">${pct}% correct</p>
            <p class="high">
              ${isNewHigh ? "🎉 NEW HIGH SCORE!" : `Best: ${highScore} / ${quiz.length}`}
            </p>
            <button class="next-btn" id="againBtn">Play Again 🔄</button>
          </div>

          <footer>Day 4 of my JavaScript challenge 🚀</footer>
        `;

        document.getElementById("againBtn").addEventListener("click", () => {
          renderStart();
        });
      }

      // ---------- Init ----------
      renderStart();
    });
  </script>
</body>
</html>