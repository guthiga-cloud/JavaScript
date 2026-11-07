<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Day 2 — Calculator</title>
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

    .calculator {
      background: #0b1220;
      border: 1px solid #1e293b;
      border-radius: 20px;
      padding: 24px;
      width: 340px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
    }

    .title {
      text-align: center;
      font-size: 0.95rem;
      color: #94a3b8;
      margin-bottom: 16px;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .display {
      background: #020617;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      text-align: right;
      min-height: 90px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    .history {
      font-size: 0.85rem;
      color: #64748b;
      min-height: 20px;
      word-wrap: break-word;
    }

    .screen {
      font-size: 2.4rem;
      font-weight: 600;
      color: #38bdf8;
      word-wrap: break-word;
      overflow-wrap: anywhere;
      font-family: "Courier New", monospace;
    }

    .buttons {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }

    button {
      background: #1e293b;
      color: #e2e8f0;
      border: none;
      border-radius: 12px;
      padding: 18px 0;
      font-size: 1.25rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s, transform 0.08s;
      user-select: none;
    }
    button:hover  { background: #334155; }
    button:active { transform: scale(0.95); }

    .op    { background: #1e3a8a; color: #93c5fd; }
    .op:hover { background: #1e40af; }

    .equals { background: #6366f1; color: #fff; grid-row: span 2; }
    .equals:hover { background: #4f46e5; }

    .clear  { background: #7f1d1d; color: #fca5a5; }
    .clear:hover { background: #991b1b; }

    .wide { grid-column: span 2; }

    footer {
      text-align: center;
      color: #64748b;
      font-size: 0.8rem;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <main class="calculator">
    <div class="title">Day 2 · Calculator 🧮</div>

    <div class="display">
      <div class="history" id="history"></div>
      <div class="screen"   id="screen">0</div>
    </div>

    <div class="buttons">
      <button class="clear" data-action="clear">AC</button>
      <button class="op"    data-action="sign">±</button>
      <button class="op"    data-action="percent">%</button>
      <button class="op"    data-op="÷">÷</button>

      <button data-num="7">7</button>
      <button data-num="8">8</button>
      <button data-num="9">9</button>
      <button class="op" data-op="×">×</button>

      <button data-num="4">4</button>
      <button data-num="5">5</button>
      <button data-num="6">6</button>
      <button class="op" data-op="−">−</button>

      <button data-num="1">1</button>
      <button data-num="2">2</button>
      <button data-num="3">3</button>
      <button class="op" data-op="+">+</button>

      <button class="wide" data-num="0">0</button>
      <button data-num=".">.</button>
      <button class="equals" data-action="equals">=</button>
    </div>

    <footer>Day 2 of my JavaScript challenge 🚀</footer>
  </main>

  <script>
    // ============================================
    // DAY 2 — Calculator
    // Vanilla JS, keyboard support included.
    // ============================================
    document.addEventListener("DOMContentLoaded", () => {
      const screenEl  = document.getElementById("screen");
      const historyEl = document.getElementById("history");
      const buttons   = document.querySelectorAll("button");

      let currentInput = "0";   // what's typed right now
      let previousValue = null; // stored left-hand value
      let operator = null;      // pending operator
      let justEvaluated = false;
      let enteredCurrentInput = false;

      const OP_MAP = { "+": "+", "−": "-", "×": "*", "÷": "/" };

      // ---------- Render ----------
      function render() {
        screenEl.textContent = currentInput;
      }

      function renderHistory() {
        if (previousValue !== null && operator !== null) {
          historyEl.textContent = `${previousValue} ${operator}`;
        } else {
          historyEl.textContent = "";
        }
      }

      // ---------- Core actions ----------
      function inputDigit(d) {
        if (justEvaluated) {
          currentInput = "0";
          justEvaluated = false;
        }
        currentInput = currentInput === "0" ? d : currentInput + d;
        enteredCurrentInput = true;
        render();
      }

      function inputDot() {
        if (justEvaluated) {
          currentInput = "0";
          justEvaluated = false;
        }
        if (!currentInput.includes(".")) {
          currentInput += ".";
          enteredCurrentInput = true;
          render();
        }
      }

      function clearAll() {
        currentInput = "0";
        previousValue = null;
        operator = null;
        justEvaluated = false;
        enteredCurrentInput = false;
        render();
        renderHistory();
      }

      function toggleSign() {
        if (currentInput === "0" || currentInput === "Error") return;
        currentInput = currentInput.startsWith("-")
          ? currentInput.slice(1)
          : "-" + currentInput;
        render();
      }

      function percent() {
        const v = parseFloat(currentInput);
        if (Number.isFinite(v)) {
          currentInput = String(v / 100);
          enteredCurrentInput = true;
          render();
        }
      }

      function setOperator(op) {
        if (operator !== null && previousValue !== null) {
          if (!enteredCurrentInput) {
            operator = op;
            renderHistory();
            return;
          }
          evaluate();
        }
        previousValue = parseFloat(currentInput);
        if (!Number.isFinite(previousValue)) return;
        operator = op;
        justEvaluated = false;
        currentInput = "0";
        enteredCurrentInput = false;
        renderHistory();
        render();
      }

      function evaluate() {
        if (operator === null || previousValue === null) return;

        const a = previousValue;
        const b = parseFloat(currentInput);
        if (!Number.isFinite(a) || !Number.isFinite(b)) return;

        const op = OP_MAP[operator];
        let result;
        switch (op) {
          case "+": result = a + b; break;
          case "-": result = a - b; break;
          case "*": result = a * b; break;
          case "/":
            if (b === 0) {
              currentInput = "Error";
              operator = null;
              previousValue = null;
              justEvaluated = true;
              enteredCurrentInput = false;
              render();
              historyEl.textContent = "";
              return;
            }
            result = a / b;
            break;
          default: return;
        }

        if (!Number.isFinite(result)) {
          currentInput = "Error";
          operator = null;
          previousValue = null;
          justEvaluated = true;
          enteredCurrentInput = false;
          render();
          historyEl.textContent = "";
          return;
        }

        // Round to 12 significant digits to avoid floating-point artifacts.
        result = Number(result.toPrecision(12));

        historyEl.textContent = `${a} ${operator} ${b} =`;
        currentInput = String(result);
        operator = null;
        previousValue = null;
        justEvaluated = true;
        enteredCurrentInput = false;
        render();
      }

      // ---------- Button clicks ----------
      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const num = btn.dataset.num;
          const op  = btn.dataset.op;
          const act = btn.dataset.action;

          if (num !== undefined) {
            if (num === ".") inputDot();
            else inputDigit(num);
          } else if (op !== undefined) {
            setOperator(op);
          } else if (act === "clear") {
            clearAll();
          } else if (act === "sign") {
            toggleSign();
          } else if (act === "percent") {
            percent();
          } else if (act === "equals") {
            evaluate();
          }
        });
      });

      // ---------- Keyboard support ----------
      document.addEventListener("keydown", (e) => {
        const k = e.key;
        if (k >= "0" && k <= "9") inputDigit(k);
        else if (k === ".") inputDot();
        else if (k === "+") setOperator("+");
        else if (k === "-") setOperator("−");
        else if (k === "*") setOperator("×");
        else if (k === "/") { e.preventDefault(); setOperator("÷"); }
        else if (k === "Enter" || k === "=") { e.preventDefault(); evaluate(); }
        else if (k === "Escape") clearAll();
        else if (k === "Backspace") {
          currentInput = currentInput !== "Error" && currentInput.length > 1
            ? currentInput.slice(0, -1)
            : "0";
          justEvaluated = false;
          enteredCurrentInput = currentInput !== "0";
          render();
        }
      });

      render();
    });
  </script>
</body>
</html>