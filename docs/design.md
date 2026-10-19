# design.md — Portfolio "Nuance" — Reference Extraction: midu.design

> **Metode A (Visual Reference).** Ground truth = `https://midu.design`, di-capture forensik:
> 14 screenshot viewport (`_stitch-captures/vp-01.png`…`vp-14.png`, 2098×1642 px = **1049×821 CSS @ dpr 2**)
> + computed-style DOM per viewport (`vp-NN.raw.json` → `tokens.json`).
>
> **Viewport acuan pengukuran: 1049 × 821 CSS, dpr 2, `scrollHeight` = 10735px.**
> Semua angka hasil `getComputedStyle` + pixel-sampling PNG (Node PNG decoder, tanpa library).
> Yang tidak 100% pasti → `[PERLU VERIFIKASI]`. Non-standar → `[CUSTOM EFFECT]` + hipotesis.
>
> **Metode capture:** script bawaan `stitch-capture.sh` scroll step ~300px → 12 capture hanya
> menutup ⅓ halaman. Diganti **14 capture @ 810px** (< vh 821px) → coverage kontigu 0→10735
> tanpa celah, termasuk footer. Penyimpangan dari "12 max" disengaja: 12×821px menyisakan 482px
> terakhir (footer) tidak terobservasi.
>
> **Overlay bukan desain:** cookie banner `position:fixed` 530×151 `#0D0D0D` muncul di 14/14 capture.
> Dikecualikan dari token → `[OVERLAY]`.

---

## ⚠️ Catatan integrity

- `design.md` sebelumnya berisi monolit HTML 1.78MB untuk arah desain **"Nuance Portfolio"**
  (cream `#FCFBF7`, Playfair Display, aksen oranye `#EA580C`) — **bukan** spec midu.design.
  Sudah di-backup ke `design.legacy-nuance-monolith.html`, tidak dihapus.
- **Tidak ada motion reference.** Semua capture diambil saat scroll sudah diam → hanya
  `filter: blur(0px)`, `translateX` runtime, `transform` resting yang teramati.
  **Duration / easing / stagger / arah TIDAK ter-capture.** Butuh rekaman video (Metode B).

---

# BAGIAN 1 — GROUND TRUTH (hasil ekstraksi, tidak diubah oleh restrukturisasi)

## 1.1 Peta section referensi

| ID | Section | y range | h | Background | radius | z-index |
|---|---|---|---|---|---|---|
| **S1** | Hero | 0 – 821 | 821 | `#050505` | 0 | – |
| **S2** | Statement + About | 821 – 2473 | 1652 | `#050505` | 0 | – |
| **S3** | Work / Highlights | 2473 – 4482 | 2009 | `#050505` | 0 | – |
| **S4** | Testimonials | 4482 – 5713 | 1231 | `#050505` | 0 | – |
| **S5** | Tools + Services | 5713 – 7462 | 1749 | **`#E6E6E6`** | **24px** | **2** |
| **S6** | Pricing + FAQ | 7417 – 10025 | 2608 | `#050505` | 0 | **1** |
| **S7** | Footer | 10025 – 10735 | 710 | inherit `#050505` | 0 | – |

> S5 (light, `r=24px`, `z:2`) **overlap 45px** di atas S6 (dark, `z:1`) — sudut bawah S6 terlihat
> lewat radius S5. Layering disengaja, bukan overflow bug.

## 1.2 Font — 3 weight saja

`"Switzer Regular"` (400) · `"Switzer Medium"` (500) · `"Switzer Semibold"` (600) — + varian
`Placeholder` (fallback Framer anti-FOIT), fallback `sans-serif`. **Tidak ada weight 700.**

## 1.3 Type scale terukur (di 1049px)

| Role | size | weight | lh | ls | color | Lokasi |
|---|---|---|---|---|---|---|
| Display XL | **84px** | 500 | 84px (1.0) | **-3.36px** | `#000000` | S5 "Our tools &" / "your brand." |
| Display L | **82px** | 500 | 82px (1.0) | **-3.28px** | `#FFFFFF` / `rgba(255,255,255,0.5)` / `0.6` | S2, S3, S6 |
| Display M | **65px** | 500 | 65px (1.0) | **-2.6px** | `#FFFFFF` + `rgba(255,255,255,0.6)` | S3 "Our highlights." |
| Price | **60px** | 500 | 66px | **-2.4px** | `#FFFFFF` | S6 (akan dihapus) |
| Card title | **32px** | 500 | 35.2px | -0.64px | `#FFFFFF` | H1 hero, "Trusted by…", CTA card, H3 FAQ |
| Card title S5 | **30px** | **600** | 33px | -1.2px | `#000000` | H3 kartu layanan — **satu-satunya Semibold** |
| Quote | **28px** | 500 | 36.4px | **-1.12px** | `rgba(255,255,255,0.5)` + span `#FFFFFF` | S4 (akan dihapus) |
| Work title | **28px** | 500 | 30.8px | -0.56px | `#FFFFFF` | S3 H3 nama project |
| Lead | **24px** | 500 | 31.2px | -0.96px | `rgba(255,255,255,0.4)` + span `#FFFFFF` | S2/S3 |
| Footer tagline | **24px** | 500 | 27.36px | -0.72px | `#FFFFFF` | S7 |
| Micro-title | **20px** | 500 | 22px | -0.4px | `#FFFFFF` | S6 (akan dihapus) |
| Body L | **18px** | 500 | 23.4px | -0.72px | `rgba(255,255,255,0.4)` | S2 sub-para, S3 aside, S5 body hitam |
| Body | **18px** | 400 | 21.6px | -0.54px | `#FFFFFF` | nav label, FAQ toggle |
| Body S | **16px** | 400 | 20.8px | -0.48px | `rgba(255,255,255,0.6)` | S5 body hitam 0.8, footer link |
| Chip label | **14px** | 500 | 15.4px | -0.42px | `rgba(255,255,255,0.8)` | chip work-card, badge plan |
| Caption | **14px** | 400 | 15.4px | -0.28px | `rgba(255,255,255,0.6)` | hero caption, "Explore"/"Socials" |
| Micro | **12px** | 400 | 13px | normal | `rgba(255,255,255,0.6)` | copyright |

### `[CUSTOM EFFECT]` — pola "ghost/dim layer"
Setiap heading besar dibungkus `<mark class="framer-text">` berisi **seluruh teks heading**, berada
`y` **9px lebih atas** dan `x` **100px ke kiri** dari `<h2>` asli, opacity **0.4–0.6**.
Terukur: S3 `MARK y=4373 x=75` vs `H2 y=4482 x=175`; S4 `MARK y=4373` vs span `y=4473 x=175`.
Hipotesis: layer duplikat `position:absolute; pointer-events:none; aria-hidden` yang di-parallax
terhadap scroll. **Jangan disederhanakan jadi `<h2>` polos.**

### `[CUSTOM EFFECT]` — blur per-kata
Tiap kata = `<span>` dengan `filter: blur(0px)` (nilai resting; Framer menganimasikan dari blur
positif). Contoh: H2 82px S2 terbagi **18 span**. Hanya `transform`+`filter` → aman 60fps.

## 1.4 Warna — per-section, TIDAK disatukan

**Dark base**
| Token | Nilai | Asal |
|---|---|---|
| `--bg-dark` | **`#050505`** = `rgb(5,5,5)` | `body` + 5 section block |
| `--surface-01` | `rgba(255,255,255,0.05)` → **#121212** | testimonial card A |
| `--surface-02` | **`rgb(21,21,21)` = #151515** | testimonial card B |
| `--surface-03` | `rgba(21,21,21,0.8)` → **#121212** | pricing card |
| `--surface-04` | `rgba(255,255,255,0.07)` → **#121212** | FAQ item, icon box |
| `--surface-pill` | `rgba(21,21,21,0.8)` | nav Menu pill, CTA "Explore our process" |
| `--cta-01` | `rgba(255,255,255,0.1)` → **#1A1A1A** | CTA "Explore our process", `r=20px` |
| `--cta-02` | **`rgb(255,255,255)` #FFFFFF** | CTA "Get in touch" (solid), `r=20px` |
| `--text-on-solid` | **`rgb(3,3,3)` #030303** | label CTA solid (20.62:1) |
| `--text-dim-40` | `rgba(255,255,255,0.4)` → **#696969** | ❌ **3.71:1 — GAGAL AA** |
| `--text-dim-50` | `rgba(255,255,255,0.5)` → **#828282** | 5.30:1 — PASS |
| `--text-dim-60` | `rgba(255,255,255,0.6)` → **#9B9B9B** | 7.33:1 — PASS |
| `--text-mute-80` | `rgba(255,255,255,0.8)` → **#CCCCCC** | 13.08:1 — PASS |

**Light section (S5) — TERPISAH, wajib di-hard-cut**
| Token | Nilai |
|---|---|
| `--bg-light` | **`rgb(230,230,230)` = #E6E6E6** — `r=24px`, `z-index:2` |
| `--surface-card-light` | **`rgb(255,255,255)` #FFFFFF** — `r=36px` |
| `--surface-icon-light` | **`rgb(230,230,230)` #E6E6E6** — tombol ↗ 40×40, `r=16px` |
| `--text-on-light` | **`rgb(0,0,0)` #000000** (16.83:1) |
| `--text-on-light-60` | `rgba(0,0,0,0.6)` → **#5C5C5C** (5.36:1) |
| `--text-on-light-80` | `rgba(0,0,0,0.8)` → **#333333** (12.63:1) |
| `--text-near-black` | **`rgb(3,3,3)` #030303** |

**Merah — 3 sumber berbeda**
| Token | Nilai | Asal |
|---|---|---|
| `--red-hero` | **bukan CSS** | `<iframe src="https://gradientshader-nine.vercel.app/">` 1049×821, WebGL shader |
| `--red-midu-mask` | `radial-gradient(56% 156% at 47.1% 1.9%, rgba(255,255,255,0) 0%, rgb(217,182,182) 100%)` | dalam `mix-blend-mode:darken` |
| `--red-midu-linear` | `linear-gradient(rgba(143,143,143,0) 0%, rgba(176,125,125,0.33) 100%)` | dalam `mix-blend-mode:darken` |
| `--red-footer` | `linear-gradient(rgba(255,3,0,0) 0%, rgba(255,0,34,0.68) 60%, rgb(255,125,78) 85%)` | wordmark footer, `blend: normal` |
| composited hero | **#D1392A, #DD5C4F, #E4B3AE, #DF9D96** | hasil compositing, bukan nilai sumber |
| red band | **#AD3D2E → #6C2E1C → #8A6A63**, bawah `#0A0706` | **IMAGE** webp 1920×800, `z-index:-1` |
| cream | **#F6ECCD** | kartu "Nova" — bagian dari **gambar** |

## 1.5 Radius scale (semua nilai terpakai)

`1px` (square 4×4) · `14px` (Menu pill) · `16px` (chip, tombol ↗, icon box) · `18px` (tile logo) ·
`20px` (CTA pill) · `24px` (card kerja, FAQ, process img, **section S5**) · `32px` (card besar) ·
`36px` (kartu layanan)

## 1.6 Tiga gutter — jangan diratakan

| Gutter | Content width | Dipakai di |
|---|---|---|
| **40px** | 969px | hero caption, work grid, testimonials, footer |
| **75px** | 900px | heading S2/S3/S6, pricing, FAQ |
| **132px** | 785px | heading + services S5 |

Grid 2-kolum: gutter **20px** (work card 475px, FAQ 440px) · gutter **40px** (kartu layanan 373px).
Padding: `40px` (card besar) · `45px 40px` (kartu layanan) · `24px 28px` (FAQ) · `0 18px` (CTA pill) ·
`0 12px` (chip) · `0 16px` (Menu pill) · section top `80px`.

## 1.7 Navigasi (fixed, lintas section)

- Wrapper `position:fixed`, `z-index:10`, h **80px**, `transform: translateX(-50%)`.
- `HEADER` dalam: `x=20, w=1009, h=45, y=25`, flex / `space-between` / `center`, `z-index:5`,
  **tanpa background, tanpa backdrop-filter** — nav tidak pernah jadi bilah solid.
- Logo `<a>` **70×21** di `x=20,y=37` — **fill ber-invert** putih↔hitam mengikuti tema section.
- Menu pill **95×45** di `x=934,y=25`, `bg rgba(21,21,21,0.8)`, `r=14px`, `padding 0 16px`.
  Komposisi terukur: di atas `#050505` → **#121212**; di atas `#E6E6E6` → **#3F3F3F**.
- Ikon: grid 2×2 kotak **4×4px, gap 2px** (10×10), tiap kotak `r=1px`, `#FFFFFF`.
- Label **"Menu" 18px** `ls -0.54px` `#FFFFFF` (18.26:1). Label **"Close"** di `translateY(-10.8px)`
  → pill 2-state (crossfade).
- Smooth scroll: **Lenis** (`html.lenis.lenis-autoToggle`). Wrapper `min-height:100vh`.

---

# BAGIAN 2 — RESTRUKTURISASI KE PORTFOLIO

## 2.1 Keputusan user

- Goal: **website portofolio** — struktur section generik portfolio.
- **Hapus:** Pricing, Testimonials.
- **Pertahankan:** FAQ, About, Contact, Studies, Project, Certification.
- **Gabung:** Studies + Project → **satu** section "Work / Studies" (keputusan user).
- **Skala:** proporsional dari 1049px.

## 2.2 Mapping section referensi → portfolio (8 section)

| # | Section portfolio | Dari reference | Treatment |
|---|---|---|---|
| **P1** | **Hero** | **S1** (0–821) | 1:1, tanpa perubahan treatment |
| **P2** | **About** | **S2** — 82px statement + 24px two-tone justify + CTA "See my process" | 1:1, teks saja |
| **P3** | **Work / Studies** | **S2** visual 872×577 + **S3** 65px 2-tone + intro + aside + grid 4 kartu | 1:1 (gabungan) |
| **P4** | **Statement transisi** | **S3 akhir** — 82px 2-tone "A partner you can trust…" | jembatan ke light section |
| **P5** | **Certifications** | **S5 atas** — 84px hitam + marquee 12 item | 1:1, **LIGHT** |
| **P6** | **What I do** | **S5 bawah** — 4 kartu putih masonry | 1:1, **LIGHT** |
| **P7** | **FAQ** | **S6 bawah** (9225–10025) | 1:1, 2 kolom, aksi accordion |
| **P8** | **Contact** | **S7** (10025–10735) | 1:1 |
| ❌ | — | **S4** Testimonials (4482–5713) | **DIHAPUS** |
| ❌ | — | **S6 atas** Pricing + red band image (7417–9225) | **DIHAPUS** |

> **Studies + Project digabung jadi satu section** (keputusan user). Visual featured 872×577
> (dari S2) dan grid 4 kartu (dari S3) tidak lagi section terpisah:
> - **P2 About** = statement 82px + teks about 24px + CTA "See my process" (tanpa visual)
> - **P3 Work / Studies** = visual featured 872×577 (pembuka, `r=24px`, scale-on-scroll)
>   → heading 65px 2-tone → intro 24px + aside 18px → grid 4 kartu 2-kolum
>
> Visual featured pindah dari S2 ke P3 agar About tetap murni teks, dan Work punya satu visual
> besar + grid — pola portfolio yang lazim. **Treatment visual tidak berubah sama sekali.**

### `[CUSTOM EFFECT]` — statement transisi (P4)
82px two-tone "A partner you can trust. High standards. Reliable delivery." Originally the S4
heading. Karena S4 dihapus, statement ini dipindah sebagai **jembatan** ke light section P5 —
posisinya tetap sebagai heading terbesar sebelum `#E6E6E6`. Trait: `#FFFFFF` + `rgba(255,255,255,0.5)`,
ghost `<mark>` offset +100px/−9px, blur per-kata.

## 2.3 Konsekuensi penghapusan (harus eksplisit)

| Yang hilang | Dampak |
|---|---|
| **Red band image** (`#AD3D2E→#8A6A63`, 1049×437, `z-index:-1`) | ⚠️ **Merah tersisa 2 momen**: hero (WebGL) + wordmark footer. Kontak: biarkan sebagai bookend atas–bawah, atau tambahkan momen merah ketiga di P3/P7 (bukan dari referensi — perlu persetujuan) |
| Type 60px harga, 20px micro-title, 28px quote, 32px/-1.28px "Trusted by…" | 4 role type jadi tidak terpakai |
| Render 3D keycap (orange vs amber) | 1 `[CUSTOM EFFECT]` hilang |
| Trust-strip gradient `linear-gradient(rgba(21,21,21,0)→rgba(21,21,21,0.6))` | 1 pola scrim hilang — **pola scrim masih ada** di work-card |
| Carousel + dots 8×8 + avatar 60×60 + client logo | 1 `[CUSTOM EFFECT]` hilang; **cacat touch target 8×8 ikut hilang** |
| **theme flip tetap ada** | S5 light (`#E6E6E6`) masih di antara Studies (dark) dan FAQ (dark) ✅ |
| Panjang halaman | 10735 − 1231 (S4) − 1808 (pricing) ≈ **7696px** (−28%) |

## 2.4 `[PERLU VERIFIKASI]` — carried over

| # | Detail | Estimasi terbaik |
|---|---|---|
| 1 | Tinggi frame work-card | 496–554px (terukur 523px saat animasi jalan); rasio ≈ 475×523 |
| 2 | Radius avatar testimonial 60×60 | ≈12px — ** moot, section dihapus** |
| 3 | Warna divider 1px kartu layanan | ≈#E5E5E5 (kemungkinan `border-bottom`) |
| 4 | Chevron box FAQ | svg 14×14 `rgba(255,255,255,0.6)` dalam kotak tanpa bg; radius kotak tidak ter-capture |
| 5 | **Semua nilai animasi** | duration/easing/stagger/arah **TIDAK ter-capture** — butuh video (Metode B) |
| 6 | Inkonsistensi logo saat transisi tema | di `scrollY=5670` logo masih `#FFFFFF` sementara bg sudah `#E6E6E6` → **1.25:1**, nyaris tak terlihat ~40px. Cross-fade atau hard-cut? |
| 7 | Badge pill pricing | bg + radius tidak ter-capture — ** moot, section dihapus** |

## 2.5 Dua cacat aksesibilitas yang harus diperbaiki

| Masalah | Angka terukur | Target |
|---|---|---|
| `--text-dim-40` di dark | **3.71:1** (❌ AA butuh 4.5:1) | naik ke `rgba(255,255,255,0.5)` → **5.30:1** |
| Logo nav putih di section terang | **1.25:1** | hard-cut per section via IntersectionObserver, atau fade 150ms; jangan andalkan hoverscroll |

---

# BAGIAN 3 — SCALING PROPORSIONAL (1049 → 1440)

## 3.1 Faktor

`k = 1440 / 1049 = ` **`1.37274`**

**Keputusan (bisa dibalik 1 variabel):** canvas/layout/radius diskalakan **k** penuh; **type
di bawah 32px diskalakan `√k = 1.1716`** (kompresi). Alasan: skala seragam membuat body 18px →
**24.7px** di 1440 (di atas rentang nyaman 18–20px). Kompresi → **21.1px**, masih proporsional
terhadap canvas. Type ≥32px tetap penuh: 82px → **112.6px**, 84px → **115.3px**.

> **Jika kamu mau skala seragam Penuh**, ganti semua token `--fs-*` < 32px ke `clamp(floor, N*100vw/1049, N*k)`.
> Daftar nilai seragam ada di §3.4.

## 3.2 Type — fluid, curve di-anchor **exact** di 1049 (= nilai terukur) dan 1440 (= nilai berskala)

| Token | @1049 | @1440 | @1024 | @390 | `clamp()` siap-pakai |
|---|---|---|---|---|---|
| `--fs-display-xl` | 84 | 115.3 | 82.0 | 40 | `clamp(40px, 8.008vw, 115.3px)` |
| `--fs-display-l` | 82 | 112.6 | 80.0 | 40 | `clamp(40px, 7.817vw, 112.6px)` |
| `--fs-display-m` | 65 | 89.2 | 63.5 | 32 | `clamp(32px, 6.196vw, 89.2px)` |
| `--fs-card-title` | 32 | 43.9 | 31.2 | 22 | `clamp(22px, 3.051vw, 43.9px)` |
| `--fs-card-title-s5` | 30 | 35.1 | 29.7 | 21.3 | `clamp(21px, 16.19px + 1.317vw, 35.1px)` |
| `--fs-work-title` | 28 | 32.8 | 27.7 | 20 | `clamp(20px, 15.11px + 1.229vw, 32.8px)` |
| `--fs-lead` | 24 | 28.1 | 23.7 | 18 | `clamp(18px, 12.95px + 1.054vw, 28.1px)` |
| `--fs-footer-tagline` | 24 | 28.1 | 23.7 | 18 | `clamp(18px, 12.95px + 1.054vw, 28.1px)` |
| `--fs-micro-title` | 20 | 23.4 | 19.8 | 16 | `clamp(16px, 10.79px + 0.878vw, 23.4px)` |
| `--fs-body-l` | 18 | 21.1 | 17.8 | 17 | `clamp(17px, 9.71px + 0.790vw, 21.1px)` |
| `--fs-body` | 18 | 21.1 | 17.8 | 17 | `clamp(17px, 9.71px + 0.790vw, 21.1px)` |
| `--fs-body-s` | 16 | 18.7 | 16.0 | 16 | `clamp(16px, 8.63px + 0.702vw, 18.7px)` |
| `--fs-chip` | 14 | 16.4 | 13.8 | 13 | `clamp(13px, 7.55px + 0.615vw, 16.4px)` |
| `--fs-caption` | 14 | 16.4 | 13.8 | 13 | `clamp(13px, 7.55px + 0.615vw, 16.4px)` |
| `--fs-micro` | 12 | 14.1 | 11.9 | 11 | `clamp(11px, 6.47px + 0.527vw, 14.1px)` |

> Display (`≥32px`) line-height tetap **1.0**; role <32px memakai `lh` terukur (1.1–1.3).

## 3.3 Letter-spacing — fluid, proporsional ke skala role-nya

| Token | @1049 | @1440 | `calc()` |
|---|---|---|---|
| `--ls-display-xl` | -3.36px | **-4.61px** | `-0.3203vw` |
| `--ls-display-l` | -3.28px | **-4.50px** | `-0.3127vw` |
| `--ls-display-m` | -2.6px | **-3.57px** | `-0.2479vw` |
| `--ls-card-title` | -0.64px | -0.88px | `-0.0610vw` |
| `--ls-card-title-s5` | -1.2px | -1.41px | `-0.647px - 0.0527vw` |
| `--ls-work-title` | -0.56px | -0.66px | `-0.302px - 0.0246vw` |
| `--ls-lead` | -0.96px | -1.12px | `-0.518px - 0.0421vw` |
| `--ls-footer-tagline` | -0.72px | -0.84px | `-0.388px - 0.0316vw` |
| `--ls-body-l` | -0.72px | -0.84px | `-0.388px - 0.0316vw` |
| `--ls-body` | -0.54px | -0.63px | `-0.291px - 0.0237vw` |
| `--ls-body-s` | -0.48px | -0.56px | `-0.259px - 0.0211vw` |
| `--ls-chip` | -0.42px | -0.49px | `-0.227px - 0.0184vw` |
| `--ls-caption` | -0.28px | -0.33px | `-0.151px - 0.0123vw` |
| `--ls-faq-q` | -0.36px | -0.42px | `-0.194px - 0.0158vw` |
| `--ls-work-cat` | -0.32px | -0.37px | `-0.173px - 0.0140vw` |

## 3.4 Layout — proporsional penuh, `calc(N * 100vw / 1049)` (exact di 1049)

| Token | @1049 | @1440 | vw |
|---|---|---|---|
| `--gutter-nav` | 20 | 27.5 | 1.907vw |
| `--gutter-a` | 40 | 54.9 | 3.813vw |
| `--gutter-b` | 75 | 103.0 | 7.150vw |
| `--gutter-c` | 132 | 181.2 | 12.583vw |
| `--grid-gap-tight` | 20 | 27.5 | 1.907vw |
| `--grid-gap-wide` | 40 | 54.9 | 3.813vw |
| `--col-work` | 475 | 652.0 | 45.281vw |
| `--col-narrow` | 440 | 604.0 | 41.945vw |
| `--col-service` | 373 | 512.0 | 35.558vw |
| `--pad-card` | 40 | 54.9 | 3.813vw |
| `--pad-service-y` | 45 | 61.8 | 4.290vw |
| `--pad-faq-y` | 24 | 32.9 | 2.288vw |
| `--pad-faq-x` | 28 | 38.4 | 2.669vw |
| `--pad-pill-x` | 18 | 24.7 | 1.716vw |
| `--pad-chip-x` | 12 | 16.5 | 1.144vw |
| `--pad-menu-x` | 16 | 22.0 | 1.525vw |
| `--section-pad-y` | 80 | 109.8 | 7.626vw |
| `--nav-h` | 80 | 109.8 | 7.626vw |
| `--nav-head-h` | 45 | 61.8 | 4.290vw |
| `--nav-y` | 25 | 34.3 | 2.383vw |
| `--menu-pill-w` | 95 | 130.4 | 9.056vw |
| `--menu-pill-h` | 45 | 61.8 | 4.290vw |
| `--cta-process-w` | 192 | 263.6 | 18.303vw |
| `--cta-process-h` | 48 | 65.9 | 4.576vw |
| `--cta-contact-w` | 151 | 207.3 | 14.395vw |
| `--cta-contact-h` | 48 | 65.9 | 4.576vw |
| `--arrow-btn` | 40 | 54.9 | 3.813vw |
| `--faq-item-h` | 97 | 133.2 | 9.247vw |
| `--hero-h1-w` | 358 | 491.4 | 34.128vw |
| `--process-img-w` | 872 | 1197.0 | 83.127vw |
| `--process-img-h` | 577 | 792.1 | 55.005vw |
| `--work-img-h` | 823 | 1129.8 | 78.456vw |
| `--work-img-offset` | -150 | -205.9 | -14.299vw |
| `--scrim-h` | 140 | 192.2 | 13.346vw |
| `--tile` / `--tile-pitch` | 80 | 109.8 | 7.626vw |
| `--tile-img` | 60 | 82.4 | 5.720vw |
| `--marquee-w` | 969 | 1330.2 | 92.374vw |

**Nilai length eksplisit yang TIDAK diskalakan** (sengaja): `4px` (square ikon), `8px` (jarak antar
menu icon), `10px` (grid ikon 2×2), `14px` (svg check/chevron), `2px` (jarak antar logo marquee).

## 3.5 Radius — proporsional, di-damp geometris (`√(V × V·k)`) supaya tidak membesar berlebihan

| @1049 | linear (k) | **dipakai (damped)** |
|---|---|---|
| 1px | 1.4 | **1.2px** |
| 3px | 4.1 | **3.5px** |
| 14px | 19.2 | **16.4px** |
| 16px | 22.0 | **18.7px** |
| 18px | 24.7 | **21.1px** |
| 20px | 27.5 | **23.4px** |
| 24px | 32.9 | **28.1px** |
| 32px | 43.9 | **37.5px** |
| 36px | 49.4 | **42.2px** |

## 3.6 Touch target setelah skala

| Elemen | @1049 | @1440 | Status |
|---|---|---|---|
| Menu pill | 95×45 | 130.4×61.8 | ✅ |
| CTA process | 192×48 | 263.6×65.9 | ✅ |
| CTA contact | 151×48 | 207.3×65.9 | ✅ |
| Tombol ↗ | 40×40 | 54.9×54.9 | ✅ (**scale rescues it**) |
| FAQ row | 440×97 | 604×133.2 | ✅ |
| ~~Carousel dot~~ | 8×8 | — | ❌ **section dihapus** |
| ~~Select btn~~ | 80×40 | — | ❌ **section dihapus** |

## 3.7 Nilai type jika mau skala seragam penuh (alternatif §3.1)

| Role | @1049 | @1440 seragam | `clamp()` |
|---|---|---|---|
| Display XL | 84 | **115.3** | `clamp(40px, 8.008vw, 115.3px)` |
| Display L | 82 | **112.6** | `clamp(40px, 7.817vw, 112.6px)` |
| Display M | 65 | **89.2** | `clamp(32px, 6.196vw, 89.2px)` |
| Card title | 32 | **43.9** | `clamp(22px, 3.051vw, 43.9px)` |
| Card title S5 | 30 | **41.2** | `clamp(21px, 30 * 100vw/1049, 41.2px)` |
| Work title | 28 | **38.4** | `clamp(20px, 28 * 100vw/1049, 38.4px)` |
| Lead / tagline | 24 | **32.9** | `clamp(18px, 24 * 100vw/1049, 32.9px)` |
| Micro-title | 20 | **27.5** | `clamp(16px, 20 * 100vw/1049, 27.5px)` |
| Body L / Body | 18 | **24.7** | `clamp(17px, 18 * 100vw/1049, 24.7px)` |
| Body S | 16 | **22.0** | `clamp(16px, 16 * 100vw/1049, 22.0px)` |
| Chip / Caption | 14 | **19.2** | `clamp(13px, 14 * 100vw/1049, 19.2px)` |
| Micro | 12 | **16.5** | `clamp(11px, 12 * 100vw/1049, 16.5px)` |

---

# BAGIAN 4 — KOMPONEN PER SECTION PORTFOLIO

## P1 — Hero
```
[absolute z:0] <iframe gradientshader-nine.vercel.app>  1049×821   ← [CUSTOM EFFECT] WebGL
[absolute]     wordmark block  x40 y507 969×294
                 └ mix-blend-mode: color-dodge
                     ├ darken + radial-gradient(rgb(217,182,182)) + mask-image: url(svg wordmark)
                     └ darken + linear-gradient(rgba(176,125,125,0.33))
H1   32px/500/-0.64px/35.2px  #FFFFFF   x462 w358 h106  y160   (wrapper x132 w785)
Row  y471 h15 x40 w969  — justify-between, 3 item
     ├ "…"                 14px/400/-0.28px  rgba(255,255,255,0.6)   x40  w171
     ├ "HH:MM London, UK"  idem (live clock)                          x251 w148
     └ "Scroll to explore ↓" 14px/400/normal/14px rgba(255,255,255,0.4) x890 w101
```
⚠️ **H1 = 32px, bukan 82px.** Token 82px milik H2. Rasa "besar" datang dari wordmark kinetic.

## P2 — About
- **H2 82px/500/-3.28px/82px (lh 1.0)** `#FFFFFF` `x=75 w=900`, 3 baris `y=1061/1143/1225`
  (pitch 82px = 1.0). 18 `<span>` per-kata dengan `filter: blur(0px)`.
- **Paragraf 2-tone 24px** `x=75 w=880` `y=1278 h=312`, base `rgba(255,255,255,0.4)`,
  span `#FFFFFF` weight 500, **`text-align: justify`**.
- Sub-para 18px `rgba(255,255,255,0.4)` `x=75 w=900 y=1521`.
- **CTA "See my process"** 192×48 `x=75 y=1584`, `bg rgba(255,255,255,0.1)` → #1A1A1A,
  `r=20px`, `padding 0 18px`, label 16px/500/-0.48px `#FFFFFF`.
- Section ini **murni teks** — visual featured pindah ke P3.

## P3 — Work / Studies  *(gabungan Studies + Project)*
- **Visual featured** `<img>` **872×577** `x=88 y=1784`, `r=24px`, `overflow:clip`,
  wrapper `transform: matrix(0.931576,0,0,0.931576,0,-54.7389)` → **scale-on-scroll 0.9316→1.0**.
  sebagai pembuka section. Optional scrim + CTA pill `rgba(255,255,255,0.1)` `r=20px`.
- **H2 65px 2-tone** `x=75 w=900`: "**Selected studies.**" `#FFFFFF` +
  "Recent projects…" `rgba(255,255,255,0.6)` → #9B9B9B (`y=2713 / 2778`).
- Intro 24px 2-tone `x=75 w=491 y=2854`; aside 18px Regular `rgba(255,255,255,0.4)`
  `x=690 w=285 y=2963`.
- **Grid 2 kolom** `x=40` & `x=535`, lebar **475px**, gutter 20px.
  - Frame `<a>` `r=24px` `overflow:hidden`, tinggi 523px `[PERLU VERIFIKASI]`,
    baris 1 `y=3177`, baris 2 `y=3720`.
  - **Tanpa card background** — tiap card screenshot produk full-bleed 475×823
    di-`translateY(-150px)` → `[CUSTOM EFFECT]` **image parallax dalam clip rounded**.
  - ⚠️ **Per-item variance — JANGAN diratakan:**
    | Project | Terukur | Nature |
    |---|---|---|
    | (1) | **#181818** | screenshot UI gelap |
    | (2) | **#BFBFBF** + **#121B50** | render terang + kartu biru |
    | (3) | **#F6ECCD** cream | render creamy |
    | (4) | foto | photograph |
  - **Chip** kanan atas: `bg rgba(0,0,0,0.3)` + **`backdrop-filter: blur(5px)`** `r=16px`
    `padding 0 12px` `h=36`, label 14px/500/-0.42px `rgba(255,255,255,0.8)`.
  - **Scrim bawah** `linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)` **475×140**.
  - Teks: H3 **28px**/500/-0.56px/30.8px `#FFFFFF`; kategori 16px/500/-0.32px/19.2px;
    CTA H2 **32px**/500/-0.64px/35.2px.

## P4 — Statement transisi
**H2 82px two-tone** `x=75 w=900 y=4473–4646`: "A partner you can trust." `#FFFFFF` +
"High standards. Reliable delivery." `rgba(255,255,255,0.5)` → #828282 (**5.30:1**).
Ghost `<mark>` + blur per-kata. Berada tepat sebelum light section.

## P5 — Certifications · **LIGHT** `#E6E6E6`, `r=24px`, `z-index:2`
- **H2 84px/500/-3.36px/84px `#000000`** `x=132 w=785`:
  "**Certifications &**" `y=5913` `align:left` · "**tools I master.**" `y=6103` `align:**right**`.
- **Marquee** — `<ul>` 969px `x=-155 y=6022`, `display:flex`, `gap:0`,
  `transform: translateX(-195.396px)` **berubah saat runtime** → **JS marquee, bukan CSS animation**.
  - 12 item (10 badge unik diduplikasi), pitch **80px**. Wrapper **80×80 `r=18px`**, img 60×60.
  - `box-shadow: rgba(0,0,0,0) 0px 8px 13px 0px` → transparan (placeholder Framer).
  - Label 14px/**400**/-0.42px **`rgba(0,0,0,0.6)`** → #5C5C5C, `y=6069`.
  - **Edge fade** kedua sisi (terukur: tile pertama memudar ke #E6E6E6 di `x=30`) → **mask**.
- Body 18px/500/-0.54px **`rgba(0,0,0,0.6)`** `x=172 w=293 y=6275 h=117`.
- CTA "See how I work" 16px/500/-0.48px **`#030303`** di atas pill terang `x=210 y=6426`.

## P6 — What I do · **LIGHT** (lanjutan section yang sama)
2 kolom `x=132` & `x=545`, lebar **373px**, gutter 40px, **staggered masonry** (4 `y` berbeda):

| Card | y | h |
|---|---|---|
| (1) | 6500 | 311 |
| (2) | 6580 | 291 |
| (3) | 6852 | 291 |
| (4) | 6911 | 311 |

- Card: `bg rgb(255,255,255)` **#FFFFFF**, `r=36px`, `padding 45px 40px`,
  `box-shadow rgba(0,0,0,0.05) 0px 8px 20px 0px`.
- H3 **30px/600/-1.2px/33px `#000000`** — satu-satunya Semibold.
- Divider 1px di bawah H3, warna `[PERLU VERIFIKASI]` ≈#E5E5E5.
- Label + body 16px/500/-0.48px **`rgba(0,0,0,0.8)`** → #333333 (12.63:1).
- **Tombol ↗ 40×40** `bg rgb(230,230,230)` #E6E6E6 `r=16px`, absolute bottom-right.
- Container `padding-top: 80px`.

## P7 — FAQ · kembali **dark** `#050505`
- H3 **32px**/500/-0.96px/35.2px `#FFFFFF` "Frequently Asked Questions" `x=75 w=900 y=9225`.
- 2 kolom `x=75` & `x=535`, lebar **440px**, gutter 20px.
- Item **440×97**, `bg rgba(255,255,255,0.07)` → **#121212**, `r=24px`, `padding 24px 28px`.
- Pertanyaan 18px/500/-0.36px/23.4px `#FFFFFF`.
- **Jawaban expanded 16px/500/`ls:normal`/20.8px `rgba(255,255,255,0.6)`, DI LUAR card**
  di `x=103` (indent 28px), `y=9395` dkk.
- Chevron svg 14×14 sisi kanan. Total 9 item (kiri 5, kanan 4+).

## P8 — Contact
- Clock row: glyph "z z" 8×10 + "HH:MM London, UK" 15px, `x=40 y=10025` (live clock).
- Tagline H2 **24px**/500/-0.72px/27.36px `#FFFFFF` `x=40 w=390 h=55 y=10067`.
- **"Get in touch"** `<button>` **151×48** `x=40 y=10202` → pill `bg rgb(255,255,255)` **#FFFFFF**
  `r=20px` `padding 0 18px`, `box-shadow rgba(255,43,43,0) 0px 0px 20px 5px` (glow transparan),
  label 18px/500/-0.54px/19.8px **`#030303`** (20.62:1) + ikon spark 4-point.
- 2 kolom link: label "Explore" `x=40` & "Socials" `x=859`, 14px/400/-0.28px
  `rgba(255,255,255,0.6)` `y=10320`. Link `<a>` **16px/400/-0.48px/16px `#FFFFFF`**, pitch 20px.
- Baris bawah: "© 2026 …, ALL RIGHTS RESERVED" 12–13px `x=40 y=10455`;
  "TERMS" / "PRIVACY POLICY" 12px right `x=922`.
- ⚠️ **Wordmark raksasa** 969×294 `x=40 y=10505` —
  `linear-gradient(rgba(255,3,0,0) 0%, rgba(255,0,34,0.68) 60%, rgb(255,125,78) 85%)`,
  **`mix-blend-mode: normal`** (bukan `color-dodge`), **terpotong dasar dokumen**.
  Terukur **#992322, #641817, #B63731** (merah atas → hitam bawah). `[CUSTOM EFFECT]`

---

# BAGIAN 5 — `[CUSTOM EFFECT]` (untuk fase BUILD)

| # | Efek | Hipotesis implementasi |
|---|---|---|
| 1 | **Red hero** | WebGL/canvas gradient shader dalam `<iframe>` cross-origin. **Tidak bisa diganti CSS gradient** — outputnya bergerak. Perlu `three.js`+shader atau iframe yang sama. **Killswitch mobile.** |
| 2 | **Wordmark kinetic (hero)** | `color-dodge` → `darken` + `mask-image: url(svg wordmark)`; isi radial-gradient `#D9B6B6` + linear-gradient `rgba(176,125,125,0.33)`. |
| 3 | **Blur per-kata** | tiap kata `<span>` `filter: blur(Npx)` → `blur(0px)`. Hanya `transform`+`filter`. |
| 4 | **Ghost/dim layer** | `<mark>` duplikat, offset **+100px x / −9px y**, opacity 0.4–0.6, `aria-hidden`. |
| 5 | **Image parallax dalam card** | `<img>` 475×823 `translateY(-150px)` dalam `<a r=24 overflow:hidden>`. |
| 6 | **Glassmorphism chip** | `rgba(0,0,0,0.3)` + **`backdrop-filter: blur(5px)`**, `r=16px`. |
| 7 | **Scale-on-scroll visual** | `matrix(0.931576,…,-54.7389)` → scrub ke scale 1.0. |
| 8 | **Marquee certifications** | `<ul>` flex + `translateX` runtime (**tanpa CSS animation**), 12 item duplikat, pitch 80px, edge mask. Wajib pause saat hover + `prefers-reduced-motion`. |
 9 | **Hard-cut tema** | P5/P6 light `#E6E6E6` `r=24px` `z:2` di atas dark `z:1`. Bukan transisi gradual. |
| 10 | **Wordmark footer** | wordmark SVG sama, `blend: normal` + gradient merah. |

*(Efek pricing — red band image, keycap 3D, trust-strip scrim — dan testimonial — carousel, dots,
avatar — **dihapus** bersama section-nya.)*

---

# BAGIAN 6 — GERBANG KUALITAS (angka terukur, bukan opini)

**Kontras** (WCAG 2.x, alpha di-kompositasi di atas background lalu relative luminance)
- ❌ `rgba(255,255,255,0.4)` → **#696969** di `#050505` = **3.71:1** — GAGAL AA (butuh 4.5:1). → **wajib dinaikkan ke 0.5 (5.30:1)**
- ✅ `#FFFFFF` di `#050505` = **20.38:1** (AAA)
- ✅ `rgba(255,255,255,0.6)` → #9B9B9B = **7.33:1** (AAA)
- ✅ `rgba(255,255,255,0.5)` → #828282 = **5.30:1** (AA)
- ✅ `#000000` di `#E6E6E6` = **16.83:1** (AAA)
- ✅ `rgba(0,0,0,0.8)` → #333333 di #FFFFFF = **12.63:1** (AAA)
- ✅ `rgba(0,0,0,0.6)` → #5C5C5C di #E6E6E6 = **5.36:1** (AA)
- ✅ `#030303` di `#FFFFFF` = **20.62:1** (AAA)
- ✅ `#FFFFFF` di `#3F3F3F` (Menu pill di light) = **10.4:1**
- ❌ Logo nav `#FFFFFF` di `#E6E6E6` = **1.25:1** — harus di-fix

**Touch target** (min 44×44) — lihat §3.6. Setelah skala, **semua target lolos**;
cacat 8×8 (dots) & 40×40 (Select) hilang bersama section yang dihapus.

**Motion** — hanya `transform` + `opacity` + `filter`. `mix-blend-mode` & `backdrop-filter`
terisolasi per-lapis. Lenis untuk smooth scroll. `prefers-reduced-motion` wajib mematikan
WebGL shader, `color-dodge`, marquee, dan blur per-kata.

**CLS** — semua image punya box eksplisit (872×577, 475×823, 60×60, 14×14, 80×80, 969×294).
