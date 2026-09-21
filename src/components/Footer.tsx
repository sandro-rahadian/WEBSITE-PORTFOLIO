"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/MotionPrimitives";

export function Footer() {
  return (
    <footer id="contact" className="zone-black pt-28 pb-16 px-6 md:px-16 relative">
      <div className="max-w-7xl mx-auto">
        {/* Top CTA Statement */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <Reveal delay={0.1}>
                <div className="font-mono text-xs uppercase tracking-widest text-white/50 mb-4">
                  {"05 // GET IN TOUCH"}
                </div>
                <h3 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl text-white leading-tight tracking-tight">
                  got a project in mind?
                  <br />
                  <span className="font-serif-italic font-normal text-white/80">
                    let&apos;s build something unforgettable.
                  </span>
                </h3>
              </Reveal>

              {/* Email Direct Link */}
              <Reveal delay={0.25} className="mt-10">
                <a
                  href="mailto:fransiscusalessandro.rahadian@gmail.com"
                  className="font-display font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[var(--token-orange)] hover:text-[var(--token-orange-alt)] transition-colors underline decoration-2 underline-offset-8 break-all inline-flex items-center gap-2 group"
                >
                  <span>fransiscusalessandro.rahadian@gmail.com</span>
                  <ArrowUpRight
                    size={36}
                    className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform flex-shrink-0"
                  />
                </a>
              </Reveal>
            </div>

            {/* Availability & Social Links */}
            <div className="lg:col-span-4 flex flex-col justify-end space-y-6">
              <Reveal delay={0.3}>
                <p className="font-body text-white/60 text-sm leading-relaxed">
                  Currently reviewing select commissions, advisory opportunities,
                  and architectural consulting for 2026.
                </p>
                <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-white/80 mt-6">
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--token-orange)] transition-colors inline-flex items-center gap-1"
                  >
                    <span>X / TWITTER</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--token-orange)] transition-colors inline-flex items-center gap-1"
                  >
                    <span>LINKEDIN</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--token-orange)] transition-colors inline-flex items-center gap-1"
                  >
                    <span>GITHUB</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Monumental Footer Signature */}
        <div className="mt-28 pt-16 border-t border-white/10 text-center select-none overflow-hidden">
          <Reveal delay={0.2} y={50}>
            <div className="font-display font-black text-[15vw] leading-none text-white tracking-tighter hover:text-[var(--token-orange)] transition-colors duration-500 cursor-default">
              YanXin
            </div>
          </Reveal>

          {/* Copyright & Meta Credits */}
          <div className="font-mono text-xs tracking-widest text-white/40 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>© 2026 YANXIN ZHANG • ALL RIGHTS RESERVED</div>
            <div>STRICT DESIGN TOKENS • LENIS 60FPS</div>
            <div>SINGAPORE / GLOBAL</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
