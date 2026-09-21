"use client";

import React from "react";
import { Reveal, WipeHighlight, PopIn } from "@/components/MotionPrimitives";

export function BioParagraph() {
  return (
    <section
      id="about"
      className="zone-cream py-24 md:py-36 px-6 md:px-16 border-b border-black/10"
    >
      <div className="max-w-5xl mx-auto w-full">
        {/* Section Tag */}
        <Reveal delay={0.1}>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--token-orange)]" />
            <span className="font-mono text-xs uppercase tracking-widest text-black/60">
              {}
            </span>
          </div>
        </Reveal>

        {/* The Large Typographic Bio Statement */}
        <div className="font-body text-2xl sm:text-3xl md:text-4xl lg:text-[42px] leading-[1.3] font-normal text-black/90 tracking-tight">
          <Reveal delay={0.2} y={30}>
            <span>I am </span>
            <WipeHighlight className="mr-1">YanXin</WipeHighlight>
            <span>, an independent art director &amp; creative developer. </span>
          </Reveal>

          <Reveal delay={0.35} y={30} className="mt-4">
            <span>I partner with ambitious teams </span>
            <PopIn delay={0.4} className="inline-block align-middle mx-1.5">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-xs font-mono font-bold shadow-md">
                ⚡
              </span>
            </PopIn>
            <span>
              {" "}
              to bridge raw creative experimentation with robust production systems.{" "}
            </span>
          </Reveal>

          <Reveal delay={0.5} y={30} className="mt-4">
            <span>Together, we turn fuzzy concepts into uncompromising, </span>
            <span className="font-serif-italic font-bold text-black border-b border-black/30 pb-0.5">
              precision-crafted
            </span>{" "}
            <span className="inline-block bg-black text-white px-3 py-1 rounded-full text-sm sm:text-base font-mono align-middle tracking-tight shadow-md hover:bg-[var(--token-orange)] hover:text-black transition-colors duration-200">
              .FINAL_FINAL
            </span>{" "}
            <span>digital realities.</span>
          </Reveal>
        </div>

        {/* Bio Supporting Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t border-black/10">
          <Reveal delay={0.6}>
            <div className="font-mono text-xs uppercase tracking-wider text-black/50">
              EXPERIENCE
            </div>
            <div className="font-display font-black text-2xl sm:text-3xl text-black mt-1">
              8+ Years
            </div>
            <div className="font-body text-xs text-black/60 mt-1">
              Design &amp; Creative Dev
            </div>
          </Reveal>

          <Reveal delay={0.7}>
            <div className="font-mono text-xs uppercase tracking-wider text-black/50">
              RECOGNITION
            </div>
            <div className="font-display font-black text-2xl sm:text-3xl text-black mt-1">
              FWA / Awwwards
            </div>
            <div className="font-body text-xs text-black/60 mt-1">
              Site of the Day / Honors
            </div>
          </Reveal>

          <Reveal delay={0.8}>
            <div className="font-mono text-xs uppercase tracking-wider text-black/50">
              STACK
            </div>
            <div className="font-display font-black text-2xl sm:text-3xl text-black mt-1">
              60 FPS
            </div>
            <div className="font-body text-xs text-black/60 mt-1">
              React, WebGL, Motion
            </div>
          </Reveal>

          <Reveal delay={0.9}>
            <div className="font-mono text-xs uppercase tracking-wider text-black/50">
              LOCATION
            </div>
            <div className="font-display font-black text-2xl sm:text-3xl text-black mt-1">
              Global
            </div>
            <div className="font-body text-xs text-black/60 mt-1">
              Singapore / Remote Available
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
