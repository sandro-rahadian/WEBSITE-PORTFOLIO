"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useLenis } from "@/hooks/useLenis";
import { WordReveal, Reveal } from "@/components/MotionPrimitives";
import { awardEase, heroCollageVariant } from "@/lib/motion";

export function Hero() {
  const { scrollTo } = useLenis();
  const shouldReduceMotion = useReducedMotion();

  return (
    <header className="zone-cream min-h-screen relative overflow-hidden flex flex-col justify-between pt-24 pb-16 px-6 md:px-16 border-b border-black/10 select-none">
      {/* Top Meta Row */}
      <Reveal delay={0.1}>
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center text-xs font-mono tracking-wider opacity-60 uppercase">
          <div>Interactive Design &amp; Art Direction</div>
          <div>Singapore • Remote</div>
        </div>
      </Reveal>

      {/* Hero Central Content & Floating Collage */}
      <div className="relative max-w-7xl mx-auto w-full my-auto py-12 flex flex-col items-center justify-center text-center">
        {/* Floating Brutalist Collage Stickers & Visuals */}
        {!shouldReduceMotion && (
          <>
            {/* Collage Item 1: Bottom Left */}
            <motion.div
              variants={heroCollageVariant}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="absolute -bottom-8 left-0 md:left-8 w-28 md:w-44 aspect-square rounded-lg shadow-xl overflow-hidden border border-black/10 hidden sm:block z-0 pointer-events-none"
            >
              <Image
                src="/assets/hero-collage-1.svg"
                alt="Artwork graphic"
                width={200}
                height={200}
                className="w-full h-full object-cover"
                priority
              />
            </motion.div>

            {/* Collage Item 2: Top Left */}
            <motion.div
              variants={heroCollageVariant}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="absolute top-2 left-4 md:left-16 w-24 md:w-36 aspect-[3/4] rounded-lg shadow-lg overflow-hidden border border-black/20 hidden md:block z-0 pointer-events-none"
            >
              <Image
                src="/assets/hero-collage-2.svg"
                alt="Spatial UI preview"
                width={160}
                height={210}
                className="w-full h-full object-cover"
                priority
              />
            </motion.div>

            {/* Collage Item 3: Top Right */}
            <motion.div
              variants={heroCollageVariant}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
              className="absolute top-8 right-4 md:right-12 w-28 md:w-48 aspect-[4/3] rounded-lg shadow-lg overflow-hidden border border-black/15 hidden sm:block z-0 pointer-events-none"
            >
              <Image
                src="/assets/hero-collage-3.svg"
                alt="Kinetic type preview"
                width={220}
                height={160}
                className="w-full h-full object-cover"
                priority
              />
            </motion.div>
          </>
        )}

        {/* Floating Badges */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: -6 }}
          transition={{ delay: 0.6, duration: 0.6, ease: awardEase }}
          className="collage-badge top-2 left-6 md:left-24 z-20"
        >
          { }
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 6 }}
          animate={{ opacity: 1, scale: 1, rotate: 3 }}
          transition={{ delay: 0.7, duration: 0.6, ease: awardEase }}
          className="hidden lg:flex absolute top-10 right-20 px-4 py-2 bg-black text-white font-mono text-xs uppercase tracking-widest rounded shadow-xl z-20"
        >
          SYSTEMS ARCHITECT • 60FPS
        </motion.div>

        {/* Central Typographic Punch */}
        <h1 className="display-hero max-w-6xl mx-auto z-10 select-none">
          <div className="overflow-hidden">
            <WordReveal text="the chaos" delay={0.1} />
          </div>
          <div className="overflow-hidden">
            <WordReveal text="of making" delay={0.25} />
          </div>
          <div className="overflow-hidden">
            <span className="inline-block">
              <WordReveal text="sh" delay={0.4} />
              <motion.span
                initial={{ rotate: 0, scale: 0 }}
                animate={{ rotate: 360, scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                className="text-[var(--token-orange)] inline-block mx-0.5"
              >
                *
              </motion.span>
              <WordReveal text="t real" delay={0.45} />
            </span>
          </div>
        </h1>

        {/* Subtitle Tagline */}
        <Reveal delay={0.5} className="mt-8 max-w-2xl mx-auto">
          <p className="text-lg sm:text-2xl font-light text-black/75 leading-relaxed text-center">
            Building high-fidelity interactive software, bold brand identities,
            and sensory web experiences that refuse to blend in.
          </p>
        </Reveal>

        {/* Action Buttons */}
        <Reveal delay={0.65} className="mt-10 flex flex-wrap items-center justify-center gap-4 z-20">
          <button
            onClick={() => scrollTo("#work")}
            className="px-8 py-4 bg-black text-white font-display font-bold text-sm tracking-wide rounded-full hover:bg-[var(--token-orange)] hover:text-black transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg"
          >
            EXPLORE SELECTED WORKS ↓
          </button>
          <button
            onClick={() => scrollTo("#contact")}
            className="px-8 py-4 border border-black/20 text-black font-display font-bold text-sm tracking-wide rounded-full hover:border-black hover:bg-black/5 transition-all duration-300"
          >
            LET&apos;S TALK
          </button>
        </Reveal>
      </div>

      {/* Bottom Scroll Indicator */}
      <Reveal delay={0.8}>
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center text-xs font-mono tracking-widest opacity-40 uppercase pt-6 border-t border-black/5">
          <span></span>
          <span>SCROLL TO DISCOVER ↓</span>
        </div>
      </Reveal>
    </header>
  );
}
