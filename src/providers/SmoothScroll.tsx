"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Accessibility check: Do NOT initialize Lenis if prefers-reduced-motion is enabled
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Buttery smooth lerp momentum without aggressive hijacking
    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
      orientation: "vertical",
      gestureOrientation: "vertical",
      // [cv] the embedded PDF is a native plugin that owns its own wheel
      // events. Lenis's virtual scroll would otherwise swallow them and scroll
      // the page while the user is trying to read the document.
      prevent: (node: HTMLElement) => node.hasAttribute?.("data-lenis-prevent") ?? false,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
