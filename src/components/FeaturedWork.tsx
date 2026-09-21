"use client";

import React from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/MotionPrimitives";

interface Project {
  id: string;
  client: string;
  year: string;
  title: string;
  subtitle: string;
  editorialDesc: string;
  accentBg: string;
  textColor: string;
  badges: string[];
  disciplines: string[];
  graphicShapes: React.ReactNode;
}

const projects: Project[] = [
  {
    id: "bytedance-jinqiu",
    client: "ByteDance",
    year: "2025",
    title: "Jinqiu Jiayuan",
    subtitle: "Spatial UI • Design Architecture",
    editorialDesc:
      "Next-generation digital interactive workspace for ByteDance. Designed an editorial spatial design system and ultra-responsive real-time dashboard powering enterprise collaboration. Built with sub-millisecond interaction feedback, accessible contrast modes, and a kinetic typography suite.",
    accentBg: "bg-[var(--token-lime)]",
    textColor: "text-black",
    badges: ["React Three Fiber", "WebGL", "Design System"],
    disciplines: ["Art Direction", "Interactive 3D", "Design Tokens"],
    graphicShapes: (
      <>
        <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full border-8 border-black/10 pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-28 h-28 bg-[var(--token-yellow)] rotate-12 pointer-events-none mix-blend-multiply opacity-60 rounded-md" />
      </>
    ),
  },
  {
    id: "independent-leveling",
    client: "Independent",
    year: "2025",
    title: "Leveling Up",
    subtitle: "Interactive Playground • Audio Laboratory",
    editorialDesc:
      "Gamified creative growth portal & sonic laboratory. An experiential web portal blending interactive sound synthesizers, kinetic poster generators, and expressive brutalist micro-interactions. Developed to challenge the monotony of conventional web typography.",
    accentBg: "bg-[var(--token-pink)]",
    textColor: "text-black",
    badges: ["GLSL Shaders", "Canvas 2D", "Sound FX"],
    disciplines: ["Creative Dev", "Web Audio API", "Motion Grammar"],
    graphicShapes: (
      <>
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[var(--token-yellow)] rounded-full mix-blend-multiply opacity-70 pointer-events-none" />
        <div className="absolute bottom-6 right-24 w-32 h-32 border-4 border-black/20 rotate-45 pointer-events-none" />
      </>
    ),
  },
  {
    id: "mandai-wildlife",
    client: "ST Engineering & Mandai",
    year: "2024",
    title: "Mandai Wildlife Kiosks",
    subtitle: "Large-scale Touchscreen • Public Systems",
    editorialDesc:
      "Interactive physical installation with ST Engineering. Spearheaded the user interface architecture for visitor guidance across 126+ park touchpoints. Designed for high footfall outdoors, rapid wayfinding responsiveness, multi-lingual navigation, and ruggedized environmental conditions.",
    accentBg: "bg-[var(--token-blue)]",
    textColor: "text-white",
    badges: ["Kiosk Experience", "Real-time Telemetry", "Accessible Hardware"],
    disciplines: ["Public UI", "Hardware Integration", "Spatial Signage"],
    graphicShapes: (
      <>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[var(--token-orange)] rounded-full mix-blend-screen opacity-50 pointer-events-none" />
        <div className="absolute top-8 right-12 w-24 h-24 border-2 border-dashed border-white/40 rounded-full pointer-events-none" />
      </>
    ),
  },
];

export function FeaturedWork() {
  return (
    <section id="work" className="zone-white py-20 md:py-32 border-b border-black/10">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="space-y-28 md:space-y-36">
          {projects.map((project, index) => {
            const isEven = index % 2 === 1;

            return (
              <article key={project.id} className="project-card group">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Visual Graphic Mockup Canvas */}
                  <div
                    className={`lg:col-span-7 ${
                      isEven ? "order-1 lg:order-2" : "order-1"
                    }`}
                  >
                    <Reveal delay={0.2} y={30}>
                      <div
                        className={`project-media-frame aspect-[16/10] ${project.accentBg} ${project.textColor} p-8 md:p-12 flex flex-col justify-between shadow-xl relative overflow-hidden group-hover:shadow-2xl transition-all duration-500 rounded-lg`}
                      >
                        {/* Top Canvas Row */}
                        <div className="flex justify-between items-start z-10">
                          <span className="bg-black text-white font-mono text-xs px-3 py-1.5 rounded uppercase font-bold tracking-wider">
                            {project.client} • {project.year}
                          </span>
                          <span className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-bold group-hover:scale-110 group-hover:rotate-45 transition-transform duration-300 shadow-md">
                            <ArrowUpRight size={18} />
                          </span>
                        </div>

                        {/* Middle Typography Banner */}
                        <div className="my-auto z-10 py-6">
                          <div className="font-display font-black text-4xl sm:text-6xl tracking-tight leading-none">
                            {project.title.split(" ").map((w, i) => (
                              <React.Fragment key={i}>
                                {w}
                                {i < project.title.split(" ").length - 1 && <br />}
                              </React.Fragment>
                            ))}
                          </div>
                          <div className="font-serif-italic text-xl sm:text-2xl opacity-85 mt-3">
                            {project.subtitle}
                          </div>
                        </div>

                        {/* Bottom Tag Badges inside Canvas */}
                        <div className="z-10 flex flex-wrap gap-2">
                          {project.badges.map((badge, bIdx) => (
                            <span
                              key={bIdx}
                              className="bg-black/10 backdrop-blur-sm font-mono text-xs px-2.5 py-1 rounded font-medium"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>

                        {/* Dynamic Decorative Graphics */}
                        {project.graphicShapes}
                      </div>
                    </Reveal>
                  </div>

                  {/* Project Details Text */}
                  <div
                    className={`lg:col-span-5 flex flex-col justify-center ${
                      isEven ? "order-2 lg:order-1" : "order-2"
                    }`}
                  >
                    <Reveal delay={0.3} y={20}>
                      <div className="font-mono text-xs text-black/50 uppercase tracking-widest mb-2">
                        {`0${index + 1} // CASE STUDY`}
                      </div>
                      <h2 className="font-display font-black text-3xl sm:text-5xl text-black leading-tight tracking-tight">
                        {project.title}
                      </h2>
                      <p className="font-serif-italic text-lg sm:text-xl text-black/70 mt-1 mb-6">
                        {project.subtitle}
                      </p>
                      <p className="font-body text-black/75 text-base leading-relaxed mb-8">
                        {project.editorialDesc}
                      </p>

                      {/* Disciplines Chips */}
                      <div className="flex flex-wrap gap-2 text-xs font-mono mb-8">
                        {project.disciplines.map((disc, dIdx) => (
                          <span
                            key={dIdx}
                            className="px-3 py-1 border border-black/15 rounded-full text-black/80 hover:border-black transition-colors"
                          >
                            {disc}
                          </span>
                        ))}
                      </div>

                      {/* Action Link */}
                      <a
                        href="#contact"
                        className="inline-flex items-center gap-2 font-display font-bold text-sm tracking-wider text-black hover:text-[var(--token-orange)] transition-colors group/link"
                      >
                        <span>VIEW COMPLETE CASE STUDY</span>
                        <ArrowRight
                          size={16}
                          className="transform group-hover/link:translate-x-1.5 transition-transform"
                        />
                      </a>
                    </Reveal>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
