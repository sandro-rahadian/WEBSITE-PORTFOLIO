"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/MotionPrimitives";

interface ServiceItem {
  number: string;
  title: string;
  description: string;
  subList: string[];
}

const services: ServiceItem[] = [
  {
    number: "01",
    title: "digital ( ) experiences",
    description:
      "Web applications, multi-device ecosystems, and bespoke platforms engineered for extreme brand distinctiveness and conversion.",
    subList: [
      "01.01 Brand Identity & Systems",
      "01.02 Touchscreen & Physical Kiosks",
      "01.03 WebGL & Generative Art",
      "01.04 Motion Design Systems",
    ],
  },
  {
    number: "02",
    title: "( ) creative execution",
    description:
      "Hands-on art direction, typography styling, and micro-interaction choreographies that turn mundane interactions into signature rituals.",
    subList: [
      "02.01 Art Direction & Concepting",
      "02.02 3D Production Pipelines",
      "02.03 Interactive Prototyping",
      "02.04 Design System Architecture",
    ],
  },
  {
    number: "03",
    title: "code & systems",
    description:
      "Production-ready frontend implementation using modern frameworks, strict token adherence, and 60fps silky smooth animations.",
    subList: [
      "03.01 React / Next.js / Tailwind",
      "03.02 Framer Motion & Lenis",
      "03.03 Performance Optimization",
      "03.04 Accessibility (WCAG AAA)",
    ],
  },
];

export function WhatIDo() {
  return (
    <section className="zone-orange py-24 md:py-36 px-6 md:px-16 border-b border-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <Reveal delay={0.1}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-6">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-black/70 mb-2">
                {"03 // CAPABILITIES & DISCIPLINES"}
              </div>
              <h2 className="heading-section text-black mt-2">
                what i do
                <span className="text-[var(--token-blue)] inline-block transform hover:rotate-45 transition-transform duration-300">
                  *
                </span>
              </h2>
            </div>
            <div className="max-w-md font-body text-black/85 text-base md:text-lg leading-relaxed">
              Bridging the gap between avant-garde visual craft and high-performance production engineering.
            </div>
          </div>
        </Reveal>

        {/* Services Structured List */}
        <div className="divide-y divide-black/80 border-b border-black/80">
          {services.map((service, index) => (
            <Reveal key={service.number} delay={0.15 * (index + 1)} y={20}>
              <div className="service-row group cursor-pointer">
                {/* Number */}
                <div className="font-mono text-2xl font-black text-black">
                  {service.number}
                </div>

                {/* Main Service Content */}
                <div>
                  <div className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-black group-hover:translate-x-1 transition-transform">
                    {service.title}
                  </div>
                  <div className="font-body text-black/80 mt-3 max-w-xl text-base leading-relaxed">
                    {service.description}
                  </div>
                </div>

                {/* Sub-discipline list */}
                <div className="font-mono text-xs sm:text-sm font-semibold text-black/90 space-y-1.5 mt-4 md:mt-0">
                  {service.subList.map((sub, sIdx) => (
                    <div
                      key={sIdx}
                      className="hover:text-white transition-colors duration-150"
                    >
                      {sub}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Live Experiment Lab Link */}
        <div
          id="lab"
          className="mt-16 pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
        >
          <div className="font-mono text-xs text-black/75 uppercase tracking-wider">
            {"EXPERIMENTAL PLAYGROUND // SHADERS, AUDIO, TYPE & WEBDESIGN"}
          </div>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-display font-bold text-sm tracking-wide rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-xl"
          >
            <span>LAUNCH INTERACTIVE LAB (08)</span>
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
