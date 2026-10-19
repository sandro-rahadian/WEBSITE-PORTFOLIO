# stitch_prompt.md — Prompt Stitch final (Metode A, Visual Reference)

> **Kegunaan file ini:** salin blok `PROJECT DIRECTION` ke prompt Stitch (atau ke sesi AI lain).
>_Blok di Bagian 5 adalah yang dipaste ke Stitch. Bagian 1–4 adalah konteks untuk kita._
>
> **Status:** **BELUM BUILD.** Fase = `DEFINE` selesai, `PLAN` selesai. Menunggu output Stitch
> (design/sample) + project zip + MCP untuk tahap BUILD interaktif.
>
> **Referensi:** `https://midu.design` — ground truth forensik, bukan inspirasi.
> **Spec lengkap:** `design.md` (527 baris) · **Visual specimen:** `index.html`

---

## 1. Ringkasan extracted design system (versi ringkas untuk di-paste)

Dihapus semua paragraph agar prompt tetap ringkas; angka lengkap ada di `design.md`.

**Type** — Switzer, hanya 3 weight: Regular 400 / Medium 500 / Semibold 600.
Display `82px / lh 1.0 / ls -3.28px` · Display XL `84px / ls -3.36px` · Display M `65px / ls -2.6px` ·
Card title `32px / ls -0.64px` · Work title `28px / ls -0.56px` · Lead `24px / ls -0.96px` ·
Body `18px / ls -0.54px` · Body S `16px / ls -0.48px` · Chip `14px / ls -0.42px` · Caption `14px / ls -0.28px`

**Color (dark base)** — bg `#050505` · surface `#121212` / `#151515` · CTA translucent `#1A1A1A` ·
CTA solid `#FFFFFF` dengan label `#030303` · text `#FFFFFF` · dim 50% `#828282` · dim 60% `#9B9B9B`

**Color (light section)** — bg `#E6E6E6` dengan `radius 24px` · card `#FFFFFF` `radius 36px` ·
ikon `#E6E6E6` `radius 16px` · heading `#000000` · body `rgba(0,0,0,0.8)`

**Radius** — `1 / 14 / 16 / 18 / 20 / 24 / 32 / 36px` (semua terpakai)

**3 gutter (JANGAN diratakan)** — `40px` (969px content) · `75px` (900px) · `132px` (785px)

**Spacing** — card padding `40px` dan `45px 40px` · grid gap `20px` dan `40px` · section top `80px`

**Custom effect yang WAJIB ada** (bukan generik) — WebGL gradient hero via iframe ·
wordmark `color-dodge` + `mask-image` svg · blur per-kata · ghost `<mark>` offset `+100px/-9px` ·
image parallax dalam rounded clip · glassmorphism chip `backdrop-filter: blur(5px)` ·
marquee JS + edge mask · hard-cut tema via `z-index` + `radius`

---

## 2. 8 Section portfolio (hasil restrukturisasi + penggabungan)

| # | Section | Peran | Tema |
|---|---|---|---|
| **P1** | Hero | H1 32px + wordmark kinetic + caption row | dark |
| **P2** | About | Statement 82px + teks 2-tone justify + CTA | dark |
| **P3** | Work / Studies | Visual featured 872×577 + heading 65px + grid 4 kartu | dark |
| **P4** | Statement transisi | 82px two-tone, jembatan ke light | dark |
| **P5** | Certifications | 84px hitam + marquee 12 badge | **LIGHT** `#E6E6E6` |
| **P6** | What I do | 4 kartu putih, staggered masonry | **LIGHT** |
| **P7** | FAQ | Heading 32px + accordion 2 kolom | dark |
| **P8** | Contact | Tagline 24px + CTA putih + link columns + wordmark | dark |

**Dihapus:** Pricing, Testimonials.

---

## 3. ⚠️ Scaling — baca sebelum implementasi

Semua angka di atas **terukur pada viewport 1049 × 821**. Target build: **1440px**.
Skala `k = 1440 / 1049 = 1.37274`.

**Type — fluid, di-anchor exact di 1049 dan 1440:**
```css
--fs-display-xl : clamp(40px, 8.008vw, 115.3px);   /* 84  → 115.3 */
--fs-display-l  : clamp(40px, 7.817vw, 112.6px);   /* 82  → 112.6 */
--fs-display-m  : clamp(32px, 6.196vw, 89.2px);    /* 65  → 89.2  */
--fs-card-title : clamp(22px, 3.051vw, 43.9px);    /* 32  → 43.9  */
--fs-work-title : clamp(20px, 15.11px + 1.229vw, 32.8px);
--fs-lead       : clamp(18px, 12.95px + 1.054vw, 28.1px);
--fs-body       : clamp(17px,  9.71px + 0.790vw, 21.1px);
--fs-body-s     : clamp(16px,  8.63px + 0.702vw, 18.7px);
--fs-chip       : clamp(13px,  7.55px + 0.615vw, 16.4px);

--ls-display-l  : -0.3127vw;                        /* -3.28 → -4.50 */
--ls-body       : -0.291px - 0.0237vw;
```

**Layout/spacing — proporsional penuh, `calc(N * 100vw / 1049)`:**
```css
--gutter-nav : calc(20  * 100vw / 1049);   /* 20  → 27.5  */
--gutter-a   : calc(40  * 100vw / 1049);   /* 40  → 54.9  */
--gutter-b   : calc(75  * 100vw / 1049);   /* 75  → 103.0 */
--gutter-c   : calc(132 * 100vw / 1049);   /* 132 → 181.2 */
--grid-gap-tight : calc(20 * 100vw / 1049);
--grid-gap-wide  : calc(40 * 100vw / 1049);
--pad-card   : calc(40 * 100vw / 1049);
```

**Radius — di-damp geometris** (`√(V × V·k)`) supaya tidak melar:
`1→1.2` `14→16.4` `16→18.7` `18→21.1` `20→23.4` `24→28.1` `32→37.5` `36→42.2` px

> **Type < 32px dikompresi `√k = 1.1716`**, bukan `k` penuh — kalau `k` penuh, body 18px jadi
> **24.7px** di 1440 (di atas rentang nyaman). Type ≥32px tetap `k` penuh. Nilai alternatif
> seragam penuh ada di `design.md` §3.7.

---

## 4. 2 Cacat aksesibilitas yang WAJIB diperbaiki

| Cacat terukur | Angka | Perbaikan |
|---|---|---|
| `rgba(255,255,255,0.4)` → `#696969` di `#050505` | **3.71:1** ❌ AA (butuh 4.5:1) | naik ke `rgba(255,255,255,0.5)` = **5.30:1** |
| Logo nav `#FFFFFF` di section terang `#E6E6E6` | **1.25:1** ❌ | hard-cut per section via IntersectionObserver, bukan andalkan scroll |

---

## 5. BLOK PROMPT — salin ini ke Stitch

```text
Build a single-page personal portfolio website, dark editorial neo-grotesque, 8 sections.

DESIGN SYSTEM — use these exact values, do not round or "improve" them.

Font: "Switzer" only (available free at https://api.fontshare.com/v2/css?f[]=switzer@400,500,600).
Use ONLY 3 weights: Regular 400, Medium 500, Semibold 600. No 700.
Fallback stack: "Switzer", "Switzer Placeholder", system-ui, sans-serif.

Type scale (line-height for display is exactly 1.0):
  display-xl   84px  w500  lh 1.0   letter-spacing -3.36px
  display-l    82px  w500  lh 1.0   letter-spacing -3.28px
  display-m    65px  w500  lh 1.0   letter-spacing -2.6px
  card-title   32px  w500  lh 1.1   letter-spacing -0.64px
  card-title-s5 30px w600  lh 1.1   letter-spacing -1.2px
  work-title   28px  w500  lh 1.1   letter-spacing -0.56px
  lead         24px  w500  lh 1.3   letter-spacing -0.96px
  body-l       18px  w500  lh 1.3   letter-spacing -0.72px
  body         18px  w400  lh 1.2   letter-spacing -0.54px
  body-s       16px  w400  lh 1.3   letter-spacing -0.48px
  chip         14px  w500  lh 1.1   letter-spacing -0.42px
  caption      14px  w400  lh 1.1   letter-spacing -0.28px
  micro        12px  w400  lh 1.1   letter-spacing 0

Colors — dark base:
  page bg        #050505
  surface card   #121212
  surface alt    #151515
  CTA subtle     #1A1A1A
  CTA solid      #FFFFFF  with label #030303
  text           #FFFFFF
  text 50%       #828282
  text 60%       #9B9B9B

Colors — light section (ONE section only, see P5/P6):
  page bg        #E6E6E6   border-radius 24px
  card           #FFFFFF   border-radius 36px   box-shadow rgba(0,0,0,0.05) 0 8px 20px
  icon button    #E6E6E6   border-radius 16px   40x40px
  heading        #000000
  body           rgba(0,0,0,0.8)

Radius scale — use these, all of them appear: 1, 14, 16, 18, 20, 24, 32, 36px

THREE DIFFERENT CONTENT GUTTERS — do not unify into one container:
  40px  ->  content 969px   (hero caption, work grid, footer)
  75px  ->  content 900px   (section headings, FAQ)
  132px ->  content 785px   (certifications + what-I-do)

Spacing:
  card padding 40px  |  service card padding 45px 40px  |  FAQ item padding 24px 28px
  CTA pill padding 0 18px  |  chip padding 0 12px  |  menu pill padding 0 16px
  grid gap 20px (2-col tight)  |  grid gap 40px (2-col wide)
  section padding-top 80px

Make all of this fluid. These numbers were measured at a 1049px-wide viewport; the target is
1440px, so scale proportionally. Use clamp()/vw anchored so 1049px renders EXACTLY the values above
and 1440px renders ~1.37x. Compress type below 32px by sqrt(1.37) = 1.17 instead of the full
factor, so body text lands near 21px at 1440 rather than 24.7px. Dampen border-radius
geometrically (sqrt of value x scaled value) so 24px becomes ~28px and 36px becomes ~42px, not
33px and 49px.

SECTIONS, in this order:

P1 HERO (dark #050505)
  - Full-bleed animated red gradient background. Implement as a WebGL/canvas gradient shader in a
    cross-origin iframe or a shader component. It must be a live animated gradient, NOT a static
    CSS gradient.
  - Above it, a giant wordmark (your initials or name) spanning 969x294px, built as:
    an SVG mask of the wordmark, filled with radial-gradient(56% 156% at 47.1% 1.9%,
    rgba(255,255,255,0) 0%, #D9B6B6 100%) and a second layer
    linear-gradient(rgba(143,143,143,0) 0%, rgba(176,125,125,0.33) 100%);
    both layers mix-blend-mode: darken, and the whole block mix-blend-mode: color-dodge.
    The result reads peach-to-red over the red background.
  - H1, 32px only: "Design for those who want to become a better version of themselves."
    Do NOT make the H1 bigger. The sense of scale comes from the wordmark, not the H1.
  - Caption row at the bottom, 3 items space-between, 14px:
    left "Global product design studio"  →  write your own descriptor
    center live clock "07:32 AM London, UK"  →  live-updating
    right "Scroll to explore" with a down arrow
  - Fixed nav on top: transparent, no background, no backdrop-filter, 80px tall, logo left,
    a "Menu" pill right: 95x45px, background rgba(21,21,21,0.8), border-radius 14px,
    padding 0 18px, with a 2x2 grid icon of 4x4px white squares (1px radius, 2px gaps)
    and an 18px white label. The nav logo inverts white to black when over light sections.

P2 ABOUT (dark)
  - 82px display heading, line-height exactly 1.0, 3 lines, first sentence white #FFFFFF,
    the rest at 50% white. Each word is a separate span.
  - 24px paragraph, 2-tone: white medium-weight lead-in phrase then 50% white body text,
    text-align justify.
  - 18px 50%-white sub-paragraph.
  - CTA pill 192x48px, background #1A1A1A, border-radius 20px, padding 0 18px, 16px label.

P3 WORK / STUDIES (dark)
  - One large featured visual, 872x577px, border-radius 24px, that scales from 0.93 to 1.0
    as you scroll.
  - 65px two-tone heading: first sentence #FFFFFF, rest rgba(255,255,255,0.6).
  - 24px intro paragraph (2-tone) on the left, 18px 50%-white aside on the right.
  - 2-column grid of 4 project cards, 475px wide each, 20px gap, 24px gutter from the edges.
    Cards have NO background color. Each card is a full-bleed product screenshot.
    The screenshot is TALLER than the card and offset upward, clipped by the card's
    border-radius with overflow hidden — it parallaxes on scroll.
    The four cards must look DIFFERENT from each other: one dark UI, one light grey render,
    one cream/warm render, one photograph. Do not normalize them to one card color.
  - Top-right of each card: a pill chip, 36px tall, border-radius 16px, padding 0 12px,
    background rgba(0,0,0,0.3) WITH backdrop-filter: blur(5px), 14px label at 80% white.
  - Bottom 140px of each card: linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)
  - Card text: 28px title, 16px category, 32px link.

P4 STATEMENT (dark) — transition into the light section
  - 82px two-tone heading: "A partner you can trust." white, "High standards. Reliable
    delivery." at 50% white.

P5 CERTIFICATIONS (LIGHT #E6E6E6, border-radius 24px, stacked ABOVE the dark sections)
  - Hard cut. No gradient transition between light and dark.
  - 84px black heading, line-height 1.0, split across two lines: "Certifications &" left-aligned,
    "tools I master." right-aligned.
  - Horizontal infinite marquee of 12 badge tiles: 80x80px, border-radius 18px, 60x60 image inside,
    14px label at rgba(0,0,0,0.6) below. Items duplicated so the loop is seamless.
    Move it with translateX in JS, not a CSS animation. Fade the tiles out at both edges.
  - 18px body at rgba(0,0,0,0.6).
  - A light pill CTA with a #030303 label.

P6 WHAT I DO (same light section, continues)
  - 2 columns, 373px wide, 40px gap, but STAGGERED — the four cards sit at four different
    vertical offsets. Do not align them into a clean grid.
  - Card: #FFFFFF, border-radius 36px, padding 45px 40px,
    box-shadow rgba(0,0,0,0.05) 0 8px 20px
  - 30px SEMIBOLD 600 black title (this is the only Semibold on the page)
  - a 1px hairline divider under the title
  - 16px body at rgba(0,0,0,0.8)
  - bottom-right: a 40x40px arrow button, #E6E6E6, border-radius 16px, with a diagonal arrow

P7 FAQ (back to dark #050505)
  - 32px heading "Frequently Asked Questions"
  - 2 columns, 440px wide, 20px gap
  - Each item: 440x97px, background #121212, border-radius 24px, padding 24px 28px,
    18px question, small chevron on the right
  - The expanded answer sits OUTSIDE and BELOW the card, indented 28px, 16px at 60% white.
    Do not put the answer inside the card background.

P8 CONTACT / FOOTER (dark)
  - Small live clock row with a sleep glyph
  - 24px tagline: "Design for those who want to become a better version of themselves."
  - CTA "Get in touch": 151x48px pill, SOLID #FFFFFF, border-radius 20px, padding 0 18px,
    label 18px in #030303, with a 4-point sparkle icon
  - Two link columns with small grey labels and 16px white links
  - Bottom row: copyright on the left, TERMS / PRIVACY POLICY on the right
  - A giant wordmark across the very bottom, 969x294px, filled with
    linear-gradient(rgba(255,3,0,0) 0%, rgba(255,0,34,0.68) 60%, #FF7D4E 85%),
    mix-blend-mode normal, and it is cropped by the bottom of the page.
    It reads red at the top fading to black at the bottom. This is the same wordmark component
    as the hero but WITHOUT the color-dodge blend, so it looks different on purpose.

NAV — fixed, 80px, transparent, 20px side padding, logo left, Menu pill right.
The logo mark and wordmark must switch between white and black depending on whether the
section underneath is dark or light.

TWO RECOMMENDED FIXES to accessibility problems present in the reference — apply them:
  1. 50%-white body text on #050505 is only 3.71:1 contrast, which fails WCAG AA.
     Raise it to 60% white (#9B9B9B, 7.33:1) for body copy.
  2. The nav logo is white, but one section is light #E6E6E6 — white on that is 1.25:1 and
     effectively invisible. Switch the logo color per section with an IntersectionObserver,
     not on scroll position.

MOTION — every large heading has its words split into individual spans and each word reveals
with a blur that animates to zero. Keep it to transform, opacity and filter only, 60fps.
Give the marquee a pause on hover and respect prefers-reduced-motion by disabling the
WebGL shader, the blend modes, the marquee and the per-word blur.

Do not add a pricing section. Do not add a testimonials section. Do not add a contact form.
Do not add badges, eyebrow labels, or sections that were not listed above.
```

---

## 6. Apa yang perlu dikembalikan ke saya untuk tahap BUILD

1. **Output Stitch** — design/sample yang dihasilkan (screenshot atau link).
2. **Project zip** — hasil export dari Stitch.
3. **MCP Stitch** — konfigurasi MCP-nya.

Setelah ketiganya ada, baru saya masuk fase `BUILD` untuk mengubahnya jadi website interaktif
(Next.js 15 + React 19 + Tailwind 3 + framer-motion 12 + lenis, sudah terpasang di `package.json`).
`index.html` dan `design.md` dipakai sebagai **referensi pembanding** — kalau output Stitch
melenceng dari token, saya tunjuk spec-nya, bukan regenerate dari nol.
