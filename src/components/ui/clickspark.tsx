"use client";

import { useCallback, useEffect, useRef } from "react";

export interface ClickSparkProps {
  sparkColor?: string;
  /** [INTEGRATION] spark colour used when the surface under the click is light */
  sparkColorOnLight?: string;
  /** [INTEGRATION] sample the surface under each click and pick a contrast colour */
  autoContrast?: boolean;
  /** [INTEGRATION] luma (0-1) at or above which a surface counts as "light" */
  contrastThreshold?: number;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: string;
  extraScale?: number;
}

// [INTEGRATION] the vendor array grows until sparks expire on their own, which
// a held-down click or a fast user can outrun. Trim to the newest batch.
const MAX_LIVE_SPARKS = 300;

type Rgba = [number, number, number, number];

/** parses rgb()/rgba() -- the only colour syntax getComputedStyle returns here */
function parseRgba(value: string): Rgba | null {
  const m = value.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
  if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) return null;
  return [parts[0], parts[1], parts[2], parts[3] === undefined ? 1 : parts[3]];
}

/** standard source-over compositing, so a translucent panel resolves to what is actually seen */
function over(fg: Rgba, bg: Rgba): Rgba {
  const a = fg[3] + bg[3] * (1 - fg[3]);
  if (a === 0) return [0, 0, 0, 0];
  return [
    (fg[0] * fg[3] + bg[0] * bg[3] * (1 - fg[3])) / a,
    (fg[1] * fg[3] + bg[1] * bg[3] * (1 - fg[3])) / a,
    (fg[2] * fg[3] + bg[2] * bg[3] * (1 - fg[3])) / a,
    a,
  ];
}

/**
 * [INTEGRATION] Resolves the colour actually painted under a point by walking
 * from the hit element up the tree, compositing each translucent layer over the
 * one behind it. Stops as soon as the result is opaque, so it costs a handful of
 * getComputedStyle calls on click and nothing at all otherwise.
 *
 * This page gives an exact answer because every section paints a solid
 * background (#050505 dark, --bg-light #e6e6e6 light); walking up from a click
 * inside the certifications panel lands on its light background, and a click in
 * the hero lands on the dark section behind the WebGL shader. Background-image
 * (gradients) are intentionally not sampled -- the layers behind them are.
 */
function surfaceLumaAt(x: number, y: number): number | null {
  let acc: Rgba = [0, 0, 0, 0];
  let el: Element | null = null;
  try {
    el = document.elementFromPoint(x, y);
  } catch {
    return null;
  }
  while (el && acc[3] < 0.99) {
    const rgba = parseRgba(getComputedStyle(el).backgroundColor);
    if (rgba && rgba[3] > 0) acc = over(acc, rgba);
    el = el.parentElement;
  }

  // [INTEGRATION] An open modal <dialog> paints a ::backdrop across the whole
  // viewport, and a pseudo-element is invisible to elementFromPoint -- so a
  // click during the certificate preview would sample the page behind the
  // backdrop and pick a colour for a surface the user cannot see. The backdrop
  // is in front of the element walk, so it composites over the result.
  const dialog = document.querySelector("dialog[open]");
  if (dialog) {
    const backdrop = parseRgba(getComputedStyle(dialog, "::backdrop").backgroundColor);
    if (backdrop && backdrop[3] > 0) acc = over(backdrop, acc);
  }

  if (acc[3] === 0) return null;
  // Rec.709 luma on sRGB values; good enough for a light/dark threshold and
  // far cheaper than a full linear-light conversion per click.
  return (0.2126 * acc[0] + 0.7152 * acc[1] + 0.0722 * acc[2]) / 255;
}

/*
 * React Bits — ClickSpark (JavaScript + CSS)
 * https://reactbits.dev
 *
 * The spark geometry is the vendor's, unchanged: `sparkCount` rays on an even
 * angular spread, each travelling `ease(progress) * sparkRadius * extraScale`
 * while its line shrinks by `sparkSize * (1 - ease)`, stroked at lineWidth 2.
 *
 * Four integration changes, all about how it mounts:
 *
 * 1. A fixed viewport canvas with a window-level click listener, instead of the
 *    vendor's `position: relative; width/height: 100%` wrapper around
 *    `children`. The vendor shape has to be the sizing parent of whatever it
 *    wraps, so using it site-wide would have meant wrapping page content and
 *    forcing its height. A fixed layer touches no layout, and click coordinates
 *    stay viewport-relative for free.
 *
 * 2. The rAF loop runs only while sparks are alive. The vendor started
 *    `requestAnimationFrame(draw)` on mount and never stopped it, clearing a
 *    full-viewport canvas every frame with an empty array. Here the loop starts
 *    on click and stops the frame the last spark expires, so an idle page costs
 *    nothing -- the same class of issue as the OGL gallery.
 *
 * 3. Canvas is DPR-scaled (capped at 2). The vendor sized `canvas.width` in CSS
 *    pixels, so 2px spark lines render soft on any retina display.
 *
 * 4. Honours the project's `prefers-reduced-motion` contract, like every other
 *    animated component here. The effect is skipped entirely.
 *
 * 5. The spark colour is resolved per click from the surface underneath, and
 *    stored on the spark, so a burst that straddles a light/dark boundary keeps
 *    each ray legible instead of inheriting one colour for all of them.
 */
export default function ClickSpark({
  sparkColor = "#fff",
  sparkColorOnLight = "#000",
  autoContrast = true,
  contrastThreshold = 0.55,
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = "ease-out",
  extraScale = 1.0,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<
    { x: number; y: number; angle: number; startTime: number; color: string }[]
  >([]);
  const rafRef = useRef<number | null>(null);
  const reduceRef = useRef(false);

  // [INTEGRATION] config lives in a ref so the click listener is attached once
  // instead of being torn down and re-added on every prop change.
  const configRef = useRef({
    sparkColor,
    sparkColorOnLight,
    autoContrast,
    contrastThreshold,
    sparkSize,
    sparkRadius,
    sparkCount,
    duration,
    extraScale,
  });
  configRef.current = {
    sparkColor,
    sparkColorOnLight,
    autoContrast,
    contrastThreshold,
    sparkSize,
    sparkRadius,
    sparkCount,
    duration,
    extraScale,
  };

  const easeFunc = useCallback(
    (t: number) => {
      switch (easing) {
        case "linear":
          return t;
        case "ease-in":
          return t * t;
        case "ease-in-out":
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default:
          return t * (2 - t);
      }
    },
    [easing]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let resizeTimeout: ReturnType<typeof setTimeout> | undefined;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 100);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (timestamp: number) => {
      rafRef.current = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cfg = configRef.current;

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= cfg.duration) return false;

        const eased = easeFunc(elapsed / cfg.duration);
        const distance = eased * cfg.sparkRadius * cfg.extraScale;
        const lineLength = cfg.sparkSize * (1 - eased);
        const cos = Math.cos(spark.angle);
        const sin = Math.sin(spark.angle);

        ctx.strokeStyle = spark.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(spark.x + distance * cos, spark.y + distance * sin);
        ctx.lineTo(
          spark.x + (distance + lineLength) * cos,
          spark.y + (distance + lineLength) * sin
        );
        ctx.stroke();
        return true;
      });

      if (sparksRef.current.length > 0) {
        rafRef.current = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    const onClick = (e: MouseEvent) => {
      if (reduceRef.current) return;
      const cfg = configRef.current;

      // [INTEGRATION] pick the contrast colour once per click, not per spark --
      // sampling is the only non-trivial part, and a burst belongs to one spot.
      let color = cfg.sparkColor;
      if (cfg.autoContrast) {
        const luma = surfaceLumaAt(e.clientX, e.clientY);
        if (luma !== null) {
          color =
            luma >= cfg.contrastThreshold ? cfg.sparkColorOnLight : cfg.sparkColor;
        }
      }

      const now = performance.now();
      for (let i = 0; i < cfg.sparkCount; i++) {
        sparksRef.current.push({
          x: e.clientX,
          y: e.clientY,
          angle: (2 * Math.PI * i) / cfg.sparkCount,
          startTime: now,
          color,
        });
      }
      if (sparksRef.current.length > MAX_LIVE_SPARKS) {
        sparksRef.current = sparksRef.current.slice(-MAX_LIVE_SPARKS);
      }
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(draw);
    };

    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("click", onClick);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      sparksRef.current = [];
    };
  }, [easeFunc]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => {
      reduceRef.current = mq.matches;
    };
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] block select-none"
    />
  );
}
