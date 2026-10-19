// Tempel di DevTools Console (F12) pada halaman 21st.dev studio tempat prompt terlihat.
// Mencari elemen yang memuat teks prompt, lalu menyalin outerHTML-nya ke clipboard.


(() => {
  const MIN = 120;
  const norm = t => String(t || '').replace(/\r\n?/g, '\n').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  const CUES = ['copy prompt', 'prompt', 'spec', 'instruction', 'brief', 'rebuild', 'paste-ready', 'paste ready'];
  const hasCue = t => { t = String(t || '').toLowerCase(); return CUES.some(c => t.includes(c)); };
  const score = t => {
    t = norm(t);
    if (t.length < MIN) return 0;
    let s = 0;
    const L = t.split('\n'), W = t.split(/\s+/).length;
    if (L.length >= 3) s += 2;
    if (L.length >= 8) s += 1;
    if (W >= 40) s += 2;
    if (W >= 150) s += 1;
    if (/^(build|create|make|design|implement|rebuild|construct|generate|you are|your task|goal|objective)\b/im.test(t)) s += 3;
    if (/\b(requirement|constraint|token|font|color|palette|spacing|layout|component|responsive|should|must|avoid|ensure)\b/i.test(t)) s += 2;
    if (/^\s*[-*]\s+/m.test(t)) s += 1;
    if (/^\s*\d+[.)]\s+/m.test(t)) s += 1;
    if (/^#{1,4}\s+\S/m.test(t)) s += 1;
    if (t.indexOf('```') >= 0) s += 1;
    if (hasCue(t)) s += 2;
    return s;
  };
  const SEL = 'textarea,pre,code,[contenteditable],[role=textbox],div,section,article,p,span,li,button';
  const label = el => [el.id && '#' + el.id, el.getAttribute('aria-label'), el.getAttribute('data-testid'),
    (typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 3).join('.') : '')]
    .filter(Boolean).join(' | ');

  const cands = [];
  for (const el of document.querySelectorAll(SEL)) {
    const t = el.value !== undefined && el.tagName === 'TEXTAREA' ? el.value : (el.innerText || '');
    const s = score(t);
    if (s > 0) cands.push({ el, s, len: norm(t).length, tag: el.tagName, label: label(el) });
  }
  cands.sort((a, b) => b.s - a.s || b.len - a.len);

  console.log('%cKandidat prompt: ' + cands.length, 'font-weight:bold;font-size:13px');
  console.table(cands.slice(0, 12).map(({ el, ...r }) => r));
  window.__promptAll = cands;

  if (!cands.length) {
    console.warn('Tidak ada kandidat. Pastikan halaman/panel prompt SEDANG TERBUKA, lalu jalankan ulang.');
    return;
  }

  const best = cands[0];
  const html = best.el.outerHTML || '';
  console.log('%c--- OUTER HTML (' + html.length + ' char) ---', 'background:#c0392b;color:#fff;padding:2px 6px');
  console.log(html.slice(0, 12000));
  copy(html);
  console.log('%cTersalin. Kandidat lain: copy(window.__promptAll[i].el.outerHTML)', 'color:#0a0');
  window.__promptEl = best.el;
})();

