"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/MotionPrimitives";
import { awardEase, fannedCardContainer, fannedCardVariant } from "@/lib/motion";

interface ClientCard {
  id: string;
  tag: string;
  tagColor: string;
  period: string;
  name: string;
  quote: string;
  meta: string;
  bg: string;
  rotate: number;
  offsetX: number;
  offsetY: number;
  zIndex: number;
}

const clientCards: ClientCard[] = [
  {
    id: "bytedance",
    tag: "COLLABORATION",
    tagColor: "text-[var(--token-orange)]",
    period: "2024 – 2025",
    name: "ByteDance",
    quote:
      "YanXin delivered spatial web solutions that redefined our global design benchmarks.",
    meta: "Global Design Ops • Spatial UI",
    bg: "bg-[#151515]",
    rotate: -10,
    offsetX: -120,
    offsetY: 0,
    zIndex: 10,
  },
  {
    id: "st-engineering",
    tag: "ENTERPRISE",
    tagColor: "text-[var(--token-green)]",
    period: "2023 – 2024",
    name: "ST Engineering",
    quote:
      "Unmatched ability to reconcile complex engineering systems with bold artistic impact.",
    meta: "Critical Systems • Wayfinding",
    bg: "bg-[#1c1c1c]",
    rotate: 0,
    offsetX: 0,
    offsetY: -10,
    zIndex: 20,
  },
  {
    id: "mandai",
    tag: "CIVIC • SPATIAL",
    tagColor: "text-[var(--token-yellow)]",
    period: "2023 – 2025",
    name: "Mandai",
    quote:
      "Transformed millions of park visitor experiences through intuitive touchscreen kiosks.",
    meta: "Multi-touch UI • Outdoor Kiosks",
    bg: "bg-[#242424]",
    rotate: 10,
    offsetX: 120,
    offsetY: 0,
    zIndex: 15,
  },
];

export function Clients() {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="zone-black pt-28 pb-16 px-6 md:px-16 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <Reveal delay={0.1}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-white/50 mb-2">
                {"04 // TESTIMONIALS & TRUST"}
              </div>
              <h2 className="heading-section text-white mt-2">
                clients
                <span className="text-[var(--token-orange)] inline-block transform hover:rotate-45 transition-transform duration-300">
                  *
                </span>
              </h2>
            </div>
            <p className="font-body text-white/60 text-base max-w-md leading-relaxed">
              Proud to partner with industry pioneers, tech giants, and visionaries shaping culture worldwide.
            </p>
          </div>
        </Reveal>

        {/* Fanned Interactive Cards Carousel */}
        <div className="fanned-container my-16 select-none relative h-[440px] flex items-center justify-center">
          {shouldReduceMotion ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {clientCards.map((card) => (
                <div
                  key={card.id}
                  className={`w-full p-6 rounded-xl border border-white/15 ${card.bg} flex flex-col justify-between h-[360px]`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`font-mono text-xs font-bold uppercase tracking-wider ${card.tagColor}`}>
                      {card.tag}
                    </span>
                    <span className="font-mono text-xs text-white/40">{card.period}</span>
                  </div>
                  <div>
                    <h3 className="font-display font-black text-3xl text-white">{card.name}</h3>
                    <p className="font-body text-sm text-white/70 mt-3 italic leading-relaxed">
                      &ldquo;{card.quote}&rdquo;
                    </p>
                  </div>
                  <div className="font-mono text-xs text-white/40 border-t border-white/10 pt-3">
                    {card.meta}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              className="relative w-full h-full flex items-center justify-center"
              variants={fannedCardContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              {clientCards.map((card) => {
                const isActive = activeCard === card.id;

                return (
                  <motion.div
                    key={card.id}
                    variants={fannedCardVariant(card.rotate, card.offsetX, card.offsetY)}
                    onMouseEnter={() => setActiveCard(card.id)}
                    onMouseLeave={() => setActiveCard(null)}
                    style={{
                      zIndex: isActive ? 60 : card.zIndex,
                    }}
                    className={`fan-card absolute w-[290px] sm:w-[320px] h-[380px] rounded-xl p-6 flex flex-col justify-between border border-white/15 backdrop-blur-xl ${card.bg} cursor-pointer transition-all duration-300 ${
                      isActive
                        ? "!scale-110 !-translate-y-6 !border-[var(--token-orange)] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
                        : "shadow-2xl"
                    }`}
                  >
                    {/* Card Header */}
                    <div className="flex justify-between items-center">
                      <span
                        className={`font-mono text-xs font-bold uppercase tracking-wider ${card.tagColor}`}
                      >
                        {card.tag}
                      </span>
                      <span className="font-mono text-xs text-white/40">
                        {card.period}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="my-auto">
                      <h3 className="font-display font-black text-3xl text-white">
                        {card.name}
                      </h3>
                      <p className="font-body text-sm text-white/80 mt-3 italic leading-relaxed">
                        &ldquo;{card.quote}&rdquo;
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="font-mono text-xs text-white/40 border-t border-white/10 pt-3">
                      {card.meta}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
