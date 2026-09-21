import React from "react";
import { NavCorners } from "@/components/NavCorners";
import { Hero } from "@/components/Hero";
import { BioParagraph } from "@/components/BioParagraph";
import { VideoStack } from "@/components/VideoStack";
import { Marquee } from "@/components/Marquee";
import { FeaturedWork } from "@/components/FeaturedWork";
import { WhatIDo } from "@/components/WhatIDo";
import { Clients } from "@/components/Clients";
import { LogoWall } from "@/components/LogoWall";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[var(--token-cream)]">
      {/* 4-Corner Fixed Navigation */}
      <NavCorners />

      {/* ZONE 1: CREAM (Hero, Bio, Sensory Reel) */}
      <div className="zone-cream">
        <Hero />
        <BioParagraph />
        <VideoStack />
      </div>

      {/* ZONE 2: WHITE (Marquee & Featured Work) */}
      <div className="zone-white">
        <Marquee />
        <FeaturedWork />
      </div>

      {/* ZONE 3: SAFETY ORANGE (What I Do / Services) */}
      <div className="zone-orange">
        <WhatIDo />
      </div>

      {/* ZONE 4: BLACK (Clients, Logo Wall & Footer) */}
      <div className="zone-black">
        <Clients />
        <LogoWall />
        <Footer />
      </div>
    </main>
  );
}
