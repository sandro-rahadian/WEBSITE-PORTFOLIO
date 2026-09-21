"use client";

import React from "react";
import { Reveal } from "@/components/MotionPrimitives";

const logos = [
  { name: "ByteDance", location: "Beijing / Singapore" },
  { name: "ST Engineering", location: "Global" },
  { name: "Mandai", location: "Singapore" },
  { name: "Independent Labs", location: "Worldwide" },
];

export function LogoWall() {
  return (
    <div className="zone-black py-16 px-6 md:px-16 border-t border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center items-center">
            {logos.map((logo, idx) => (
              <div
                key={idx}
                className="group p-4 flex flex-col items-center justify-center cursor-default transition-transform duration-300 hover:scale-105"
              >
                <span className="font-display font-black text-2xl md:text-3xl text-white/70 group-hover:text-white transition-colors duration-200">
                  {logo.name}
                </span>
                <span className="font-mono text-[11px] text-white/30 uppercase tracking-widest mt-1 group-hover:text-[var(--token-orange)] transition-colors">
                  {logo.location}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
