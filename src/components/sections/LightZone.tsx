"use client";

import { useCallback, useState } from "react";
import StackSpread from "@/components/ui/stack-spread";
import HalftoneWord from "@/components/ui/halftone-word";
import CertLightbox from "@/components/ui/cert-lightbox";
import { CERT_TILES } from "@/components/CertTiles";
import { useStreamText } from "@/hooks/useStreamText";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/scroll-velocity-text";

// [INTEGRATION] The row now leads with the tools the six certificates actually
// evidence, then continues into the rest of ./tools logo. Served from
// /public/logos (copied) because Next only serves public/ statically.
// Next.js, Gen AI and Kiro have no logo in that folder yet, so they are absent
// from this row -- the six cards above remain the source of truth for the
// certificate set.
const TOOLS = [
  { name: "JavaScript", src: "/logos/javascript.svg" },
  { name: "Node.js", src: "/logos/nodejs.svg" },
  { name: "NestJS", src: "/logos/nestjs.svg" },
  { name: "Python", src: "/logos/python.svg" },
  { name: "AWS", src: "/logos/aws.svg" },
  { name: "TypeScript", src: "/logos/typescript.svg" },
  { name: "Laravel", src: "/logos/laravel.svg" },
  { name: "PHP", src: "/logos/php.svg" },
  { name: "Go", src: "/logos/go.svg" },
  { name: "Prisma", src: "/logos/prisma.svg" },
  { name: "Git", src: "/logos/git.svg" },
  { name: "GitHub", src: "/logos/github.svg" },
  { name: "Supabase", src: "/logos/supabase.svg" },
  { name: "Notion", src: "/logos/notion.svg" },
  { name: "Trello", src: "/logos/trello.svg" },
];

const PREVIEW_ITEMS = CERT_TILES.map((c) => ({
  src: c.image,
  alt: c.alt,
  label: c.label,
  meta: c.meta,
}));

export default function LightZone() {
  const [preview, setPreview] = useState<number | null>(null);
  const certNoteRef = useStreamText<HTMLParagraphElement>();

  const closePreview = useCallback(() => setPreview(null), []);
  const stepPreview = useCallback((next: number) => setPreview(next), []);

  return (
    <div
      id="light-zone"
      className="relative w-full"
      style={{
        background: "var(--bg-light)",
        borderRadius: "var(--r-card)",
        zIndex: 2,
        paddingTop: "var(--section-pad-y)",
        paddingBottom: "var(--section-pad-y)",
        color: "var(--text-on-light)",
      }}
    >
      <StackSpread
        // The stage owns the section's headline now, so the h2 that used to sit
        // here was removed rather than duplicated. "tools I master." survives as
        // the stage subtitle.
        scrollLength={250}
        bgColor="transparent"
        textColor="#000000"
        cardRadius={24}
        showScrollHint={false}
        onCardActivate={setPreview}
        title="Certifications & Tools"
        renderTitle={(progress) => (
          // The wordmark sizes itself: it fits the font to whatever width this
          // box gets, so there is no vw step here to keep in step with the type
          // scale. The cap is only about staying in the clear column between
          // the two card columns -- and it can be looser than the old text
          // heading was, because a field of dots has holes in it. The letters
          // still read over a card behind them, which is the point of the effect.
          //
          // Overshoot is 0.98, i.e. the word sits INSIDE the frame with a small
          // margin. It used to be 1.05 on the grounds that the reference footer
          // crops its wordmark off the bottom edge -- but cropping worked there
          // because the word was wider than the viewport by design. Here it just
          // bit the C and the final s off "Certifications & Tools", which reads
          // as a rendering bug rather than a crop. 0.98 rather than 1 so the
          // outermost dots cannot be sliced by the canvas edge either.
          //
          // ink is black on the light zone; warm is the solid form of
          // --red-footer (rgb(255 0 34) -> rgb(255 125 78)), so the dots the
          // pointer pushes off their place heat up in the same red the footer
          // wordmark uses.
          //
          // start/end are the scroll-progress window the ink-in occupies.
          //
          // These no longer track copyOpacity (0.30 -> 0.46), because at that
          // point the heading lands on top of the cards. Measured across the
          // stage: at progress 0.32-0.46 all six certificate cards still cross
          // the heading's band, and the widest card-free gap is only ~300px and
          // sits off-centre -- right-hand side early, left-hand side late -- so
          // no centred heading of any size can clear them. From 0.55 the band is
          // completely empty.
          //
          // So the word inks in at 0.50 -> 0.61 instead, as the cards scatter
          // out of it: the certificates part, then the word appears in the space
          // they left. The copy layer has been fully opaque since 0.46, so the
          // dots simply arrive a beat after the wrapper does.
          //
          // Keep this as a JSX comment: a bare C-style comment in JSX children
          // renders into the DOM as paragraph content, which pushes the heading
          // down the page.
          <HalftoneWord
            className="mx-auto w-[86vw] md:w-[44vw]"
            text="Certifications & Tools"
            progress={progress}
            start={0.5}
            end={0.61}
            ink="#000000"
            warm="#ff3e28"
            overshoot={0.98}
          />
        )}
        subtitle=""
      />

      {/* rendered outside the stage so the native dialog lands in the top
          layer, clear of the sticky/overflow context it is nested in */}
      {preview !== null && (
        <CertLightbox
          items={PREVIEW_ITEMS}
          index={preview}
          onClose={closePreview}
          onStep={stepPreview}
        />
      )}

      <div
        className="mx-auto flex flex-col gap-[var(--grid-gap-wide)]"
        style={{ maxWidth: "100%" }}
      >
        <ScrollVelocityContainer className="marquee-mask flex justify-start overflow-hidden">
          <ScrollVelocityRow
            baseVelocity={3}
            direction={-1}
            className="w-full"
          >
            {TOOLS.map((tool) => (
              <span
                key={tool.name}
                className="mx-[var(--gutter-b)] inline-flex items-center"
              >
                <img
                  className="logo-mark"
                  src={tool.src}
                  alt={tool.name}
                  width={36}
                  height={36}
                />
                <span
                  aria-hidden="true"
                  style={{ color: "rgba(0,0,0,0.45)", marginLeft: "var(--gutter-b)" }}
                >
                  •
                </span>
              </span>
            ))}
          </ScrollVelocityRow>
        </ScrollVelocityContainer>

        <div
          className="flex flex-col gap-[var(--grid-gap-wide)]"
          style={{ paddingLeft: "var(--gutter-b)", paddingRight: "var(--gutter-b)" }}
        >
          <p
            ref={certNoteRef}
            className="t-body-l m-0"
            style={{ color: "var(--text-on-light-60)", maxWidth: "28%", fontWeight: 500 }}
          >
            Six certificates across the stack I ship with — JavaScript and Node.js
            at the core, Next.js and NestJS for the full stack, plus Python, AWS
            and AI-assisted spec-driven development.
          </p>

          <a
            href="#contact"
            className="t-body inline-flex w-fit items-center justify-center no-underline outline-offset-4 focus-visible:outline focus-visible:outline-2"
            style={{
              height: 44,
              paddingLeft: "var(--pad-pill-x)",
              paddingRight: "var(--pad-pill-x)",
              background: "#dcdcdc",
              borderRadius: "var(--r-pill)",
              color: "var(--text-near-black)",
              fontWeight: 500,
              letterSpacing: "var(--ls-body-s)",
            }}
          >
            ↗ &nbsp;See how I work
          </a>
        </div>
      </div>

    </div>
  );
}
