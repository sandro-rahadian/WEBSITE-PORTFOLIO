"use client";

import React from "react";

export function Marquee() {
  const items = [
    { text: "featured work", starColor: "var(--token-orange)" },
    { text: "design systems", starColor: "var(--token-blue)" },
    { text: "art direction • code", starColor: "var(--token-orange)" },
    { text: "spatial interaction", starColor: "var(--token-lime)" },
    { text: "selected cases 2024–2026", starColor: "var(--token-pink)" },
    { text: "high fidelity", starColor: "var(--token-yellow)" },
  ];

  const renderTrackContent = () => (
    <>
      {items.map((item, idx) => (
        <span key={idx} className="mr-12 sm:mr-16 inline-flex items-center">
          <span>{item.text}</span>
          <span
            style={{ color: item.starColor }}
            className="ml-2 inline-block transition-transform duration-300 hover:rotate-90"
          >
            *
          </span>
        </span>
      ))}
    </>
  );

  return (
    <div className="zone-white overflow-hidden border-b border-black/10 py-6 sm:py-8 select-none bg-white">
      <div className="marquee-track heading-section text-black uppercase tracking-tighter text-3xl sm:text-5xl md:text-7xl font-black cursor-default">
        {renderTrackContent()}
        {renderTrackContent()}
      </div>
    </div>
  );
}
