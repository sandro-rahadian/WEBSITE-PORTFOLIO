// ==UserScript==
// @name         21st.dev Prompt Grabber (self-serve)
// @namespace    local.21st-dev-prompt-grabber
// @version      1.0.0
// @description  Copy the AI "copy prompt" from any 21st.dev page you are logged into, and keep a local history you can re-copy from. Reads only what the page already renders for your own account.
// @match        https://21st.dev/*
// @match        https://*.21st.dev/*
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

/*
  WHY THIS EXISTS
  --------------
  The `copyPrompt` for a 21st AI generation is NOT in any public page or public
  CDN file (verified: 0 occurrences of "copyPrompt" in a component page's RSC
  payload; the only "prompt" string there is `prompt_copy_count`, an analytics
  counter). It is produced server-side for generations you own and rendered by
  the studio UI in your own authenticated session.

  So the only place it can be read without stealing an API key or session token
  is the page you are already logged into. That is what this does: it reads the
  prompt out of the DOM the app already renders, and nothing else.

  HONESTY NOTE
  ------------
  I could not inspect the authenticated studio DOM, so the selectors are
  best-effort and generic rather than exact. The panel therefore DIAGNOSES itself:
  it tells you what it found and what it could not, so one round of refinement can
  pin it down. It never fabricates a prompt, and it never falls back to guessing.

  STRATEGIES, in order
    1. explicit  - an element whose label/heading/attribute mentions "prompt"
    2. container - the largest multi-line text block near a "prompt" cue
    3. shaped    - any textarea / pre / code / [contenteditable] that looks like
                   an instruction prompt (multi-line, long, imperative voice)
    4. manual    - you select the text yourself, then press the hotkey
*/

(function () {
  "use strict";

  const HOTKEY = { key: "p", alt: true, shift: true }; // Alt+Shift+P
  const MIN_PROMPT_CHARS = 120;
  const MAX_PROMPT_CHARS = 200000;

  /* ------------------------------------------------------------ pure helpers */

  const CUES = [
    "copy prompt", "copyPrompt", "prompt", "spec", "instruction",
    "design brief", "rebuild", "paste-ready", "paste ready",
  ];

  function normalize(text) {
    return String(text || "")
      .replace(/\r\n?/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function hasCue(text) {
    const t = String(text || "").toLowerCase();
    return CUES.some((c) => t.includes(c));
  }

  // How much does this blob look like a written instruction prompt?
  function scoreCandidate(text) {
    const t = normalize(text);
    if (!t) return 0;
    if (t.length < MIN_PROMPT_CHARS || t.length > MAX_PROMPT_CHARS) return 0;

    let score = 0;
    const lines = t.split("\n");
    const words = t.split(/\s+/).length;

    // multi-line and substantial
    if (lines.length >= 3) score += 2;
    if (lines.length >= 8) score += 1;
    if (words >= 40) score += 2;
    if (words >= 150) score += 1;

    // imperative / instructional voice
    if (/^(build|create|make|design|implement|rebuild|construct|generate|you are|your task|goal|objective)\b/im.test(t)) score += 3;
    if (/\b(requirement|constraint|token|font|color|palette|spacing|layout|component|responsive|animation|should|must|avoid|ensure)\b/i.test(t)) score += 2;

    // structured, prompt-like
    if (/^\s*[-*]\s+/m.test(t)) score += 1;              // bullet list
    if (/^\s*\d+[.)]\s+/m.test(t)) score += 1;            // numbered list
    if (/^#{1,4}\s+\S/m.test(t)) score += 1;              // headings
    if (/```/.test(t)) score += 1;                        // fenced blocks
    if (hasCue(t)) score += 2;

    // penalise things that are definitely not a prompt
    if (/^(import |export |const |function |class )/m.test(t) && lines.length < 5) score -= 4;
    if (/^[\s\d.,$€£¥%+\-*/=()[\]]+$/.test(t)) score -= 5;

    return score;
  }

  function pickBest(candidates) {
    let best = null;
    for (const c of candidates) {
      const score = scoreCandidate(c.text);
      if (score > 0 && (!best || score > best.score)) best = { ...c, score };
    }
    return best;
  }

  function dedupe(list, text) {
    const norm = normalize(text);
    return list.filter((p) => normalize(p.text) !== norm);
  }

  /* -------------------------------------------------------------- collection */

  const SEL_TEXT_BLOCKS = [
    "textarea", "pre", "code", "[contenteditable='']", "[contenteditable='true']",
    "[role='textbox']", ".whitespace-pre-wrap", ".whitespace-pre-line",
  ].join(",");

  function collectCandidates() {
    const out = [];
    const seen = new Set();

    const push = (el, source) => {
      if (!el || seen.has(el)) return;
      seen.add(el);
      const text = el.value !== undefined && el.tagName === "TEXTAREA" ? el.value : el.innerText;
      out.push({ el, source, text: text || "" });
    };

    // 1 + 2: anything explicitly cued as a prompt
    for (const el of document.querySelectorAll("[aria-label], [data-testid], [class]")) {
      const label = [
        el.getAttribute("aria-label"),
        el.getAttribute("data-testid"),
        typeof el.className === "string" ? el.className : "",
      ].filter(Boolean).join(" ").toLowerCase();
      if (!label || !hasCue(label)) continue;
      // prefer the element's own text, else an inner pre/textarea
      if (el.tagName === "TEXTAREA") push(el, "cued:self");
      else {
        const inner = el.querySelector(SEL_TEXT_BLOCKS);
        if (inner) push(inner, "cued:inner");
        else if (el.innerText && el.innerText.trim().length > 0) push(el, "cued:text");
      }
    }

    // 3: shaped text blocks anywhere on the page
    for (const el of document.querySelectorAll(SEL_TEXT_BLOCKS)) push(el, "shaped");

    return out;
  }

  function findPrompt() {
    const candidates = collectCandidates();
    const best = pickBest(candidates);
    return { best, candidateCount: candidates.length };
  }

  /* ----------------------------------------------------------------- history */

  const HISTORY_KEY = "tfpg.prompts.v1";

  function loadHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }

  function saveHistory(list) {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 60)));
    } catch (e) {
      console.warn("[21st prompt grabber] gagal simpan history", e);
    }
  }

  function remember(text, meta) {
    const clean = normalize(text);
    if (clean.length < MIN_PROMPT_CHARS) throw new Error("Prompt terlalu pendek (<120 karakter).");
    const list = dedupe(loadHistory(), clean);
    list.unshift({ text: clean, at: new Date().toISOString(), ...meta });
    saveHistory(list);
    return clean;
  }

  /* ------------------------------------------------------------------ output */

  async function toClipboard(text) {
    if (typeof GM_setClipboard === "function") {
      GM_setClipboard(text, "text");
      return;
    }
    await navigator.clipboard.writeText(text);
  }

  function download(name, content, mime) {
    if (typeof GM_download === "function") {
      GM_download({
        url: URL.createObjectURL(new Blob([content], { type: mime || "text/plain;charset=utf-8" })),
        name,
        saveAs: false,
      });
      return;
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type: mime || "text/plain;charset=utf-8" }));
    a.download = name;
    a.style.display = "none";
    document.body.append(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  /* ------------------------------------------------------------------- panel */

  const state = { last: null, open: false };

  function addPanel() {
    if (document.getElementById("tfpg")) return;
    state.open = true;

    if (typeof GM_addStyle === "function") {
      GM_addStyle(css());
    } else {
      const s = document.createElement("style");
      s.textContent = css();
      document.documentElement.append(s);
    }

    const panel = document.createElement("div");
    panel.id = "tfpg";
    panel.innerHTML = `
      <div class="tfpg-bar">
        <span class="tfpg-title">21st prompt</span>
        <button type="button" class="tfpg-x" data-a="close" title="Sembunyikan">&times;</button>
      </div>
      <div class="tfpg-body">
        <button type="button" data-a="grab">Grab prompt dari halaman</button>
        <button type="button" data-a="sel">Copy selection</button>
        <button type="button" data-a="hist">History (<span class="tfpg-n">0</span>)</button>
        <button type="button" data-a="export">Export semua (.md)</button>
        <div class="tfpg-list" hidden></div>
        <div class="tfpg-note">Alt+Shift+P = grab. Pilih teks manual lalu klik "Copy selection" kalau grab gagal.</div>
        <div class="tfpg-status" role="status" aria-live="polite"></div>
      </div>
    `;
    document.documentElement.append(panel);

    panel.addEventListener("click", onPanelClick);
    renderHistory();
    status("Siap. Butuh halaman yang memuat prompt.");
  }

  function onPanelClick(event) {
    const b = event.target.closest("button[data-a]");
    if (!b) return;
    const a = b.dataset.a;
    if (a === "close") { state.open = false; document.getElementById("tfpg").style.display = "none"; return; }
    if (a === "grab") return grab();
    if (a === "sel") return copySelection();
    if (a === "hist") return toggleHistory();
    if (a === "export") return exportAll();
  }

  function css() {
    return `
      #tfpg{position:fixed;right:14px;bottom:14px;z-index:2147483647;width:252px;padding:10px;
        border:1px solid rgba(120,120,120,.35);border-radius:10px;
        background:color-mix(in srgb,Canvas 94%,transparent);color:CanvasText;
        box-shadow:0 12px 32px rgba(0,0,0,.18);backdrop-filter:blur(10px);
        font:12px/1.4 system-ui,-apple-system,"Segoe UI",sans-serif}
      #tfpg .tfpg-bar{display:flex;align-items:center;justify-content:space-between;gap:8px}
      #tfpg .tfpg-title{font-weight:700}
      #tfpg .tfpg-x{width:22px;height:22px;padding:0;line-height:1;border:1px solid rgba(120,120,120,.32);
        border-radius:6px;background:ButtonFace;color:ButtonText;cursor:pointer;font:inherit}
      #tfpg button[data-a]{display:block;width:100%;margin:6px 0 0;padding:7px 8px;
        border:1px solid rgba(120,120,120,.32);border-radius:6px;background:ButtonFace;
        color:ButtonText;cursor:pointer;font:inherit;text-align:left}
      #tfpg button[data-a]:hover{filter:brightness(.96)}
      #tfpg .tfpg-list{max-height:190px;overflow:auto;margin-top:7px;
        border:1px solid rgba(120,120,120,.28);border-radius:6px}
      #tfpg .tfpg-list[hidden]{display:none}
      #tfpg .tfpg-item{display:block;width:100%;padding:6px 8px;border:0;border-bottom:1px solid rgba(120,120,120,.2);
        background:transparent;color:inherit;cursor:pointer;font:inherit;text-align:left;white-space:nowrap;
        overflow:hidden;text-overflow:ellipsis}
      #tfpg .tfpg-item:hover{background:color-mix(in srgb,CanvasText 8%,transparent)}
      #tfpg .tfpg-note{margin:8px 0 0;font-size:11px;color:color-mix(in srgb,CanvasText 62%,transparent)}
      #tfpg .tfpg-status{margin-top:7px;font-size:11px;min-height:15px;
        color:color-mix(in srgb,CanvasText 70%,transparent);word-break:break-word}
      #tfpg .tfpg-status[data-kind="error"]{color:#c0392b}
      #tfpg .tfpg-status[data-kind="ok"]{color:#1e7a46}
    `;
  }

  function status(msg, kind) {
    const el = document.querySelector("#tfpg .tfpg-status");
    if (!el) return;
    el.textContent = msg;
    el.dataset.kind = kind === "error" ? "error" : kind === "ok" ? "ok" : "info";
  }

  /* ------------------------------------------------------------------ actions */

  async function grab() {
    const { best, candidateCount } = findPrompt();
    if (!best) {
      status(
        `Tidak menemukan prompt di halaman ini (${candidateCount} blok teks diperiksa). ` +
        `Coba: buka halaman generation/studio yang prompt-nya terlihat, atau blok "Copy selection".`,
        "error"
      );
      return;
    }
    try {
      const clean = remember(best.text, { source: best.source, score: best.score, url: location.pathname });
      await toClipboard(clean);
      renderHistory();
      status(`Tersalin! ${clean.length} karakter dari "${best.source}" (skor ${best.score}).`, "ok");
    } catch (e) {
      status(e.message || "Gagal menyalin", "error");
    }
  }

  async function copySelection() {
    const sel = String(window.getSelection?.() || "").trim();
    if (!sel) return status("Tidak ada teks terseleksi. Blok prompt-nya dulu.", "error");
    try {
      const clean = remember(sel, { source: "selection", url: location.pathname });
      await toClipboard(clean);
      renderHistory();
      status(`Selection tersalin (${clean.length} karakter).`, "ok");
    } catch (e) {
      status(e.message || "Gagal menyalin", "error");
    }
  }

  function toggleHistory() {
    const el = document.querySelector("#tfpg .tfpg-list");
    if (el) el.hidden = !el.hidden;
  }

  function renderHistory() {
    const list = loadHistory();
    const n = document.querySelector("#tfpg .tfpg-n");
    if (n) n.textContent = String(list.length);
    const box = document.querySelector("#tfpg .tfpg-list");
    if (!box) return;
    box.textContent = "";
    if (!list.length) {
      const empty = document.createElement("div");
      empty.className = "tfpg-note";
      empty.style.padding = "8px";
      empty.textContent = "Belum ada prompt tersimpan.";
      box.append(empty);
      return;
    }
    list.forEach((p, i) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "tfpg-item";
      const first = p.text.split("\n")[0].slice(0, 40);
      item.textContent = `${new Date(p.at).toLocaleString()} · ${p.source} · ${first}…`;
      item.title = p.text;
      item.addEventListener("click", async () => {
        await toClipboard(p.text);
        status("Prompt dari history tersalin.", "ok");
      });
      box.append(item);
    });
  }

  function exportAll() {
    const list = loadHistory();
    if (!list.length) return status("History masih kosong.", "error");
    const md =
      list
        .map((p, i) => `## Prompt ${i + 1}\n\n- captured: ${p.at}\n- source: ${p.source}\n- url: ${p.url || "-"}\n\n\`\`\`\n${p.text}\n\`\`\`\n`)
        .join("\n---\n\n") + "\n";
    download("21st-prompts.md", "# 21st.dev prompts\n\n" + md, "text/markdown;charset=utf-8");
    status(`Export ${list.length} prompt.`, "ok");
  }

  /* -------------------------------------------------------------------- init */

  function onKey(e) {
    if (e.altKey && e.shiftKey && (e.key === "p" || e.key === "P")) {
      e.preventDefault();
      grab();
    }
  }

  function init() {
    if (!/(^|\.)21st\.dev$/.test(location.hostname)) return;
    addPanel();
    window.addEventListener("keydown", onKey, true);

    if (typeof GM_registerMenuCommand === "function") {
      GM_registerMenuCommand("Grab prompt dari halaman", grab);
      GM_registerMenuCommand("Copy selection", copySelection);
      GM_registerMenuCommand("Export semua prompt (.md)", exportAll);
    }
  }

  init();
})();
