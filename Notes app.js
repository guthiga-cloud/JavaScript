<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Day 18 — Notes App</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a, #1e293b);
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      color: #e2e8f0;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 20px;
    }

    .app {
      background: #0b1220;
      border: 1px solid #1e293b;
      border-radius: 20px;
      width: 100%;
      max-width: 960px;
      height: 90vh;
      max-height: 700px;
      display: flex;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
    }

    /* ---------- Sidebar ---------- */
    .sidebar {
      width: 260px;
      border-right: 1px solid #1e293b;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }

    .sidebar-header {
      padding: 16px;
      border-bottom: 1px solid #1e293b;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .sidebar-header h1 {
      font-size: 1.05rem;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .new-btn {
      background: #6366f1;
      border: none;
      color: #fff;
      width: 30px;
      height: 30px;
      border-radius: 8px;
      font-size: 1.1rem;
      cursor: pointer;
      transition: background 0.15s, transform 0.08s;
    }
    .new-btn:hover  { background: #4f46e5; }
    .new-btn:active { transform: scale(0.94); }

    .search-wrap {
      padding: 12px 16px;
      border-bottom: 1px solid #1e293b;
    }
    .search-wrap input {
      width: 100%;
      background: #020617;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 8px 12px;
      color: #e2e8f0;
      font-size: 0.85rem;
      outline: none;
      font-family: inherit;
      transition: border 0.15s;
    }
    .search-wrap input:focus { border-color: #6366f1; }

    .note-list {
      flex: 1;
      overflow-y: auto;
      padding: 6px 0;
    }
    .note-list::-webkit-scrollbar { width: 6px; }
    .note-list::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }

    .note-item {
      padding: 12px 16px;
      cursor: pointer;
      border-left: 3px solid transparent;
      transition: background 0.15s, border-color 0.15s;
    }
    .note-item:hover { background: #0f172a; }
    .note-item.active {
      background: #0f172a;
      border-left-color: #6366f1;
    }

    .note-item-title {
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .note-item-preview {
      font-size: 0.75rem;
      color: #64748b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .note-item-date {
      font-size: 0.65rem;
      color: #475569;
      margin-top: 4px;
    }

    .empty-list {
      padding: 20px;
      text-align: center;
      color: #475569;
      font-size: 0.82rem;
    }

    /* ---------- Editor ---------- */
    .editor {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .editor-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 20px;
      border-bottom: 1px solid #1e293b;
    }
    .editor-toolbar span {
      font-size: 0.75rem;
      color: #64748b;
      font-family: "Courier New", monospace;
    }
    .toolbar-actions {
      display: flex;
      gap: 6px;
    }
    .tool-btn {
      background: #1e293b;
      border: none;
      color: #e2e8f0;
      padding: 7px 12px;
      border-radius: 7px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s, transform 0.08s;
      font-family: inherit;
    }
    .tool-btn:hover  { background: #334155; }
    .tool-btn:active { transform: scale(0.96); }
    .tool-btn.danger:hover { background: #7f1d1d; color: #fca5a5; }

    .note-title {
      background: transparent;
      border: none;
      color: #e2e8f0;
      font-size: 1.5rem;
      font-weight: 700;
      padding: 20px 24px 8px;
      outline: none;
      font-family: inherit;
      width: 100%;
    }
    .note-title::placeholder { color: #475569; }

    .note-body {
      flex: 1;
      background: transparent;
      border: none;
      color: #cbd5e1;
      font-size: 0.95rem;
      line-height: 1.7;
      padding: 8px 24px 20px;
      outline: none;
      resize: none;
      font-family: inherit;
      width: 100%;
    }
    .note-body::placeholder { color: #475569; }

    .editor-empty {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #475569;
      text-align: center;
      padding: 40px;
    }
    .editor-empty .emoji { font-size: 3rem; margin-bottom: 12px; opacity: 0.5; }
    .editor-empty p { font-size: 0.9rem; line-height: 1.6; }
    .editor-empty button {
      background: #6366f1;
      border: none;
      color: #fff;
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 12px;
      font-family: inherit;
    }
    .editor-empty button:hover { background: #4f46e5; }

    /* ---------- Toast ---------- */
    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: #10b981;
      color: #fff;
      padding: 10px 22px;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 600;
      box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
      transition: transform 0.3s ease, opacity 0.3s ease;
      opacity: 0;
      z-index: 100;
    }
    .toast.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }

    /* ---------- Responsive ---------- */
    @media (max-width: 640px) {
      .app { flex-direction: column; height: auto; max-height: none; }
      .sidebar { width: 100%; max-height: 200px; border-right: none; border-bottom: 1px solid #1e293b; }
      .editor { min-height: 400px; }
    }
  </style>
</head>
<body>
  <main class="app">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1>📝 Notes</h1>
        <button class="new-btn" id="newBtn" title="New note">+</button>
      </div>
      <div class="search-wrap">
        <input type="text" id="searchInput" placeholder="🔍 Search notes…" />
      </div>
      <div class="note-list" id="noteList"></div>
    </aside>

    <!-- Editor -->
    <section class="editor" id="editor">
      <div class="editor-empty">
        <div class="emoji">📝</div>
        <p>Select a note on the left,<br />or create a new one.</p>
        <button id="emptyNewBtn">+ New Note</button>
      </div>
    </section>
  </main>

  <div class="toast" id="toast"></div>

  <script>
    // ============================================
    // DAY 18 — Notes App
    // Auto-save, search, create/edit/delete
    // ============================================
    document.addEventListener("DOMContentLoaded", () => {
      const STORAGE_KEY = "js-notes-day18";

      const noteListEl  = document.getElementById("noteList");
      const searchInput = document.getElementById("searchInput");
      const editorEl    = document.getElementById("editor");
      const newBtn      = document.getElementById("newBtn");
      const emptyNewBtn = document.getElementById("emptyNewBtn");
      const toastEl     = document.getElementById("toast");

      let notes     = load();
      let activeId  = null;
      let saveTimer = null;

      // ---------- Storage ----------
      function load() {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          const data = raw ? JSON.parse(raw) : [];
          return Array.isArray(data) ? data : [];
        } catch { return []; }
      }
      function save() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); } catch {}
      }
      function autoSave() {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
          save();
          showToast("✅ Saved");
        }, 500);
      }

      // ---------- Toast ----------
      function showToast(msg) {
        toastEl.textContent = msg;
        toastEl.classList.add("show");
        clearTimeout(showToast._t);
        showToast._t = setTimeout(() => toastEl.classList.remove("show"), 1500);
      }

      // ---------- Helpers ----------
      function fmtDate(ts) {
        const d = new Date(ts);
        const now = new Date();
        const sameDay =
          d.getFullYear() === now.getFullYear() &&
          d.getMonth() === now.getMonth() &&
          d.getDate() === now.getDate();
        return sameDay
          ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : d.toLocaleDateString([], { month: "short", day: "numeric" });
      }

      function uid() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      }

      // ---------- Render sidebar ----------
      function renderList() {
        const query = searchInput.value.trim().toLowerCase();
        const filtered = notes
          .filter((n) =>
            !query ||
            n.title.toLowerCase().includes(query) ||
            n.body.toLowerCase().includes(query)
          )
          .sort((a, b) => b.updatedAt - a.updatedAt);

        noteListEl.innerHTML = "";

        if (filtered.length === 0) {
          noteListEl.innerHTML = `<div class="empty-list">${
            query ? "No matching notes" : "No notes yet. Click + to start."
          }</div>`;
          return;
        }

        for (const n of filtered) {
          const item = document.createElement("div");
          item.className = "note-item" + (n.id === activeId ? " active" : "");
          const title = n.title.trim() || "(Untitled)";
          const preview = n.body.trim().split("\n")[0] || "Empty note";
          item.innerHTML = `
            <div class="note-item-title"></div>
            <div class="note-item-preview"></div>
            <div class="note-item-date">${fmtDate(n.updatedAt)}</div>
          `;
          item.querySelector(".note-item-title").textContent = title;
          item.querySelector(".note-item-preview").textContent = preview;
          item.addEventListener("click", () => openNote(n.id));
          noteListEl.appendChild(item);
        }
      }

      // ---------- Render editor ----------
      function renderEditor() {
        const note = notes.find((n) => n.id === activeId);

        if (!note) {
          editorEl.innerHTML = `
            <div class="editor-empty">
              <div class="emoji">📝</div>
              <p>Select a note on the left,<br />or create a new one.</p>
              <button id="emptyNewBtn">+ New Note</button>
            </div>
          `;
          document.getElementById("emptyNewBtn").addEventListener("click", createNote);
          return;
        }

        editorEl.innerHTML = `
          <div class="editor-toolbar">
            <span id="editorMeta"></span>
            <div class="toolbar-actions">
              <button class="tool-btn danger" id="deleteBtn">🗑 Delete</button>
            </div>
          </div>
          <input
            type="text"
            class="note-title"
            id="noteTitle"
            placeholder="Note title…"
            maxlength="100"
            value=""
          />
          <textarea
            class="note-body"
            id="noteBody"
            placeholder="Start writing…"
          ></textarea>
        `;

        const titleEl = document.getElementById("noteTitle");
        const bodyEl  = document.getElementById("noteBody");
        const metaEl  = document.getElementById("editorMeta");

        titleEl.value = note.title;
        bodyEl.value  = note.body;
        metaEl.textContent = `Updated ${fmtDate(note.updatedAt)}`;

        titleEl.addEventListener("input", () => {
          note.title = titleEl.value;
          note.updatedAt = Date.now();
          metaEl.textContent = `Updated just now`;
          autoSave();
          renderList();
        });

        bodyEl.addEventListener("input", () => {
          note.body = bodyEl.value;
          note.updatedAt = Date.now();
          autoSave();
          renderList();
        });

        // Tab → insert spaces in textarea
        bodyEl.addEventListener("keydown", (e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            const start = bodyEl.selectionStart;
            const end   = bodyEl.selectionEnd;
            const val   = bodyEl.value;
            bodyEl.value = val.slice(0, start) + "  " + val.slice(end);
            bodyEl.selectionStart = bodyEl.selectionEnd = start + 2;
          }
        });

        document.getElementById("deleteBtn").addEventListener("click", () => deleteNote(note.id));

        // Focus title when opening a fresh empty note
        if (!note.title && !note.body) titleEl.focus();
      }

      // ---------- Actions ----------
      function createNote() {
        const note = {
          id: uid(),
          title: "",
          body: "",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        notes.unshift(note);
        save();
        activeId = note.id;
        renderList();
        renderEditor();
        document.getElementById("noteTitle")?.focus();
      }

      function openNote(id) {
        activeId = id;
        renderList();
        renderEditor();
      }

      function deleteNote(id) {
        const note = notes.find((n) => n.id === id);
        if (!note) return;
        const title = note.title.trim() || "(Untitled)";
        if (!confirm(`Delete note "${title}"?`)) return;
        notes = notes.filter((n) => n.id !== id);
        save();
        if (activeId === id) activeId = null;
        renderList();
        renderEditor();
        showToast("🗑 Note deleted");
      }

      // ---------- Events ----------
      newBtn.addEventListener("click", createNote);

      searchInput.addEventListener("input", renderList);

      // Keyboard: Ctrl/Cmd+N → new note
      document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
          e.preventDefault();
          createNote();
        }
      });

      // Ctrl/Cmd+S → force save
      document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
          e.preventDefault();
          save();
          showToast("✅ Saved");
        }
      });

      // ---------- Init ----------
      renderList();
      if (notes.length > 0) {
        activeId = notes.sort((a, b) => b.updatedAt - a.updatedAt)[0].id;
      }
      renderEditor();
    });
  </script>
</body>
</html>