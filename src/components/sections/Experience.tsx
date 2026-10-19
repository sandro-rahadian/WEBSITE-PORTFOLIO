"use client";

/* [cv] Wraps the hyperiux Product Timeline (components/ui/timeline.tsx) with this
   person's actual history. All six entries are the user's LinkedIn export --
   it disagrees with the CV PDF in the repo on Strategart and Back End
   Developer, and on the spelling of Simpuli. LinkedIn wins: it is what the user
   handed over as the reference.

   The timeline's own animation is the 21st.dev component's and is untouched. It
   needs a lead-in before and a lead-out after, because the section pins itself
   for 200vw of scroll (400vh under 600px) and a pinned section with nothing
   above it flashes at the top of the page.

   "use client" is REQUIRED and was missing: this file renders no hooks itself,
   so nothing in it marked the boundary. It rendered fine on the server and the
   Timeline hydrated as its own separate client island -- but GSAP's
   registerPlugin/gsap.context work in Experience's own effect scope never ran,
   so the section sat at xPercent 0 with every stem undrawn. Measured: sliderX 0
   and stems 6/6 "drawn" only because they were never scaled to 0 in the first
   place. Every sibling section carries the directive for the same reason. */

import TextReveal from "@/components/ui/text-reveal";
import Timeline, { type TimelineItem } from "@/components/ui/timeline";

/* Oldest first, on purpose. The timeline lays these out as two alternating
   rows sharing one rail, so "left to right" only reads as a chronology if the
   array itself runs 2024 -> 2026: the Timeline splits it into two rows by
   index parity, which puts one item above and one below the rail per column,
   each column being the next period. Feeding it newest-first (the LinkedIn
   order) made the leftmost card 2026 July and the sequence ran backwards.

   Sorting here rather than inside Timeline keeps the component date-agnostic
   -- it only guarantees the array order it is handed becomes the visual order. */
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const ITEMS: TimelineItem[] = ([
  {
    id: "strategart",
    year: "2026",
    month: "July",
    content: "Strategart Scholarship at PT Strategart Business Consulting — server-side track, XII Strategart",
  },
  {
    id: "puspresnas",
    year: "2026",
    month: "March",
    content: "Team Lead, Pusat Prestasi Nasional — SK Penetapan Tahap I Fiksi Puspresnas 2026",
  },
  {
    id: "backend",
    year: "2025",
    month: "July",
    content: "Back End Developer — Node.js, Prisma ORM, RESTful APIs and PostgreSQL schema design",
  },
  {
    id: "simpuli",
    year: "2025",
    month: "August",
    content: "Founder & Developer of Simpuli — an e-commerce platform, end to end",
  },
  {
    id: "junior",
    year: "2024",
    month: "July",
    content: "Junior Software Engineer — first production work while still at SMK Telkom Malang",
  },
  {
    id: "smk-start",
    year: "2024",
    month: "June",
    content: "Started at SMK Telkom Malang — Software Engineering, backend specialisation",
  },
] as TimelineItem[]).sort((a, b) => {
  if (a.year !== b.year) return Number(a.year) - Number(b.year);
  return (
    MONTHS.indexOf(a.month as (typeof MONTHS)[number]) -
    MONTHS.indexOf(b.month as (typeof MONTHS)[number])
  );
});

/* Carousel slides, in order. Local files rather than the 21st.dev CDN URLs the
   component spec shipped with -- those are stock photos of other people, which
   does not belong in someone's own portfolio.

   Two, not three. The third file was a wider crop of the same school portrait:
   head centred, same printed backdrop, only a different resolution. Side by
   side in the thumbnail rail the pair was indistinguishable, so it read as a
   broken duplicate rather than a second photo. Add a {src, alt} here once
   there is a genuinely different shot. */
const PHOTOS = [
  {
    src: "/experience-photo.jpg",
    alt: "Fransiscus Alessandro Rahadian",
  },
  {
    src: "/experience-photo-2.jpg",
    alt: "Fransiscus Alessandro Rahadian",
  },
];

/* The slides live in public/ as experience-photo.jpg and experience-photo-2.jpg.
   ThumbnailCarousel
   falls back to the single `imageUrl` when `images` is omitted, so a missing
   entry degrades to one photo rather than an empty deck. */

export default function Experience() {
  return (
    <>
      {/* Lead-in. Title only -- the mono eyebrow and the "keep scrolling"
          explainer both went; the eyebrow repeated the word the h2 already said,
          and the paragraph described the interaction instead of letting it be
          seen.

          It is NOT h-screen, and it is not vh-padded either. This section's only
          job is to give the pinned 200vw timeline somewhere to scroll in from,
          and every attempt to size it as a "screen" spends a screen of scroll on
          a title and an arrow. Measured at 1049x788:

            h-screen + pt-[10%]   -> 788px tall, 746px empty (95% dead)
            min-h-[52vh] + py-[12vh]-> 410px tall, 291px empty (71% dead)

          Both were padding arguing with a min-height: py-[12vh] alone is 95px a
          side, and min-h-[52vh] then forced 410px out of 119px of content. So
          the height is now derived from the content -- a small py-[4vh] gives it
          breathing room against the About section above and the band below, and
          a min-h-[22vh] floor only stops it collapsing on short landscape phones.
          Result at 1049x788: 182px tall, 63px empty, 65% filled.

          The timeline still pins correctly regardless -- its ScrollTrigger starts
          at "top top", so it engages the moment this section clears the viewport.

          TextReveal is the project's own character-split reveal (src/components/
          ui/text-reveal.tsx), not a new dependency: it animates per character
          on view, keeps the real string in an .sr-only span for screen readers,
          and honours prefers-reduced-motion by rendering the final state with
          zero-duration transitions. */}
      <section className="flex min-h-[22vh] flex-col items-center justify-center gap-6 px-[var(--gutter-a)] py-[4vh] text-center">
        <h2
          className="font-semibold tracking-tight"
          style={{ fontSize: "clamp(2.4rem, 7.5vw, 6rem)", lineHeight: 0.98, maxWidth: "16ch" }}
        >
          <TextReveal
            text="My Experiences"
            by="character"
            stagger={0.05}
            maxDuration={1.9}
          />
        </h2>
      </section>

      <Timeline
        items={ITEMS}
        title="Experience"
        periodLabel="2024 — 2026"
        backgroundColor="var(--bg-dark, #0a0a0a)"
        textColor="#ffffff"
        mutedTextColor="rgba(255,255,255,0.55)"
        imageUrl="/experience-photo.jpg"
        images={PHOTOS}
        imageAlt="Fransiscus Alessandro Rahadian"
        duration={1.4}
      />

      {/* No lead-out. There used to be a full-screen "From a scholarship to a
          shipped e-commerce platform." section here to give the pin somewhere
          to release, but it was one line of dim text alone on an entire screen,
          and after it the timeline ran straight into Work's "Selected studies"
          heading -- two near-identical centred statements in a row read as a
          mistake, and the dead screen in between is exactly the gap that felt
          wrong. The timeline now lands directly on the next section. */}
    </>
  );
}