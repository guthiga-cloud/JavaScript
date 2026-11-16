<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Day 10 — Expense Tracker</title>
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
      padding: 28px;
      width: 100%;
      max-width: 540px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
    }

    h1 { font-size: 1.4rem; margin-bottom: 4px; }
    .sub { color: #94a3b8; font-size: 0.85rem; margin-bottom: 24px; }

    /* ---------- Balance card ---------- */
    .balance {
      background: linear-gradient(135deg, #1e1b4b, #312e81);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 20px;
      position: relative;
      overflow: hidden;
    }
    .balance::after {
      content: "💰";
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 3.5rem;
      opacity: 0.25;
    }
    .balance-label {
      font-size: 0.78rem;
      color: #a5b4fc;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 6px;
    }
    .balance-amount {
      font-size: 2.2rem;
      font-weight: 700;
      font-family: "Courier New", monospace;
      color: #fff;
    }
    .balance-amount.negative { color: #fca5a5; }
    .balance-sub {
      font-size: 0.85rem;
      color: #c7d2fe;
      margin-top: 8px;
    }

    /* ---------- Form ---------- */
    .form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 16px;
    }
    .form input,
    .form select {
      background: #020617;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 12px 14px;
      color: #e2e8f0;
      font-size: 0.95rem;
      outline: none;
      font-family: inherit;
      transition: border 0.15s;
    }
    .form input:focus,
    .form select:focus { border-color: #6366f1; }

    .form input[type="text"] { grid-column: span 2; }
    .form select { cursor: pointer; }

    .form button {
      grid-column: span 2;
      background: #6366f1;
      border: none;
      color: #fff;
      padding: 13px;
      border-radius: 10px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s, transform 0.08s;
      font-family: inherit;
    }
    .form button:hover  { background: #4f46e5; }
    .form button:active { transform: scale(0.98); }

    /* ---------- Filters ---------- */
    .filters {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }
    .filter-chip {
      background: #020617;
      border: 1px solid #1e293b;
      color: #94a3b8;
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 0.78rem;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s;
    }
    .filter-chip:hover { color: #e2e8f0; }
    .filter-chip.active {
      background: #1e3a8a;
      border-color: #1e3a8a;
      color: #93c5fd;
    }

    /* ---------- List ---------- */
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.78rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
      padding: 0 4px;
    }
    .list-header button {
      background: none;
      border: none;
      color: #ef4444;
      font-size: 0.78rem;
      cursor: pointer;
      text-decoration: underline;
      font-family: inherit;
    }

    ul { list-style: none; }

    li.expense {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #020617;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 12px 14px;
      margin-bottom: 8px;
      transition: transform 0.15s, border-color 0.15s;
      animation: slideIn 0.25s ease;
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-10px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    .expense-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      flex-shrink: 0;
    }

    .expense-info { flex: 1; min-width: 0; }
    .expense-name {
      font-size: 0.95rem;
      font-weight: 600;
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .expense-cat {
      font-size: 0.75rem;
      color: #64748b;
    }

    .expense-amount {
      font-family: "Courier New", monospace;
      font-weight: 700;
      font-size: 1rem;
      color: #f87171;
      flex-shrink: 0;
    }

    .delete-btn {
      background: none;
      border: none;
      color: #64748b;
      font-size: 1.3rem;
      cursor: pointer;
      padding: 0 4px;
      transition: color 0.15s;
      flex-shrink: 0;
    }
    .delete-btn:hover { color: #ef4444; }

    .empty {
      text-align: center;
      color: #64748b;
      padding: 30px 0;
      font-size: 0.9rem;
    }

    /* ---------- Toast ---------- */
    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      padding: 12px 24px;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      color: #fff;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
      transition: transform 0.3s ease, opacity 0.3s ease;
      opacity: 0;
      z-index: 100;
    }
    .toast.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
    .toast.success { background: #10b981; }
    .toast.error   { background: #ef4444; }

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
    <h1>💰 Expense Tracker</h1>
    <p class="sub">Day 10 — Track spending with categories + filters</p>

    <!-- Balance -->
    <div class="balance">
      <div class="balance-label">Total Spent</div>
      <div class="balance-amount" id="total">$0.00</div>
      <div class="balance-sub" id="count">0 expense</div>
    </div>

    <!-- Add form -->
    <div class="form">
      <input type="text"   id="descInput"  placeholder="Description (e.g. Lunch)" maxlength="60" />
      <input type="number" id="amtInput"   placeholder="Amount" min="0.01" step="0.01" />
      <select id="catInput">
        <option value="Food">🍔 Food</option>
        <option value="Transport">🚗 Transport</option>
        <option value="Shopping">🛍️ Shopping</option>
        <option value="Bills">💡 Bills</option>
        <option value="Entertainment">🎬 Entertainment</option>
        <option value="Health">💊 Health</option>
        <option value="Other">📦 Other</option>
      </select>
      <button id="addBtn">➕ Add Expense</button>
    </div>

    <!-- Filters -->
    <div class="filters" id="filters"></div>

    <!-- List -->
    <div class="list-header">
      <span id="listTitle">All expenses</span>
      <button id="clearAll">Clear all</button>
    </div>
    <ul id="list"></ul>

    <footer>Day 10 of my JavaScript challenge 🚀</footer>
  </main>

  <div class="toast" id="toast"></div>

  <script>
    // ============================================
    // DAY 10 — Expense Tracker
    // Full CRUD + category filters + localStorage.
    // ============================================
    document.addEventListener("DOMContentLoaded", () => {
      const STORAGE_KEY = "js-expenses-day10";

      const CAT_META = {
        Food:          { emoji: "🍔", color: "#f97316" },
        Transport:     { emoji: "🚗", color: "#3b82f6" },
        Shopping:      { emoji: "🛍️", color: "#ec4899" },
        Bills:         { emoji: "💡", color: "#eab308" },
        Entertainment: { emoji: "🎬", color: "#a855f7" },
        Health:        { emoji: "💊", color: "#10b981" },
        Other:         { emoji: "📦", color: "#64748b" },
      };

      const descInput  = document.getElementById("descInput");
      const amtInput   = document.getElementById("amtInput");
      const catInput   = document.getElementById("catInput");
      const addBtn     = document.getElementById("addBtn");
      const totalEl    = document.getElementById("total");
      const countEl    = document.getElementById("count");
      const filtersEl  = document.getElementById("filters");
      const listTitle  = document.getElementById("listTitle");
      const listEl     = document.getElementById("list");
      const clearAllBtn= document.getElementById("clearAll");
      const toast      = document.getElementById("toast");

      let expenses = load();
      let filter   = "All";

      // ---------- Storage ----------
      function load() {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          const data = raw ? JSON.parse(raw) : [];
          return Array.isArray(data) ? data : [];
        } catch { return []; }
      }
      function save() {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
        } catch {}
      }

      // ---------- Toast ----------
      function showToast(msg, kind = "success") {
        toast.textContent = msg;
        toast.className = "toast " + kind + " show";
        clearTimeout(showToast._t);
        showToast._t = setTimeout(() => toast.classList.remove("show"), 2000);
      }

      // ---------- Render ----------
      function renderFilters() {
        const cats = ["All", ...Object.keys(CAT_META)];
        filtersEl.innerHTML = cats
          .map((c) => {
            const label = c === "All" ? "All" : `${CAT_META[c].emoji} ${c}`;
            return `<button class="filter-chip ${filter === c ? "active" : ""}" data-cat="${c}">${label}</button>`;
          })
          .join("");

        filtersEl.querySelectorAll(".filter-chip").forEach((chip) => {
          chip.addEventListener("click", () => {
            filter = chip.dataset.cat;
            render();
          });
        });
      }

      function render() {
        renderFilters();

        const visible =
          filter === "All" ? expenses : expenses.filter((e) => e.category === filter);

        // Total of VISIBLE list
        const visibleTotal = visible.reduce((s, e) => s + e.amount, 0);

        totalEl.textContent = "$" + visibleTotal.toFixed(2);
        totalEl.classList.toggle("negative", visibleTotal < 0);

        const n = expenses.length;
        countEl.textContent =
          n === 0
            ? "No expenses yet"
            : `${n} expense${n === 1 ? "" : "s"} · ${filter === "All" ? "all" : filter.toLowerCase()}`;

        listTitle.textContent =
          filter === "All" ? "All expenses" : `${CAT_META[filter]?.emoji || ""} ${filter}`;

        // List
        if (visible.length === 0) {
          listEl.innerHTML = `<div class="empty">${
            filter === "All" ? "Add your first expense above ☝️" : "No expenses in this category."
          }</div>`;
          return;
        }

        listEl.innerHTML = "";
        visible.forEach((e) => {
          const meta = CAT_META[e.category] || { emoji: "📦", color: "#64748b" };

          const li = document.createElement("li");
          li.className = "expense";
          li.innerHTML = `
            <div class="expense-icon" style="background:${meta.color}22; color:${meta.color}">
              ${meta.emoji}
            </div>
            <div class="expense-info">
              <div class="expense-name"></div>
              <div class="expense-cat">${e.category}</div>
            </div>
            <div class="expense-amount">-$${e.amount.toFixed(2)}</div>
            <button class="delete-btn" title="Delete">×</button>
          `;
          li.querySelector(".expense-name").textContent = e.desc;
          li.querySelector(".delete-btn").addEventListener("click", () => deleteExpense(e.id));
          listEl.appendChild(li);
        });
      }

      // ---------- Actions ----------
      function addExpense() {
        const desc = descInput.value.trim();
        const amt  = parseFloat(amtInput.value);
        const cat  = catInput.value;

        if (!desc) {
          showToast("❌ Description is required", "error");
          descInput.focus();
          return;
        }
        if (!amt || isNaN(amt) || amt <= 0) {
          showToast("❌ Amount must be a positive number", "error");
          amtInput.focus();
          return;
        }
        if (amt > 1e9) {
          showToast("❌ Amount is too large", "error");
          return;
        }

        expenses.unshift({
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          desc,
          amount: Math.round(amt * 100) / 100,
          category: cat,
          createdAt: Date.now(),
        });
        save();

        descInput.value = "";
        amtInput.value  = "";
        descInput.focus();

        showToast(`✅ Added ${desc} ($${amt.toFixed(2)})`);
        render();
      }

      function deleteExpense(id) {
        expenses = expenses.filter((e) => e.id !== id);
        save();
        render();
        showToast("🗑️ Expense deleted");
      }

      function clearAll() {
        if (expenses.length === 0) return;
        if (!confirm(`Delete ALL ${expenses.length} expense(s)? This cannot be undone.`)) return;
        expenses = [];
        save();
        render();
        showToast("🧹 All expenses cleared");
      }

      // ---------- Events ----------
      addBtn.addEventListener("click", addExpense);

      // Enter in description → jump to amount
      descInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          amtInput.focus();
        }
      });
      // Enter in amount → add
      amtInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addExpense();
        }
      });

      clearAllBtn.addEventListener("click", clearAll);

      // ---------- Init ----------
      render();
      descInput.focus();
    });
  </script>
</body>
</html>