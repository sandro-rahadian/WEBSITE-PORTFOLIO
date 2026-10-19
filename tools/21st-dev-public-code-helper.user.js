// ==UserScript==
// @name         21st.dev Public Code Helper
// @namespace    local.21st-copy-helper
// @version      2.0.0
// @description  Copy PUBLIC code files (demo/usage) from 21st.dev component pages, and tell you exactly why the component source and AI "copy prompt" are not reachable from the page.
// @match        https://21st.dev/@*/components/*
// @match        https://21st.dev/*/components/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @connect      21st.dev
// @connect      cdn.21st.dev
// ==/UserScript==

/*
  VERIFIED BEHAVIOUR (checked against a live page, e.g. /@ravikatiyar162/components/circular-gallery):

  * PUBLIC    cdn.21st.dev/<author>/<slug>/default/code.demo.<ts>.tsx   -> real usage/demo code
  * PRIVATE   the component source itself. The RSC payload carries "code":"" and
              cdn.21st.dev/.../code.<ts>.tsx returns 404. It is only served to an
              authenticated `npx shadcn add ...?api_key=` call or the 21st MCP
              `get_component` tool. No userscript can read it.
  * NOT ON PAGE  the AI "copy prompt". The only "prompt" string in the payload is
              `prompt_copy_count`, an analytics counter. The real copyPrompt is
              generated server-side for generations you own and comes back from the
              MCP `get_take` tool.

  BUGS FIXED FROM v1.0.0:
  1. `componentUrl` regex was `/\/code\.[^/]+\.tsx$/`, which ALSO matches
     `code.demo.<ts>.tsx`. v1 therefore copied the demo file while labelling it
     "component.tsx" (silently wrong), and "Copy all" duplicated it.
     Now anchored with a negative lookahead: `/\/code\.(?!demo\.)[^/]+\.tsx$/`.
  2. v1 threw a misleading "No public CDN code URLs found" when the registry file
     did not exist. It now reports the real reason.
*/

(function () {
  "use strict";

  const state = { files: null, loading: null, probe: null };

  init();

  function init() {
    addPanel();

    if (typeof GM_registerMenuCommand === "function") {
      GM_registerMenuCommand("Copy demo / usage code", () => copyKind("usage"));
      GM_registerMenuCommand("Copy component source", () => copyKind("component"));
      GM_registerMenuCommand("Copy all public code", () => copyKind("all"));
      GM_registerMenuCommand("Download all public code", downloadAll);
    }
  }

  /* ------------------------------------------------------------------ panel */

  function addPanel() {
    if (document.getElementById("tfch")) return;

    const panel = document.createElement("div");
    panel.id = "tfch";
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-label", "21st.dev public code helper");

    panel.innerHTML = `
      <div class="tfch-bar">
        <span class="tfch-title">21st public code</span>
        <button type="button" class="tfch-toggle" aria-expanded="true" title="Collapse">&minus;</button>
      </div>
      <div class="tfch-body">
        <button type="button" data-action="usage">Copy demo / usage</button>
        <button type="button" data-action="component">Copy component source</button>
        <button type="button" data-action="all">Copy all public code</button>
        <button type="button" data-action="download">Download public code</button>
        <p class="tfch-note">
          Component source and the AI copy&nbsp;prompt are <strong>not</strong> in the page
          (source is auth-gated, prompt is server-side only). Use
          <code>npx shadcn add</code> with your API key, or the 21st MCP
          <code>get_component</code> / <code>get_take</code> tools.
        </p>
        <div class="tfch-status" role="status" aria-live="polite"></div>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      #tfch {
        position: fixed; right: 14px; bottom: 14px; z-index: 2147483647;
        width: 244px; padding: 10px;
        border: 1px solid rgba(120,120,120,.35); border-radius: 10px;
        background: color-mix(in srgb, Canvas 94%, transparent);
        color: CanvasText; box-shadow: 0 12px 32px rgba(0,0,0,.18);
        backdrop-filter: blur(10px);
        font: 12px/1.4 system-ui, -apple-system, "Segoe UI", sans-serif;
      }
      #tfch .tfch-bar { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
      #tfch .tfch-title { font-weight: 700; }
      #tfch .tfch-toggle {
        width: 22px; height: 22px; padding: 0; line-height: 1;
        border: 1px solid rgba(120,120,120,.32); border-radius: 6px;
        background: ButtonFace; color: ButtonText; cursor: pointer; font: inherit;
      }
      #tfch[data-collapsed="true"] .tfch-body { display: none; }
      #tfch button[data-action] {
        display: block; width: 100%; margin: 6px 0 0; padding: 7px 8px;
        border: 1px solid rgba(120,120,120,.32); border-radius: 6px;
        background: ButtonFace; color: ButtonText; cursor: pointer;
        font: inherit; text-align: left;
      }
      #tfch button[data-action]:hover { filter: brightness(.96); }
      #tfch .tfch-note {
        margin: 9px 0 0; font-size: 11px; line-height: 1.45;
        color: color-mix(in srgb, CanvasText 62%, transparent);
      }
      #tfch .tfch-note code {
        font: inherit; padding: 0 2px; border-radius: 3px;
        background: color-mix(in srgb, CanvasText 10%, transparent);
      }
      #tfch .tfch-status { min-height: 15px; margin-top: 7px; font-size: 11px;
        color: color-mix(in srgb, CanvasText 70%, transparent); }
      #tfch .tfch-status[data-kind="error"] { color: #c0392b; }
    `;

    document.documentElement.append(style, panel);

    panel.addEventListener("click", (event) => {
      const toggle = event.target.closest(".tfch-toggle");
      if (toggle) {
        const collapsed = panel.getAttribute("data-collapsed") === "true";
        panel.setAttribute("data-collapsed", String(!collapsed));
        toggle.setAttribute("aria-expanded", String(collapsed));
        toggle.textContent = collapsed ? "\u2212" : "+";
        return;
      }
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      const action = button.dataset.action;
      if (action === "usage") copyKind("usage");
      if (action === "component") copyKind("component");
      if (action === "all") copyKind("all");
      if (action === "download") downloadAll();
    });
  }

  /* ------------------------------------------------------------------ copy */

  async function copyKind(kind) {
    try {
      setStatus("Loading...");
      const report = await getReport();

      if (kind === "component" && !report.component) {
        throw new Error(
          "Component source is not public. Use npx shadcn add with your API key, or MCP get_component."
        );
      }

      const selected = report.files.filter((f) => kind === "all" || f.kind === kind);
      if (!selected.length) throw new Error("No public code files on this page.");

      const text = selected
        .map((f) => `// ${f.name} (${f.kind})\n${f.content.trimEnd()}\n`)
        .join("\n");

      await writeClipboard(text);
      setStatus(`Copied ${selected.length} file(s), ${formatBytes(text.length)}`);
    } catch (error) {
      setStatus(error.message || "Copy failed", "error");
      console.error("[21st public code helper]", error);
    }
  }

  async function downloadAll() {
    try {
      setStatus("Loading...");
      const report = await getReport();
      if (!report.files.length) throw new Error("No public code files on this page.");

      for (const file of report.files) downloadText(file.name, file.content);
      setStatus(`Downloaded ${report.files.length} file(s)`);
    } catch (error) {
      setStatus(error.message || "Download failed", "error");
      console.error("[21st public code helper]", error);
    }
  }

  /* ------------------------------------------------------------------ fetch */

  async function getReport() {
    if (state.files) return state.files;
    if (state.loading) return state.loading;

    state.loading = loadReport();
    state.files = await state.loading;
    state.loading = null;
    return state.files;
  }

  async function loadReport() {
    const pageHtml = document.documentElement.innerHTML;
    const flight = extractFlightPayload(pageHtml);
    const haystack = `${pageHtml}\n${flight}`;

    const urls = extractCdnUrls(haystack);
    const componentUrl = urls.find((u) => COMPONENT_RE.test(u)) || null;
    const usageUrl = urls.find((u) => USAGE_RE.test(u)) || null;
    const registryUrl = urls.find((u) => REGISTRY_RE.test(u)) || null;

    const files = [];

    // Opportunistic: some components do publish a registry JSON.
    if (registryUrl) {
      try {
        const registry = JSON.parse(await requestText(registryUrl));
        for (const file of registry.files || []) {
          if (!file.path || typeof file.content !== "string") continue;
          files.push({ kind: "component", name: basename(file.path), content: file.content });
        }
      } catch {
        /* registry not readable; fall through to the direct file probes */
      }
    }

    if (usageUrl) {
      files.push({ kind: "usage", name: "usage.tsx", content: await requestText(usageUrl) });
    }

    // Only probe for a standalone component file if we did not already get one,
    // and never let the demo masquerade as the component.
    if (!files.some((f) => f.kind === "component") && componentUrl) {
      files.push({ kind: "component", name: "component.tsx", content: await requestText(componentUrl) });
    }

    // The payload itself tells us whether a source exists at all.
    const inlineCode = readInlineCode(flight);

    return {
      files,
      component: files.some((f) => f.kind === "component") || Boolean(inlineCode),
      inlineCode,
      sawPromptField: /prompt_copy_count|copyPrompt/.test(haystack),
    };
  }

  const COMPONENT_RE = /\/code\.(?!demo\.)[^/]+\.tsx$/;
  const USAGE_RE = /\/code\.demo\.[^/]+\.tsx$/;
  const REGISTRY_RE = /\/registry\.[^/]+\.json$/;

  function extractCdnUrls(text) {
    const normalized = text
      .replaceAll("\\/", "/")
      .replaceAll("\\u002F", "/")
      .replaceAll("&amp;", "&");

    return Array.from(
      new Set(
        [...normalized.matchAll(/https:\/\/cdn\.21st\.dev\/[^"'<>\\\s]+/g)]
          .map(([m]) => m.replace(/\\+$/, ""))
          .filter((u) => COMPONENT_RE.test(u) || USAGE_RE.test(u) || REGISTRY_RE.test(u))
      )
    );
  }

  function extractFlightPayload(html) {
    const out = [];
    for (const m of html.matchAll(/self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)/g)) {
      out.push(
        m[1]
          .replace(/\\n/g, "\n")
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, "\\")
      );
    }
    return out.join("\n");
  }

  function readInlineCode(flight) {
    if (!flight) return null;

    // "code" may be "", a React Flight reference such as
    // "r2://components-code-private/<author>/<slug>", or "$2d" pointing at
    // another row. Only real inline source counts as available.
    for (const m of flight.matchAll(/"code":"((?:[^"\\]|\\.)*)"/g)) {
      const raw = m[1];
      if (!raw || /^\$\d/.test(raw) || /^r\d+:\/\//i.test(raw)) continue;
      const value = raw.replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
      if (value.trim() && value.includes("\n") && !/^r\d+:\/\//i.test(value)) return value;
    }
    return null;
  }

  function requestText(url) {
    if (typeof GM_xmlhttpRequest === "function") {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url,
          headers: { accept: "text/html,application/json,text/plain,*/*" },
          onload: (response) => {
            if (response.status >= 200 && response.status < 300) resolve(response.responseText);
            else reject(new Error(`HTTP ${response.status}: ${basename(url)}`));
          },
          onerror: () => reject(new Error(`Request failed: ${basename(url)}`)),
        });
      });
    }

    return fetch(url).then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${basename(url)}`);
      return response.text();
    });
  }

  /* ------------------------------------------------------------------ utils */

  async function writeClipboard(text) {
    if (typeof GM_setClipboard === "function") {
      GM_setClipboard(text, "text");
      return;
    }
    await navigator.clipboard.writeText(text);
  }

  function downloadText(name, content) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.style.display = "none";
    document.body.append(link);
    link.click();
    setTimeout(() => {
      URL.revokeObjectURL(link.href);
      link.remove();
    }, 1000);
  }

  function basename(path) {
    return path.split("/").pop() || "component.tsx";
  }

  function formatBytes(n) {
    if (n < 1024) return `${n} B`;
    return `${(n / 1024).toFixed(1)} KB`;
  }

  function setStatus(message, kind) {
    const status = document.querySelector("#tfch .tfch-status");
    if (!status) return;
    status.textContent = message;
    status.dataset.kind = kind === "error" ? "error" : "ok";
  }
})();
