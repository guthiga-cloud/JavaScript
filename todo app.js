<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Day 3 — Todo App</title>
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
      border-radius: 18px;
      padding: 28px;
      width: 100%;
      max-width: 480px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }

    header h1 {
      font-size: 1.5rem;
      margin-bottom: 4px;
    }
    header p {
      color: #94a3b8;
      font-size: 0.9rem;
      margin-bottom: 20px;
    }

    .input-row {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
    }
    .input-row input {
      flex: 1;
      background: #020617;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 12px 14px;
      color: #e2e8f0;
      font-size: 1rem;
      outline: none;
      transition: border 0.2s;
    }
    .input-row input:focus { border-color: #6366f1; }
    .input-row button {
      background: #6366f1;
      border: none;
      color: #fff;
      border-radius: 10px;
      padding: 0 20px;
      font-size: 1.2rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s, transform 0.08s;
    }
    .input-row button:hover  { background: #4f46e5; }
    .input-row button:active { transform: scale(0.95); }

    .filters {
      display: flex;
      gap: 6px;
      margin-bottom: 16px;
    }
    .filters button {
      flex: 1;
      background: #020617;
      border: 1px solid #1e293b;
      color: #94a3b8;
      padding: 8px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.15s;
    }
    .filters button:hover { color: #e2e8f0; }
    .filters button.active {
      background: #1e3a8a;
      border-color: #1e3a8a;
      color: #93c5fd;
    }

    ul {
      list-style: none;
      max-height: 400px;
      overflow-y: auto;
      margin-bottom: 16px;
    }
    ul::-webkit-scrollbar { width: 6px; }
    ul::-webkit-scrollbar-thumb {
      background: #334155;
      border-radius: 3px;
    }

    li {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #020617;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 12px 14px;
      margin-bottom: 8px;
      transition: opacity 0.2s, transform 0.15s;
    }
    li.done { opacity: 0.55; }
    li.done .text { text-decoration: line-through; color: #94a3b8; }

    li input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: #10b981;
      cursor: pointer;
      flex-shrink: 0;
    }

    .text {
      flex: 1;
      font-size: 0.98rem;
      word-break: break-word;
    }

    .delete-btn {
      background: none;
      border: none;
      color: #ef4444;
      font-size: 1.3rem;
      cursor: pointer;
      padding: 0 4px;
      opacity: 0.5;
      transition: opacity 0.15s;
    }
    .delete-btn:hover { opacity: 1; }

    .empty {
      text-align: center;
      color: #64748b;
      padding: 30px 0;
      font-size: 0.9rem;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
      color: #94a3b8;
      border-top: 1px solid #1e293b;
      padding-top: 14px;
    }
    .footer button {
      background: none;
      border: none;
      color: #ef4444;
      cursor: pointer;
      font-size: 0.85rem;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <main class="app">
    <header>
      <h1>📝 Todo App</h1>
      <p>Day 3 — Tasks saved to localStorage.</p>
    </header>

    <div class="input-row">
      <input
        type="text"
        id="taskInput"
        placeholder="What needs to be done?"
        maxlength="120"
        autocomplete="off"
      />
      <button id="addBtn" title="Add task">+</button>
    </div>

    <div class="filters">
      <button data-filter="all"    class="active">All</button>
      <button data-filter="active">Active</button>
      <button data-filter="done">Done</button>
    </div>

    <ul id="taskList"></ul>

    <div class="footer">
      <span id="counter">0 tasks</span>
      <button id="clearDone">Clear completed</button>
    </div>
  </main>

  <script>
    // ============================================
    // DAY 3 — Todo App with localStorage
    // ============================================
    document.addEventListener("DOMContentLoaded", () => {
      const STORAGE_KEY = "js-todo-day3";

      const input     = document.getElementById("taskInput");
      const addBtn    = document.getElementById("addBtn");
      const listEl    = document.getElementById("taskList");
      const counterEl = document.getElementById("counter");
      const clearBtn  = document.getElementById("clearDone");
      const filterBtns = document.querySelectorAll(".filters button");

      let tasks = loadTasks();
      let filter = "all";

      // ---------- Storage ----------
      function loadTasks() {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (!raw) return [];
          const parsed = JSON.parse(raw);
          if (!Array.isArray(parsed)) {
            console.warn("Saved tasks are not in the expected format.");
            return [];
          }
          return parsed.filter(task =>
            task &&
            typeof task.id === "string" &&
            typeof task.text === "string" &&
            task.text.trim() !== "" &&
            typeof task.done === "boolean"
          );
        } catch (e) {
          console.warn("Could not load saved tasks:", e);
          return [];
        }
      }

      function saveTasks() {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (e) {
          console.warn("Could not save tasks:", e);
        }
      }

      // ---------- Rendering ----------
      function visibleTasks() {
        if (filter === "active") return tasks.filter(t => !t.done);
        if (filter === "done")   return tasks.filter(t =>  t.done);
        return tasks;
      }

      function render() {
        listEl.innerHTML = "";

        const visible = visibleTasks();

        if (visible.length === 0) {
          const empty = document.createElement("li");
          empty.className = "empty";
          empty.textContent =
            filter === "all"    ? "No tasks yet. Add one above ✍️" :
            filter === "active" ? "No active tasks 🎉" :
                                  "No completed tasks.";
          listEl.appendChild(empty);
        } else {
          visible.forEach((task) => {
            const li = document.createElement("li");
            if (task.done) li.classList.add("done");

            const cb = document.createElement("input");
            cb.type = "checkbox";
            cb.checked = task.done;
            cb.addEventListener("change", () => toggleTask(task.id));

            const span = document.createElement("span");
            span.className = "text";
            span.textContent = task.text;

            const del = document.createElement("button");
            del.className = "delete-btn";
            del.title = "Delete";
            del.textContent = "×";
            del.addEventListener("click", () => deleteTask(task.id));

            li.appendChild(cb);
            li.appendChild(span);
            li.appendChild(del);
            listEl.appendChild(li);
          });
        }

        const total = tasks.length;
        const done  = tasks.filter(t => t.done).length;
        counterEl.textContent = `${total} task${total === 1 ? "" : "s"} · ${done} done`;
      }

      // ---------- Actions ----------
      function addTask() {
        const text = input.value.trim();
        if (!text) return;
        tasks.unshift({
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          text,
          done: false,
          createdAt: Date.now(),
        });
        input.value = "";
        saveTasks();
        render();
        input.focus();
      }

      function toggleTask(id) {
        const t = tasks.find(t => t.id === id);
        if (t) {
          t.done = !t.done;
          saveTasks();
          render();
        }
      }

      function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        render();
      }

      function clearDone() {
        const doneCount = tasks.filter(t => t.done).length;
        if (doneCount === 0) return;
        if (!confirm(`Delete ${doneCount} completed task${doneCount === 1 ? "" : "s"}?`)) return;
        tasks = tasks.filter(t => !t.done);
        saveTasks();
        render();
      }

      function setFilter(f) {
        filter = f;
        filterBtns.forEach(b =>
          b.classList.toggle("active", b.dataset.filter === f)
        );
        render();
      }

      // ---------- Events ----------
      addBtn.addEventListener("click", addTask);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") addTask();
      });
      clearBtn.addEventListener("click", clearDone);
      filterBtns.forEach((b) =>
        b.addEventListener("click", () => setFilter(b.dataset.filter))
      );

      // initial paint
      render();
      input.focus();
    });
  </script>
</body>
</html>