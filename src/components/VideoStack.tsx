"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play, Volume2, VolumeX, Sparkles } from "lucide-react";
import { Reveal } from "@/components/MotionPrimitives";
import { awardEase } from "@/lib/motion";

export function VideoStack() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="zone-cream pb-24 md:pb-36 px-6 md:px-16 border-b border-black/10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <Reveal delay={0.1}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-black/60 mb-2">
                {"02 // MOTION & INTERACTIVE REEL"}
              </div>
              <h2 className="heading-section text-black">
                sensory reel<span className="text-[var(--token-orange)]">*</span>
              </h2>
            </div>
            <p className="font-body text-black/70 text-base max-w-md">
              A kinetic montage of spatial interfaces, dynamic typography, and generative interactions crafted over the past 24 months.
            </p>
          </div>
        </Reveal>

        {/* Video Stack Frame & Fanned Stack */}
        <div className="relative w-full max-w-5xl mx-auto aspect-[16/9] bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-black group">
          {/* Background Decorative Fanned Under-Cards */}
          {!shouldReduceMotion && (
            <>
              <motion.div
                initial={{ rotate: 0, opacity: 0 }}
                whileInView={{ rotate: -4, opacity: 0.6 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: awardEase }}
                className="absolute inset-0 bg-[var(--token-orange)] rounded-2xl -z-10 transform origin-bottom-left"
              />
              <motion.div
                initial={{ rotate: 0, opacity: 0 }}
                whileInView={{ rotate: 4, opacity: 0.5 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.22, ease: awardEase }}
                className="absolute inset-0 bg-[var(--token-blue)] rounded-2xl -z-20 transform origin-bottom-right"
              />
            </>
          )}

          {/* Canvas Simulation / Video Screen Content */}
          <div className="relative w-full h-full bg-[#0d0d0d] flex flex-col justify-between p-6 md:p-10 text-white">
            {/* Top Bar inside Video Frame */}
            <div className="flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <span className="inline-block w-3 h-3 rounded-full bg-[var(--token-orange)] animate-pulse" />
                <span className="font-mono text-xs tracking-wider uppercase text-white/80">
                  REEL_2026_4K.MP4
                </span>
              </div>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-mono transition-colors"
                aria-label="Toggle Audio"
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                <span>{isMuted ? "MUTED" : "AUDIO ON"}</span>
              </button>
            </div>

            {/* Center Dynamic Visual Simulation */}
            <div className="my-auto text-center flex flex-col items-center justify-center z-10">
              <div className="relative mb-6">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="pulse-play-button w-20 h-20 md:w-24 md:h-24 rounded-full bg-[var(--token-orange)] text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer shadow-2xl"
                  aria-label={isPlaying ? "Pause Reel" : "Play Reel"}
                >
                  <Play size={32} className="ml-1 fill-black" />
                </button>
              </div>

              <div className="font-display font-black text-2xl sm:text-4xl tracking-tight text-white">
                {isPlaying ? "INTERACTIVE PLAYBACK ACTIVE" : "PLAY SHOWREEL"}
              </div>
              <p className="font-serif-italic text-lg text-white/70 mt-1">
                Spatial UI • Generative Motion • Soundscapes
              </p>
            </div>

            {/* Bottom Telemetry Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end text-xs font-mono text-white/50 border-t border-white/10 pt-4 z-10 gap-2">
              <div className="flex items-center gap-4">
                <span>RES: 3840×2160</span>
                <span>CODEC: AV1</span>
                <span>FPS: 60.0</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--token-lime)]">
                <Sparkles size={13} />
                <span>INTERACTIVE LAB READY</span>
              </div>
            </div>

            {/* Background Graphic Lines / Geometric Shaders Visual */}
            <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
              <div className="w-[600px] h-[600px] rounded-full border border-white/20 animate-spin" style={{ animationDuration: "30s" }} />
              <div className="absolute w-[400px] h-[400px] rounded-full border border-dashed border-[var(--token-orange)]/40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
