"use client";

/* Hydration-safe prefers-reduced-motion.
 *
 * framer-motion's `useReducedMotion()` returns `null` on the server and a
 * boolean on the client. Any component that branches on it DURING RENDER to
 * build inline styles produces a different `style` attribute on the two sides,
 * and React throws:
 *
 *   "A tree hydrated but some attributes of the server rendered HTML didn't
 *    match the client properties."
 *
 * That has bitten four files in this project -- Hero, ScrollReveal, Marquee and
 * stack-spread -- each via a `reduce ? a : b` inside a style prop. The fix is
 * identical everywhere, so it lives here once and they all import it.
 *
 * `useSyncExternalStore` is the right primitive: `getServerSnapshot` runs during
 * SSR and again for the hydration render, so both sides return `false` and the
 * markup matches. The real preference lands on the following render. Users who
 * ask for reduced motion still get it -- it costs one extra render instead of a
 * hydration error plus a discarded attribute patch.
 *
 * The asymmetry is deliberate and unavoidable: the server always renders the
 * motion-allowed branch, because a per-user preference cannot be read at render
 * time. Do not "fix" it by mutating the markup on the client or by suppressing
 * the warning.
 */

import { useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false;
}

/* False on the server AND during hydration, so the markup always matches. */
function getServerSnapshot() {
  return false;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}