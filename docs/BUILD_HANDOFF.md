# BUILD Handoff — Claude

> Dokumen ini untuk agent Claude yang menjalankan fase **BUILD**.
> Penulisnya (agent sebelumnya) **sengaja tidak menulis kode** — hanya ekstraksi forensik + verifikasi.
> Ground truth = `design.md`. Referensi = `https://midu.design`.

## 0. WAJIB: baca dulu, berurutan

| # | File | Isi |
|---|---|
| 1 | `stitch_prompt_generator.md` | Bagian 6 (Chain-of-Thought), **Bagian 8A Fidelity Gate (PALING DULU)**, Bagian 8 gerbang lain |
| 2 | `UI_UX_technical_dictionary.md` | **Bagian 16** — definisi *Ekstraksi* vs *Interpretasi*, *ground truth*, *per-item variance*, *section-level theme audit* |
| 3 | `design.md` (535 baris) | **Spesifikasi styling yang dieksekusi TEPAT.** 8 section, token absolut, 7 `[PERLU VERIFIKASI]` |
| 4 | **`motion-spec.md`** | **Spesifikasi motion — hasil sampling DOM langsung ke live reference.** Berangka, bukan tebakan |

> ⚠️ **`design.md` vs `motion-spec.md` — bila bertentangan, `motion-spec.md` menang untuk motion.**
> `motion-spec.md` mengoreksi 3 hal di `design.md`: ghost layer **tidak ada**, parallax hero
> **terbesar justru ada**, dan beberapa angka base salah (lihat §7).

Tidak ada `build.md` di repo. `design.md` **tidak memuat literal `{TECH_STACK}`** — stack sudah
diputuskan user: **Next.js, di `src/app`** (lihat §2).

## 1. Aturan Kesetiaan Referensi (dari Bagian 1 generator — tidak bisa ditawar)

`design.md` = ground truth, **bukan** bahan inspirasi. Dilarang:
1. Menyeragamkan `[CUSTOM EFFECT]` jadi CSS generik.
2. Menyamakan variasi per-item (4 kartu Work punya 4 nature visual berbeda).
3. Menambah elemen yang tidak ada di referensi.
4. Menebak warna — semua HEX dari `design.md`.
5. Menyimpulkan satu section = seluruh halaman (tema berubah di tengah: dark → light → dark).
6. Berhenti audit setelah section pertama.

## 2. Output — SUDAH DIPUTUSKAN user

**Stack: Next.js 15 + React 19, di `src/app` yang sudah ada.**
`framer-motion` 12 + `lenis` sudah terpasang di `package.json` — persis yang dibutuhkan
custom effect #5 (scroll-scrub), #7 (scale-on-scroll), #8 (marquee). `useScroll`/`useTransform`
menghasilkan `transform`/`opacity`/`filter` murni, jadi Motion Gate lolos tanpa akrobat.

- Build masuk `src/app/page.tsx` + komponen di `src/components/`.
- **Bukan** satu file HTML tunggal. `specimen.html` di root adalah specimen visual fase
  sebelumnya — **jangan dipakai sebagai template**, hanya bahan banding visual.
- `index.html` di root sudah dikosongkan (specimen di-rename) dan tidak dipakai Next.

## 3. Keputusan user — SELESAI

| # | Isu | Keputusan |
|---|---|---|
| K1 | Tabrakan nama `index.html` | ✅ Specimen → **`specimen.html`**, `index.html` dibebaskan |
| K2 | Stack | ✅ **Next.js, pakai `src/` yang sudah ada** |
| K3 | Timing animasi | ✅ **Terdapat di `motion-spec.md`** — 6 efek terukur, bukan dikarang |

### Yang MASIH perlu diputuskan user (dari `motion-spec.md` §4)

| # | Isu | Data | Catatan |
|---|---|---|---|
| D1 | Kecepatan marquee **1.6 px/s** nyaris tak terlihat | terukur + cross-validated | **Jangan dipercepat diam-diam** — Aturan Kesetiaan Referensi. Butuh persetujuan eksplisit |
| D2 | Rotasi heading light-section: **duration + easing** | **tidak terukur** (rAF ter-throttle di headless) | Efek ini **tidak ada** di `design.md` → mengarang = membuat dari nol |
| D3 | Image parallax work-card | tidak teramati (gambar lazy-load) | Status "tidak teramati", bukan "terbukti absen" |
| D4 | Hover states (CTA work-card, kartu layanan) | belum disampling | — |

## 4. Gerbang Kualitas — jalankan & tampilkan buktinya, failed rows diperbaiki dulu

**8A Fidelity Gate (PALING DULU)** — SUDAH TERISI hasil audit. Verifikasi ulang, jangan percaya buta:

| Section | Warna persis (HEX) dari gambar? | `[CUSTOM EFFECT]` teridentifikasi + hipotesis? | Variasi per-item tercatat? | Elemen tambahan = NOL? |
|---|---|---|---|---|
| **P1** Hero | ✅ `#050505` + 4 sumber merah | ✅ shader WebGL · wordmark `color-dodge`+`darken`+mask · **parallax 0.4** (baru) · **caption parallax 0.2** (baru) | n/a | ✅ |
| **P2** About | ✅ `#050505` | ✅ blur per-kata `4px→0px` · two-tone 24px justify | n/a | ✅ visual dipindah ke P3 |
| **P3** Work/Studies | ✅ `#050505` | ✅ scale-on-scroll `0.9→1.0`/`−80→0` · glass chip `blur(5px)` · scrim · **image parallax TIDAK TERAMATI** (D3) | ✅ 4 kartu: `#181818` · `#BFBFBF`+`#121B50` · `#F6ECCD` · foto | ✅ |
| **P4** Statement | ✅ `#050505` | ✅ blur per-kata · two-tone | n/a | ✅ |
| **P5** Certifications **LIGHT** | ✅ `#E6E6E6` | ✅ marquee **20 item**, pitch 80, **−1.6 px/s** · edge mask · **rotasi heading 5°→0°** (baru) | n/a | ✅ |
| **P6** What I do **LIGHT** | ✅ `#E6E6E6` + `#FFFFFF` | ✅ masonry staggered | ✅ 4 `y` berbeda | ✅ |
| **P7** FAQ | ✅ `#050505` + `#121212` | ✅ accordion | n/a | ✅ |
| **P8** Contact | ✅ `#050505` | ✅ wordmark footer gradient + `blend:normal` | n/a | ✅ |

- [x] Tidak ada nama warna generik — semua HEX/OKLCH
- [x] Semua 8 section diaudit satu-satu, bukan diasumsikan sama dari section pertama
- [x] Semua `[CUSTOM EFFECT]` punya hipotesis implementasi
- [x] **Ghost/dim layer di-refute** — tidak ada di DOM (lihat §7)
- [ ] **User sudah mengonfirmasi tabel ini SEBELUM masuk BUILD** ← satu-satunya kotak kosong

**Design Gate** — nilai absolut; spesifik untuk portofolio ini, bukan template generik.

**Motion Gate** — semua efek terpetakan; hanya `transform`/`opacity`/`filter`; `prefers-reduced-motion` mematikan WebGL shader, `color-dodge`, marquee, blur per-kata.

**Performance Gate** — LCP < 2.5s, INP < 200ms, CLS < 0.1; aset AVIF/WebP + lazy + `srcset`; 60fps; efek berat punya killswitch mobile.

**Accessibility Gate** — kontras AA; fokus keyboard terlihat; semantic HTML + heading hierarchy; touch target ≥ 44px, jarak ≥ 8px.

**Code Gate** — tidak ada `src` placeholder eksternal; tidak ada layout shift dari aset dinamis.

## 5. Dua cacat aksesibilitas yang WAJIB diperbaiki (§2.5)

| Masalah | Angka terukur | Target |
|---|---|---|
| `--text-dim-40` di dark | **3.71:1** ❌ (butuh 4.5:1) | naik ke `rgba(255,255,255,0.5)` → **5.30:1** |
| Logo nav putih di section terang | **1.25:1** ❌ | hard-cut per section via IntersectionObserver, atau fade 150ms — jangan andalkan hoverscroll |

## 6. Angka ground truth (acuan 1049×821 CSS, dpr 2, docH 10735px)

**Type** — Display XL 84/-3.36 · Display L 82/-3.28 · Display M 65/-2.6 · Card title 32/-0.64 · Card title S5 **30/600**/-1.2 · Work title 28/-0.56 · Lead 24/-0.96 · Body L 18/500 · Body 18/400 · Body S 16 · Chip/Caption 14 · Micro 12.
⚠️ **H1 hero = 32px, bukan 82px** — rasa "besar" datang dari wordmark kinetic.
⚠️ **Card title S5 (30px/600) satu-satunya Semibold.**

**Font** — `"Switzer Regular"` 400 · `"Switzer Medium"` 500 · `"Switzer Semibold"` 600. **Tidak ada weight 700.**

**Warna dark** — `#050505` · surface `#121212`/`#151515` · CTA `#1A1A1A` · solid `#FFFFFF` · label-on-solid `#030303` · dim-40 `#696969`❌ · dim-50 `#828282` · dim-60 `#9B9B9B` · mute-80 `#CCCCCC`.

**Warna light (P5/P6)** — bg `#E6E6E6` `r=24px` `z:2` · card `#FFFFFF` `r=36px` · icon-btn `#E6E6E6` `r=16px` · teks `#000000` · teks-60 `#5C5C5C` · teks-80 `#333333` · near-black `#030303`.

**Tiga gutter — jangan diratakan** — `40px` / `75px` / `132px`. Grid 2-kolom: gutter `20px` (Work 475, FAQ 440) · `40px` (service 373).

**Radius** — 1 · 14 · 16 · 18 · 20 · 24 · 32 · 36 px (semua terpakai).

**Scaling 1049→1440** — `k = 1.37274`; type <32px dikompres `√k = 1.1716`; type ≥32px penuh; layout penuh; radius di-damp geometris. Tabel `clamp()` siap-pakai di `design.md` §3.2–3.5.

## 7. `[CUSTOM EFFECT]` — SETELAH motion sampling. **9 efek, bukan 10**

> `design.md` §5 menyebut 10. Sampling DOM proving falsified #4 dan menemukan 3 yang
> tidak tercatat. Semua motion diambil dari `motion-spec.md` §5.

| # | Efek | Status | Nilai terukur |
|---|---|---|---|
| 1 | **Red hero** — WebGL gradient shader | ✅ perlu three.js+shader atau iframe `gradientshader-nine.vercel.app` | **killswitch mobile** |
| 2 | **Wordmark kinetic (hero)** | ✅ | `color-dodge` → `darken` + `mask-image: url(svg wordmark)`, isi radial `#D9B6B6` + linear `rgba(176,125,125,0.33)` |
| 3 | **Blur per-kata** | ✅ **TERUKUR** | `blur(4px)→blur(0px)`, scroll-linked, **stagger 25px scroll/kata**, 11 span |
| 4 | ~~Ghost/dim layer~~ | ❌ **DIREFUTE** | Lihat §7.1 |
| 5 | **Parallax hero (wordmark)** | 🆕 **BARU** | `translateY(0.4 × scrollY)` |
| 6 | **Parallax baris caption** | 🆕 **BARU** | `translateY(0.2 × scrollY)` |
| 7 | **Scale-on-scroll visual** | ✅ **TERUKUR** | `scale 0.9→1.0`, `ty −80→0`, linear, p=0@1300 → p=1@2315 |
| 8 | **Glassmorphism chip** | ✅ | `rgba(0,0,0,0.3)` + `backdrop-filter: blur(5px)` `r=16px` |
| 9 | **Marquee certifications** | ✅ **TERUKUR** | 20 item, pitch 80, **−1.6 px/s**, loop 1600px, edge mask. Pause saat hover + `prefers-reduced-motion` |
| 10 | **Rotasi heading light** | 🆕 **BARU** | `rotate(5deg → 0deg)` saat masuk viewport. **Waktu, bukan scroll.** Duration/easing TIDAK terukur → D2 |
| 11 | **Hard-cut tema** | ✅ | P5/P6 `#E6E6E6` `r=24px` `z:2` di atas dark `z:1`. Bukan transisi gradual |
| 12 | **Wordmark footer** | ✅ | `blend: normal` (BUKAN color-dodge) + `linear-gradient(rgba(255,3,0,0) 0%, rgba(255,0,34,0.68) 60%, rgb(255,125,78) 85%)`, terpotong dasar dokumen |
| — | ~~Image parallax work-card~~ | ⚠️ **TIDAK TERAMATI** | Lihat §7.2 |

### 7.1 ❌ Ghost/dim layer — refute `design.md` §1.3

`design.md` menghipotesiskan layer duplikat `opacity 0.4–0.6`, offset `+100px/−9px`. Hasil ukur:

```
<mark class="framer-text">  →  DI DALAM <h2>   position: static
opacity: 1   color: #FFFFFF   mix-blend-mode: normal   transform: none
```

`opacity` = **1**, bukan 0.4–0.6. Warna identik, tanpa blend, tanpa transform. Offset `dy=−119px`
adalah **artefak bounding box elemen inline multi-baris**, bukan offset desain (`dx` juga 0,
bukan +100px seperti tertulis). **Jangan implementasikan efek ini** — akan menambah elemen
yang tidak ada di referensi (melanggar Aturan Kesetiaan Referensi). Warna two-tone
`rgba(255,255,255,0.5/0.6)` yang tercatat **tetap benar** — itu pewarnaan span di dalam heading.

### 7.2 ⚠️ Image parallax work-card — "tidak teramati", bukan "terbukti absen"

Subtree 4 work-card (475×523, r=24 — **sisanya cocok persis**) hanya berisi: satu `div` ber-`linear-gradient`
(scrim, sesuai desain) dan satu `div` `matrix(0,0,0,0,0,0)` (CTA hover-reveal). **Tidak ada
descendant dengan `translateY(−150px)`.** Tapi gambar work-card masih **lazy-load**
(`naturalWidth` 0), jadi elemen parallax-nya bisa jadi belum ter-mount → lihat D3.

## 8. Variasi per-item yang WAJIB dipertahankan

**4 kartu Work** — jangan disamaratkan:
(1) `#181818` screenshot UI gelap · (2) `#BFBFBF` + `#121B50` render terang + kartu biru · (3) `#F6ECCD` cream · (4) foto.

**4 kartu What I do** — masonry **staggered**, 4 `y` berbeda (6500 / 6580 / 6852 / 6911), tinggi 311 / 291 / 291 / 311. Bukan grid rata.

## 9. Nav (fixed, lintas section)

Wrapper `fixed` `z:10` h **80px** `translateX(-50%)`. `HEADER` `x=20 w=1009 h=45 y=25`, **tanpa background, tanpa backdrop-filter** — nav tidak pernah jadi bilah solid. Logo 70×21, fill ber-invert mengikuti tema section. Menu pill 95×45 `x=934 y=25` `bg rgba(21,21,21,0.8)` `r=14px`. Ikon: grid 2×2 kotak 4×4px gap 2px, `r=1px`. Label "Menu" 18px, "Close" di `translateY(-10.8px)` → pill 2-state crossfade. Smooth scroll: **Lenis** (`html.lenis.lenis-autoToggle`).

## 10. Aset Stitch (sudah diunduh, tidak perlu MCP)

`stitch_neo_grotesque_editorial_portfolio/` → `code.html` (77 KB) + `screen.png` (10.8 MB). Zip asli: `stitch_neo_grotesque_editorial_portfolio.zip`.

Struktur Stitch: `#hero` · `#about` · `#work` · `#statement` · `#light-zone` (P5+P6 memang satu section light) · `#faq` · `<footer id="contact">` — **selaras dengan 8 section `design.md`**.

Sudah terpasang di output Stitch: `color-dodge`, `darken`, `mask-image`, `backdrop-filter: blur(5px)`, `prefers-reduced-motion`, `mix-blend-mode`, `IntersectionObserver`, `translateX`. Font: Switzer 400/500/600 via Fontshare. Aset: inline SVG data-URI, **tanpa `src` placeholder eksternal**.

**Belum terpasang:** `gradientshader` iframe (efek #1) dan `@keyframes` (0).

> Catatan: API Stitch membalas *"no account available"* — butuh auth. Tidak relevan untuk build; aset sudah lokal.

## 11. CLS

Semua image wajib punya box eksplisit: 872×577 · 475×823 · 60×60 · 14×14 · 80×80 · 969×294.

## 12. Urutan kerja (Chain-of-Thought Bagian 6)

1. **Dapatkan konfirmasi user untuk tabel 8A** (§4) + keputusan D1–D4 (§3)
2. Build **inkremental** ke `src/app`: satu section per satu, berhenti untuk review tiap selesai
3. Terapkan `motion-spec.md` §5 — Rumus — jangan menebak angka motion
4. Jalankan gerbang Bagian 8 → tampilkan checklist + bukti
5. Perbaiki baris gagal **sebelum** bilang selesai

## 13. Referensi ASCII/visual

`specimen.html` — specimen visual fase sebelumnya (47 KB). **Bukan template**, hanya bahan
banding token. Buka di browser untuk screenshot, tapi jangan tiru strukturnya: ia specimen
token, bukan 8 section portfolio.

`_stitch-captures/` — 14 screenshot (1049×821 @ dpr 2) + 14 raw JSON computed-style + `tokens.json`.
**Ground truth styling** untuk cross-check hasil build.
