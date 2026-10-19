"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Wordmark from "@/components/Wordmark";
import ShaderLayer from "@/components/ShaderLayer";

const WORDMARK_PARALLAX = 0.4;

export default function Hero() {
  const { scrollY } = useScroll();
  const reduce = usePrefersReducedMotion();
  const wordmarkRef = useRef<HTMLDivElement>(null);

  const wordmarkY = useTransform(scrollY, (y) => y * WORDMARK_PARALLAX);

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", minHeight: 560, background: "var(--bg-dark)" }}
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <ShaderLayer />
      </div>

      <motion.div
        ref={wordmarkRef}
        aria-hidden={false}
        className="absolute z-[1] flex items-center justify-center"
        style={{
          left: "var(--gutter-a)",
          right: "var(--gutter-a)",
          top: "58%",
          /* [INTEGRATION] This `reduce ? undefined : wordmarkY` is the exact
             shape that caused a hydration mismatch: useReducedMotion() is null
             on the server and true on a reduced-motion client, so the two sides
             rendered different `transform` values and React refused the patch.
             usePrefersReducedMotion resolves false during hydration, so both
             sides now render the wordmark motion value. Reduced-motion users
             still get a flat wordmark, one render later. See
             src/hooks/usePrefersReducedMotion.ts. */
          transform: reduce ? undefined : wordmarkY,
          willChange: "transform",
        }}
      >
        <Wordmark variant="kinetic" className="w-full" />
      </motion.div>

      <div className="relative z-[2] flex h-full flex-col justify-between">
        <div
          className="flex justify-center"
          style={{ paddingTop: "calc(var(--nav-h) + var(--section-pad-y))" }}
        >
          <h1
            className="t-card-title m-0 text-center text-white"
            style={{ width: "min(100%, var(--hero-h1-w))" }}
          >
            Build &amp; design APIs that hold up under real production load
          </h1>
        </div>
      </div>
    </section>
  );
}
