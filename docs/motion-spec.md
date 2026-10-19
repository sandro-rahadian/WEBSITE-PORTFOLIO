# motion-spec.md —Hasil Metode B (DOM sampling langsung ke live reference)

> **Metode.** Bukan rekaman video. Reference `https://midu.design` **masih hidup**, DOM-nya
> di-sample langsung di **1049×821 CSS, dpr 2** (viewport acuan yang sama dengan `design.md`),
> `scrollHeight` 10734 (design.md: 10735).
> Framer Motion menulis nilai interpolasi asli ke computed style → **angka di bawah ini hasil
> baca, bukan tebakan.**
>
> **Status tiap nilai:** `[TERUKUR]` = angka pasti dari DOM · `[TERUKUR-SHAPE]` = kurva pasti,
> parameter turunan belum · `[TIDAK TERUKUR]` = terbukti ada tapi tidak bisa diukur di sini.

---

## 1. Motion yang TERUKUR — scroll-linked (bukan waktu)

### 1.1 Blur per-kata `[TERUKUR]` — koreksi besar atas `design.md`

| | Nilai |
|---|---|
| Properti | `filter: blur()` per `<span>` |
| **Range** | **`blur(4px)` → `blur(0px)`** |
| Sifat | **scroll-linked** (bukan animasi waktu) |
| Stagger | **≈ 25px scrollY per kata** |
| Bentang total | 4px → 0px sepanjang **≈ 720px scroll** |
| Bentuk kurva | ease-out (cepat di awal, melambat di akhir) |
| Jumlah span | H2 82px S2 = **11 span** — `design.md` menulis 18, **koreksi** |

Bukti (blur span-0, H2 82px y=1061):

```
scrollY    0 → 4.000      900 → 2.4275     1061 → 0.6376
         600 → 3.8937    1000 → 1.3567     1100 → 0.1884
                        1200 → 0.0261     1400 → 0
```

Stagger diukur dari selisih antar-span pada segmen steepest (y 1000→1100):
`Δblur` antar span ≈ 0.284–0.297px; `d(blur)/d(scroll)` = 0.01168 per px
→ **lag = 0.29 / 0.01168 ≈ 25px scrollY per kata.**

> Menghapus `design.md` §1.3 yang menyebut `filter: blur(0px)` sebagai satu-satunya state —
> **`blur(0px)` cuma state akhir p=1; state awal其实 `blur(4px)`.**

### 1.2 Scale-on-scroll visual featured `[TERUKUR]`

Wrapper `div` di dalam frame 872×577 (dokumen y=1784, tinggi 577).

| Properti | p=0 | p=1 | Rumus |
|---|---|---|---|
| `scale` | **0.9** | **1.0** | `0.9 + 0.1p` |
| `translateY` | **−80px** | **0** | `−80 + 80p` |

`p` **linear** terhadap `scrollY`:

```
p = 0.000985 · scrollY − 1.280
p = 0  pada scrollY = 1300
p = 1  pada scrollY = 2315          rentang = 1015px
```

**Cross-validation:** `design.md` merekam `matrix(0.931576,…,−54.7389)` → p = 0.3158.
Model ini memberi y = (0.3158+1.280)/0.000985 = **1619** — konsisten dengan rentang di atas.
Jadi angka `design.md` **bukan** state statis, melainkan cuplikan tengah-scrub. Konsisten.

### 1.3 Parallax hero — DUA efek, tidak tercatat di `design.md`

| Elemen | Ukuran | Transform | Faktor |
|---|---|---|---|
| Wordmark block hero | 1049×821 | `translateY(0.4 × scrollY)` | **0.4** |
| Baris caption hero | 969×15 | `translateY(0.2 × scrollY)` | **0.2** |

Terverifikasi di 6 titik (1200→480, 2000→800, 3200→1280, 4400→1760, 6100→2440, 6600→2640)
— **persis 0.4 dan 0.2 tanpa deviasi.** Geser horizontal `−524.5px` konstan (centering),
bukan motion.

> `design.md` Bag 4 P1 hanya menyebut "wordmark block" sebagai elemen statis. **IA DIANIMASI.**

### 1.4 Marquee certifications `[TERUKUR]`

| | Nilai |
|---|---|
| Sifat | **waktu** (translateX berubah tanpa scroll) |
| Kecepatan | **−1.6 px/s** ke kiri |
| Jumlah item | **20** (`design.md` menulis 12 — **koreksi**) = 10 unik ×2 |
| Pitch | **80px** |
| Loop mulus | 1600px (set ke-2 di-offset `translateX(1600px)`) |
| Durasi 1 putaran | 1600 / 1.6 = **1000s** |

Bukti_velocity: x = −93.532 (t=504ms) → −95.132 (t=1505ms) = **−1.600px / 1001ms**.
Cross-validation: `design.md` merekam `translateX(−195.396px)` dan aku ukur `−808.872px`;
`808.872 / 1.6 = 505.5s` ≈ umur tab saat itu diukur. Konsisten.

> ⚠️ **1.6 px/s sangat lambat** — 1.6px/detik, mustahil kasatmata. dua kemungkinan: (a)确实
> disengaja oleh desainer, (b) bug di situs referensinya. **Tidak aku ubah** — Aturan Kesetiaan
> Referensi melarang diam-diam "memperbaiki". **Butuh keputusan user** (lihat §4).

### 1.5 Menu pill 2-state `[TERUKUR]`

`translateY(−10.8008px)` — **membuat validasi ulang** angka `design.md` §1.7 ("−10.8px").
State label "Close"抬 ke atas, "Menu" di 0 → crossfade. Nilai ini **dikonfirmasi**, bukan dugaan.

---

## 2. Motion TERBUKTI ADA tapi tidak bisa diukur

### 2.1 Rotasi heading light-section `[TERUKUR-SHAPE]`

| | Nilai |
|---|---|
|Efek | heading 84px "Certifications & tools I master." **berotasi 5° → 0°** |
| Sifat | **WAKTU (entrance), terbukti bukan scroll-linked** |
| Bukti | scroll dikunci di y=5400 → sudut 4.322° (t=83–1042ms) → **0°** (t≥1122ms). Berubah tanpa scroll. |
| Duration | `[TIDAK TERUKUR]` |
| Easing | `[TIDAK TERUKUR]` |

Bentuk kurva saat masuk viewport (scroll turun, sampel tiap 25px):
`5325→4.595° · 5500→1.523° · 5600→0.594° · 5700→0.156° · 5800→0°` (ease-out).

**Kenapa duration/easing tidak terukur:** tab headless **throttle rAF** saat tidak aktif
membuat/menggambar. Lompatan 4.322°→0° terjadi dalam satu celah sampel 80ms — artinya
-Framer hanya dapat Advances frame-nya secara sporadik. Kurva di atas **terkontaminasi
kecepatan frame**, jadi **tidak boleh dipakai sebagai duration/easing.**

**Batas jujur:** efek ini **tidak tercatat sama sekali** di `design.md`, jadi mengarang
duration-nya = membuat efek dari nol. Perlu keputusan user (§4).

### 2.2 Elemen tersembunyi yang belum teridentified

| Elemen | Keadaan terukur | Arti |
|---|---|---|
| `div` di 4 work-card | `matrix(0,0,0,0,0,0)` (scale 0) | CTA hover-reveal, tidak pernah tampil diam |
| 5× `div` label marquee | `matrix(0.9,…,-34.207)` **opacity 0** | label kredensial mati/tidak tampil |
| 4 work-card image | **`naturalWidth` 0** (belum lazy-load) | belum bisa diukur |

---

## 3. Yang DIREFUTE / TIDAK DITEMUKAN — koreksi atas `design.md`

### 3.1 ❌ Ghost/dim layer — TIDAK ADA (refute `design.md` §1.3 & efek #4)

`design.md` menghipotesiskan ada layer duplikat ber-`opacity 0.4–0.6`, offset `+100px/−9px`.
Pengukuran langsung:

```
<mark class="framer-text">  →  di DALAM <h2>  (mark inside h2: true)
position: static   opacity: 1   color: #FFFFFF   mix-blend-mode: normal   transform: none
```

- `opacity` terbaca **1**, bukan 0.4–0.6 → **tidak ada ghost layer**.
- `color` identik dengan h2, tanpa blend, tanpa transform, position static.
- Offset yang terukur (`dy = −119px`, `dx = 0`) adalah **artefak bounding box elemen inline
  multi-baris** — `<mark>` membungkus 3 baris, `getBoundingClientRect()`-nya tidak sama
  dengan box block `<h2>`. **Bukan offset desain.**
- `design.md` juga salah arah: menyebut `+100px` ke kiri, padahal `dx = 0`.

**Konsekuensi:** jumlah `[CUSTOM EFFECT]` turun dari **10 → 9**. Warna two-tone
(`rgba(255,255,255,0.5/0.6)`) yang tercatat tetap **benar** — itu pewarnaan span di dalam
heading, bukan layer terpisah.

### 3.2 ⚠️ Image parallax work-card — TIDAK DITEMUKAN (efek #5)

`design.md` §4 P3 menyebut `<img>` 475×823 `translateY(−150px)` dalam clip r=24.
Subtree 4 work-card (475×523, r=24 — **sisanya cocok persis**) hanya berisi:
1. satu `div` dengan `background-image: linear-gradient(...)` → itu scrim bawah, sesuai desain;
2. satu `div` `matrix(0,0,0,0,0,0)` → CTA hover-reveal.

**Tidak ada descendant yang membawa `translateY(−150px)`.**

**Batas jujur:** gambar work-card adalah **lazy-load** dan `naturalWidth` masih 0 saat
di采样 — bisa jadi elemen parallax-nya memang ada tapi belum ter-mount. Jadi statusnya
**"tidak teramati"**, bukan **"terbukti absen"**. Butuh capture ulang setelah scroll
diam-diam di area itu.

---

## 4. Keputusan yang perlu diambil user

| # | Isu | Data | Opsi |
|---|---|---|---|
| 1 | Kecepatan marquee **1.6 px/s** nyaris tak terlihat | terukur, cross-validated | (a) follow persis, (b) percepat — **butuh persetujuan eksplisit** |
| 2 | Rotasi heading light-section: durasi + easing | **tidak terukur** (rAF throttle) | (a) pilih sendiri & tulis di sini, (b) rekam screen-roll → Metode B penuh |
| 3 | Image parallax work-card | tidak teramati (lazy-load) | (a) abaikan, (b) capture ulang area itu |
| 4 | Hover states (CTA work-card, kartu layanan) | belum disampling | (a) tanningatkan, (b) disampling via hover sintetis |

---

## 5. Ringkasan angka untuk implementasi

```js
// hero parallax — scroll-linked, faktor persis
wordmarkHero.style.transform = `translate3d(0,${scrollY * 0.4}px,0)`
captionRow.style.transform  = `translate3d(0,${scrollY * 0.2}px,0)`

// scale-on-scroll visual featured — linear, p=0@1300 p=1@2315
const p = clamp((scrollY - 1300) / 1015, 0, 1)
wrap.style.transform = `scale(${0.9 + 0.1 * p}) translate3d(0,${-80 + 80 * p}px,0)`

// blur per-kata — scroll-linked, stagger 25px scroll per kata
span_i.style.filter = `blur(${4 * (1 - clamp((scrollY - 530 - i * 25) / 720, 0, 1))}px)`

// marquee — waktu, 20 item, pitch 80, loop 1600px
track.style.transform = `translate3d(${-(elapsed * 1.6) % 1600}px,0,0)`
```
