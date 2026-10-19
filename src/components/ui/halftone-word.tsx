"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, type MotionValue } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/* Halftone wordmark heading.
 *
   Rebuilt rather than pasted. The source was a footer component that shipped a
   four-file React 19 registry with a /Users/anthropic/claude-501 path baked into
   its import map and truncated mid-props, so there was nothing to drop in.

   What it does: prints `text` as a field of dots on a canvas. Each dot's radius
   comes from how much of its grid cell the letterform covers, so the type keeps
   its edges at any size -- there is no outline to break when it gets huge. Move
   the pointer across the field and the dots near it part around the cursor on
   springs, warming as they are pushed off their place; click and a shock ring
   runs through the word.

   The one decision inherited from the fill-text heading it replaces: the ink-in
   is SCRUBBED, never triggered. Every dot's radius is a pure function of the
   stage's scroll progress, so scrolling down inks the word in, scrolling up
   un-inks it, and stopping mid-sweep leaves it exactly mid-sweep. There is no
   independent clock to drift out of step with the section or to reset on the
   way back up. The dots sweeping in left-to-right as they grow is the same idea
   the clip-inset sweep had, expressed in dot size instead of a wipe.

   Pointer tracking is on `window`, not on the canvas. The stage renders its
   headline inside a `pointer-events-none` layer so it never steals clicks from
   the certificate cards underneath; putting a listener on the canvas would have
   required handing those events back and putting the lightbox at risk. Reading
   the pointer globally costs one getBoundingClientRect per move and no hit
   testing, and the dots only respond when the cursor is near the field.

   No DOM text is drawn. The canvas is aria-hidden with an sr-only copy of the
   string beside it, exactly as the fill-text heading did -- and as the whole
   scroll stage does, this section is a client component that needs JS anyway. */

const REF_SIZE = 200; /* font size the word's aspect ratio is measured at */
/* tracking-tight, the same -0.025em the stage's h2 carries. */
const TRACKING = "-0.025em";
const LINE_RATIO = 1.18; /* canvas height as a multiple of the font size */
const BASELINE = 0.72; /* baseline as a fraction of that height */
/* 600 not 700: --font-switzer only ships 400/500/600, so a bolder weight would
   be synthesised by the browser and its stems would misreport as coverage. */
const WEIGHT = 600;

/* Pointer physics, in CELLS rather than pixels. The whole field scales with the
   word, so a fixed pixel radius is wrong at both ends: at the old 190px the
   influence swallowed an 85px-tall field entirely and every dot in view was
   shoved at once, which destroys the letterform instead of parting it. These
   are resolved against the measured cell size in resample(). */
const PUSH_R_CELLS = 11; /* how far the cursor reaches, in dot spacings */
const MAX_PUSH_CELLS = 3; /* how far a dot travels at full force */
const SHOCK_PUSH_CELLS = 9; /* a click kicks further than a hover */
const SHOCK_BAND_CELLS = 6;
const SPRING_K = 0.22; /* pull back toward the dot's home position */
const SPRING_DAMP = 0.76;
const SHOCK_SPEED = 1500; /* css px per second */
const SETTLE = 0.08; /* below this total displacement the field is at rest */

const clamp = (v: number, lo: number, hi: number) =>
  v < lo ? lo : v > hi ? hi : v;

const SWEEP = 0.34; /* how much later the right-hand edge inks in */
const RAMP = 0.3; /* width of each dot's own ink ramp */

const BUCKETS = 8; /* warm-mix steps, so fillStyle is not rebuilt per dot */
const TAU = Math.PI * 2;

type RGB = [number, number, number];

function parseColor(input: string, fallback: RGB): RGB {
  const s = input.trim();
  if (s.charCodeAt(0) === 35) {
    const hex = s.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      return [
        parseInt(hex[0] + hex[0], 16),
        parseInt(hex[1] + hex[1], 16),
        parseInt(hex[2] + hex[2], 16),
      ];
    }
    if (hex.length === 6 || hex.length === 8) {
      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
      ];
    }
    return fallback;
  }
  const parts = s.match(/-?\d+(?:\.\d+)?/g);
  if (parts && parts.length >= 3) {
    return [Number(parts[0]), Number(parts[1]), Number(parts[2])];
  }
  return fallback;
}

function buildPalette(ink: string, warm: string): string[] {
  const a = parseColor(ink, [0, 0, 0]);
  const b = parseColor(warm, [255, 62, 40]);
  const out: string[] = [];
  for (let i = 0; i < BUCKETS; i++) {
    const t = i / (BUCKETS - 1);
    out.push(
      `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)} ${Math.round(
        a[1] + (b[1] - a[1]) * t,
      )} ${Math.round(a[2] + (b[2] - a[2]) * t)})`,
    );
  }
  return out;
}

type Shock = { x: number; y: number; r: number; max: number };

type Engine = {
  ctx: CanvasRenderingContext2D | null;
  aspect: number;
  cols: number;
  rows: number;
  cell: number;
  w: number;
  h: number;
  cov: Float32Array;
  ox: Float32Array;
  oy: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  palette: string[];
  ink: number;
  /* resolved from the cell size on every resample */
  pushR: number;
  maxPush: number;
  shockPush: number;
  shockBand: number;
  px: number;
  py: number;
  near: boolean;
  shocks: Shock[];
  raf: number | null;
  visible: boolean;
  last: number;
  reduced: boolean;
  /* Set once the effect has built the loop. The scroll subscription lives
     outside that effect, so this is how a progress change reaches the rAF. */
  kick: (() => void) | null;
};

function blankEngine(): Engine {
  return {
    ctx: null,
    aspect: 10.5,
    cols: 0,
    rows: 0,
    cell: 6,
    w: 0,
    h: 0,
    cov: new Float32Array(0),
    ox: new Float32Array(0),
    oy: new Float32Array(0),
    vx: new Float32Array(0),
    vy: new Float32Array(0),
    palette: buildPalette("#000000", "#ff3e28"),
    ink: 0,
    pushR: 0,
    maxPush: 0,
    shockPush: 0,
    shockBand: 0,
    px: 0,
    py: 0,
    near: false,
    shocks: [],
    raf: null,
    visible: false,
    last: 0,
    reduced: false,
    kick: null,
  };
}

export function HalftoneWord({
  text,
  progress,
  start = 0.31,
  end = 0.42,
  ink = "#000000",
  warm = "#ff3e28",
  overshoot = 1,
  className = "",
}: {
  text: string;
  className?: string;
  /** Scroll progress of the stage this heading lives inside. */
  progress: MotionValue<number>;
  start?: number;
  end?: number;
  /** Dot colour at rest. */
  ink?: string;
  /** Colour a dot warms toward as the pointer pushes it. */
  warm?: string;
  /** How far the type runs past the frame, as a multiple of the fitted width.
      1 fits the box exactly and is the default; going above 1 crops the outer
      letters. */
  overshoot?: number;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine>(blankEngine());
  /* The canvas gets its height from this ratio rather than from a measured
     value, so a resize only re-samples the dot grid -- it never re-lays-out. */
  const [aspect, setAspect] = useState(10.5);
  const reduce = usePrefersReducedMotion();

  useMotionValueEvent(progress, "change", (v) => {
    const e = engineRef.current;
    const span = end - start;
    const t = span <= 0 ? (v >= end ? 1 : 0) : (v - start) / span;
    e.ink = t < 0 ? 0 : t > 1 ? 1 : t;
    /* Reduced motion does not animate the dots in at all -- they are simply
       drawn at full size and the scroll value is ignored. */
    if (e.reduced) return;
    e.kick?.();
  });

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const e = engineRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    e.ctx = ctx;
    e.reduced = reduce;
    e.palette = buildPalette(ink, warm);

    /* Narrowed once. TS drops the null check inside the nested closures below,
       where `canvas` is still typed as possibly null. */
    const cv = canvas;
    const family = getComputedStyle(wrap).fontFamily;

    /* measureAspect: width of the word at REF_SIZE, normalised to a font size
       of 1. Independent of the rendered width, so it is measured once. */
    function measureAspect(font: string): number {
      const probe = document.createElement("canvas").getContext("2d");
      if (!probe) return 10.5;
      probe.font = font;
      if ("letterSpacing" in probe) probe.letterSpacing = TRACKING;
      const w = probe.measureText(text).width / REF_SIZE;
      return w > 0.01 ? w : 10.5;
    }

    function fontAt(size: number): string {
      return `${WEIGHT} ${size}px ${family}`;
    }

    /* resample: paint the word offscreen, then average the alpha of each grid
       cell into a coverage value. That number is the whole trick -- dot radius
       is derived from it, so the letterform survives any scale. */
    function resample(): void {
      if (!e.ctx) return;
      /* offsetWidth/Height, NOT getBoundingClientRect. The stage animates its
         copy layer with `scale` (0.85 -> 1 across the scroll), and the rect is
         the transformed box -- measuring it here baked the field at 0.85 scale
         into a backing store sized for 1, so the dots were drawn small and then
         blown up. The layout box is unaffected by an ancestor transform, which
         is also the box ResizeObserver reports, so the two agree. */
      const w = cv.offsetWidth;
      const h = cv.offsetHeight;
      if (w < 8 || h < 4) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const px = Math.round(w * dpr);
      const py = Math.round(h * dpr);
      cv.width = px;
      cv.height = py;
      e.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      e.w = w;
      e.h = h;

      const size = (w * overshoot) / e.aspect;
      /* Screen pitch, relative to the font size. A switzer semibold stem is
         roughly 0.11em, so 0.055 puts about two dots across a stem: coarse
         enough to read as halftone, fine enough that the letterforms still
         resolve. At the 0.12 this started on, a stem was barely one cell wide
         and the whole word merged into a black smear. */
      const cell = Math.min(7, Math.max(2, size * 0.055));
      const cols = Math.max(1, Math.ceil(w / cell) + 1);
      const rows = Math.max(1, Math.ceil(h / cell) + 1);

      const off = document.createElement("canvas");
      off.width = px;
      off.height = py;
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return;
      o.setTransform(dpr, 0, 0, dpr, 0, 0);
      o.font = fontAt(size);
      if ("letterSpacing" in o) o.letterSpacing = TRACKING;
      o.fillStyle = "#fff";
      o.textAlign = "left";
      o.textBaseline = "alphabetic";
      const tw = o.measureText(text).width;
      o.fillText(text, (w - tw) / 2, h * BASELINE);

      const data = o.getImageData(0, 0, px, py).data;
      const cov = new Float32Array(cols * rows);
      for (let r = 0; r < rows; r++) {
        const y0 = Math.round(r * cell * dpr);
        const y1 = Math.min(py, Math.round((r + 1) * cell * dpr));
        for (let c = 0; c < cols; c++) {
          const x0 = Math.round(c * cell * dpr);
          const x1 = Math.min(px, Math.round((c + 1) * cell * dpr));
          let sum = 0;
          let n = 0;
          for (let y = y0; y < y1; y++) {
            const base = y * px * 4;
            for (let x = x0; x < x1; x++) {
              sum += data[base + x * 4 + 3];
              n++;
            }
          }
          cov[r * cols + c] = n > 0 ? sum / n / 255 : 0;
        }
      }

      /* Ceilings keep the kick from eating the field on a short word: MAX_PUSH
         is capped well under a quarter of the line box, so dots at the top and
         bottom of the frame move without being clipped out of it. */
      e.pushR = clamp(cell * PUSH_R_CELLS, 40, 150);
      e.maxPush = clamp(cell * MAX_PUSH_CELLS, 7, 22);
      e.shockPush = clamp(cell * SHOCK_PUSH_CELLS, 20, 70);
      e.shockBand = clamp(cell * SHOCK_BAND_CELLS, 16, 48);

      e.cell = cell;
      e.cols = cols;
      e.rows = rows;
      e.cov = cov;
      const n = cols * rows;
      e.ox = new Float32Array(n);
      e.oy = new Float32Array(n);
      e.vx = new Float32Array(n);
      e.vy = new Float32Array(n);
    }

    function draw(): number {
      /* returns the largest total displacement still in play, so the caller can
         tell when the field has come to rest */
      if (!e.ctx || !e.cols) return 0;
      const ctx = e.ctx;
      const { cols, rows, cell, cov, w } = e;
      ctx.clearRect(0, 0, e.w, e.h);

      /* 0.52 of the pitch on an offset lattice: dots touch at full coverage
         without the 0.72 a square grid needs, which is what was blobbing the
         strokes together. */
      const maxR = cell * 0.52;
      const rest = e.reduced;
      let motion = 0;

      for (let r = 0; r < rows; r++) {
        /* Every other row shifts half a pitch, so the lattice is hexagonal
           rather than square. Rows of dots sitting in visible lines is the
           giveaway of a naive screen. */
        const stagger = (r & 1) * 0.5;
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const cover = cov[i];
          if (cover <= 0.012) continue;

          const cx = (c + 0.5 + stagger) * cell;
          const cy = (r + 0.5) * cell;
          let tx = 0;
          let ty = 0;

          if (!rest && e.near) {
            const ax = cx - e.px;
            const ay = cy - e.py;
            const d = Math.hypot(ax, ay);
            if (d < e.pushR && d > 0.001) {
              /* quadratic falloff, so the field opens rather than dimples */
              const f = 1 - d / e.pushR;
              const push = f * f * e.maxPush;
              tx += (ax / d) * push;
              ty += (ay / d) * push;
            }
          }

          for (const sh of e.shocks) {
            const ax = cx - sh.x;
            const ay = cy - sh.y;
            const d = Math.hypot(ax, ay);
            if (d < 0.001) continue;
            const band = Math.abs(d - sh.r);
            if (band < e.shockBand) {
              const f = 1 - band / e.shockBand;
              tx += (ax / d) * f * e.shockPush * (1 - sh.r / sh.max);
              ty += (ay / d) * f * e.shockPush * (1 - sh.r / sh.max);
            }
          }

          if (rest) {
            e.ox[i] = 0;
            e.oy[i] = 0;
          } else {
            const nx = (e.vx[i] + (tx - e.ox[i]) * SPRING_K) * SPRING_DAMP;
            const ny = (e.vy[i] + (ty - e.oy[i]) * SPRING_K) * SPRING_DAMP;
            e.vx[i] = nx;
            e.vy[i] = ny;
            e.ox[i] += nx;
            e.oy[i] += ny;
          }

          const ox = e.ox[i];
          const oy = e.oy[i];
          const shift = Math.abs(ox) + Math.abs(oy);
          if (shift > motion) motion = shift;

          /* ink ramp, staggered left to right. rest = full size, so reduced
             motion never sees a sweep at all. */
          const stag = cx / w;
          const u = rest ? 1 : e.ink * (1 + SWEEP) - SWEEP * stag;
          const t = u <= 0 ? 0 : u >= RAMP ? 1 : u / RAMP;
          const swell = t * t * (3 - 2 * t);

          const rad = maxR * Math.sqrt(cover) * swell;
          if (rad < 0.12) continue;

          const warmT = shift / e.maxPush;
          const bucket =
            warmT <= 0 ? 0 : Math.min(BUCKETS - 1, (warmT * BUCKETS) | 0);
          ctx.fillStyle = e.palette[bucket];
          ctx.beginPath();
          ctx.arc(cx + ox, cy + oy, rad, 0, TAU);
          ctx.fill();
        }
      }
      return motion;
    }

    function frame(now: number): void {
      e.raf = requestAnimationFrame(frame);
      const dt = e.last ? Math.min(0.05, (now - e.last) / 1000) : 0;
      e.last = now;

      if (e.shocks.length) {
        for (let k = e.shocks.length - 1; k >= 0; k--) {
          e.shocks[k].r += SHOCK_SPEED * dt;
          if (e.shocks[k].r > e.shocks[k].max) e.shocks.splice(k, 1);
        }
      }

      const motion = draw();
      const busy = motion > SETTLE || e.shocks.length > 0;
      if (!busy) {
        cancelAnimationFrame(e.raf);
        e.raf = null;
        e.last = 0;
      }
    }

    function kick(target: Engine): void {
      if (target.reduced || !target.visible) return;
      if (target.raf === null) {
        target.last = 0;
        target.raf = requestAnimationFrame(frame);
      }
    }

    /* The scroll subscription is registered outside this effect, so it reaches
       the loop through the engine rather than by closure. */
    e.kick = () => kick(e);

    e.aspect = measureAspect(fontAt(REF_SIZE));
    setAspect(e.aspect / (LINE_RATIO * overshoot));
    resample();
    draw();

    /* Fonts are swap-display, so the first paint can sample a fallback face and
       bake the wrong coverage. Re-sample once the real face is in. */
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (cancelled) return;
      resample();
      if (e.reduced) draw();
      else kick(e);
    });

    const ro = new ResizeObserver(() => {
      if (cancelled) return;
      resample();
      if (e.reduced) draw();
      else kick(e);
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(
      ([entry]) => {
        e.visible = entry.isIntersecting;
        /* The stage pins for 250vh. Nothing here should keep a rAF loop alive
           while the field is off screen. */
        if (!entry.isIntersecting && e.raf !== null) {
          cancelAnimationFrame(e.raf);
          e.raf = null;
          e.last = 0;
        } else if (entry.isIntersecting && !e.reduced) {
          kick(e);
        }
      },
      { rootMargin: "120px" },
    );
    io.observe(wrap);

    /* Cursor coords are in visual space; the dot grid is in layout space. Under
       the stage's copy scale those differ by up to 15%, so convert rather than
       subtract, or the field reacts offset from where the pointer actually is. */
    function toLocal(ev: PointerEvent): { x: number; y: number; w: number; h: number } {
      const rect = cv.getBoundingClientRect();
      const k = rect.width > 0 ? cv.offsetWidth / rect.width : 1;
      return {
        x: (ev.clientX - rect.left) * k,
        y: (ev.clientY - rect.top) * k,
        w: cv.offsetWidth,
        h: cv.offsetHeight,
      };
    }

    const onMove = (ev: PointerEvent) => {
      if (e.reduced) return;
      const { x, y, w: lw, h: lh } = toLocal(ev);
      /* Inflate the hit box: the field is sparse, so a dot just outside the box
         is still visibly close to the cursor. */
      const pad = e.pushR;
      const inside = x > -pad && x < lw + pad && y > -pad && y < lh + pad;
      if (!inside) {
        if (e.near) {
          e.near = false;
          kick(e);
        }
        return;
      }
      e.px = x;
      e.py = y;
      e.near = true;
      kick(e);
    };

    const onDown = (ev: PointerEvent) => {
      if (e.reduced) return;
      const { x, y, w: lw, h: lh } = toLocal(ev);
      if (x < 0 || x > lw || y < 0 || y > lh) return;
      e.shocks.push({ x, y, r: 0, max: Math.hypot(lw, lh) });
      kick(e);
    };

    const onLeaveWindow = () => {
      if (!e.near) return;
      e.near = false;
      kick(e);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("blur", onLeaveWindow);
    document.addEventListener("pointerleave", onLeaveWindow);

    return () => {
      cancelled = true;
      e.kick = null;
      if (e.raf !== null) cancelAnimationFrame(e.raf);
      e.raf = null;
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("blur", onLeaveWindow);
      document.removeEventListener("pointerleave", onLeaveWindow);
    };
    /* `ink` and `warm` only reach the palette, which is rebuilt here; `reduce` is
       mirrored onto the engine so the draw loop can branch without re-binding
       every listener. */
  }, [text, ink, warm, overshoot, reduce]);

  return (
    /* The wrapper carries the ref, not the canvas: resample measures the canvas
       but the ResizeObserver watches the wrapper, so a width change on the
       wrapper is caught even while the canvas's own box is being recomputed. */
    <span ref={wrapRef} className={`block ${className}`}>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="block w-full"
        style={{ aspectRatio: String(aspect) }}
      />
      {/* The canvas paints the only visible copy of the string, so the heading
          needs a real one for assistive tech and for anything reading the DOM. */}
      <span className="sr-only">{text}</span>
    </span>
  );
}

export default HalftoneWord;