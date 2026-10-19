"use client";

import Experience from "@/components/sections/Experience";

export default function Work() {
  return (
    <section
      id="work"
      className="w-full"
      style={{
        background: "var(--bg-dark)",
        paddingTop: "var(--section-pad-y)",
        paddingBottom: "var(--section-pad-y)",
      }}
    >
      {/* [INTEGRATION] This section is now nothing but the experience timeline.

          Two things were removed from here on request: the "Selected studies.
          Recent projects, shipped and measured." heading with its two streaming
          paragraphs, and the four project cards below it. The timeline already
          reads as the work history, and it pins itself for 200vw, so a static
          grid of case-study cards underneath was competing with the thing this
          section is actually about.

          Earlier still, a ContainerScroll preview of the PDF sat here too and
          went because a timeline is the CV in readable form -- that took
          CvCover.tsx, cv-lightbox.tsx and container-scroll-animation.tsx with it.

          Removing the grid orphaned its local dependencies: WorkShot, Card3D,
          ScrollReveal and the two useStreamText hooks were only ever called
          from this file. Whether each of those modules is still referenced
          elsewhere decides if it stays or goes. */}
      <Experience />
    </section>
  );
}