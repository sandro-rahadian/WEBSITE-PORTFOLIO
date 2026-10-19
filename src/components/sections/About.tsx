"use client";

import ScrollReveal from "@/components/ScrollReveal";
import { useStreamText } from "@/hooks/useStreamText";

export default function About() {
  const leadRef = useStreamText<HTMLParagraphElement>();

  return (
    <section
      id="about"
      className="w-full"
      style={{ background: "var(--bg-dark)", paddingTop: "var(--section-pad-y)" }}
    >
      <div style={{ paddingLeft: "var(--gutter-b)", paddingRight: "var(--gutter-b)" }}>
        <h2 className="t-display-l m-0 max-w-[900px] text-white">
          <ScrollReveal
            baseOpacity={0}
            enableBlur
            baseRotation={3}
            blurStrength={10}
            rotationEnd="+=720"
            wordAnimationEnd="+=720"
            stagger={0.034}
          >
            Craft that earns attention, then keeps it.
          </ScrollReveal>
        </h2>
      </div>

      <div
        className="mt-[2.4em]"
        style={{ paddingLeft: "var(--gutter-b)", paddingRight: "var(--gutter-b)" }}
      >
        <p
          ref={leadRef}
          className="t-lead m-0 max-w-[880px] text-justify"
          style={{ color: "var(--text-dim-50)" }}
        >
          I work with founders and product teams who treat design as{" "}
          <span className="font-medium text-white">
            infrastructure rather than decoration
          </span>
          . The result is work that loads fast, reads clearly, and holds up under real
          traffic —{" "}
          <span className="font-medium text-white">
            built to be extended, not replaced
          </span>
          .
        </p>

        <p
          className="t-body-l m-0 mt-[1.4em] max-w-[900px]"
          style={{ color: "var(--text-dim-50)" }}
        >
          Six years, ninety-plus shipped projects, and a bias toward systems over
          one-off screens.
        </p>

        <a
          href="#work"
          className="t-body mt-[2em] inline-flex items-center justify-center no-underline outline-offset-4 focus-visible:outline focus-visible:outline-2"
          style={{
            width: "var(--cta-process-w)",
            height: "var(--cta-process-h)",
            paddingLeft: "var(--pad-pill-x)",
            paddingRight: "var(--pad-pill-x)",
            background: "var(--cta-01)",
            borderRadius: "var(--r-pill)",
            color: "#ffffff",
            fontWeight: 500,
            letterSpacing: "var(--ls-body-s)",
          }}
        >
          See my process
        </a>
      </div>
    </section>
  );
}
