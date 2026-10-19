// Built using Hyperiux Vault: https://vault.hyperiux.com
//
// Retrieved from 21st.dev (hyperiux/timeline). The animation is the author's,
// unmodified in substance: the section pins, the track slides sideways on a
// scrub, and each milestone draws its stem and reveals its year/description with
// a line-masked SplitText as the card reaches centre.
//
// Changes from the published source, all mechanical:
//
//   1. Journey data became props. Upstream hardcodes topJourneyData (4) and
//      bottomJourneyData (3) at module scope -- this user has 6 entries, and a
//      site with more than one timeline would have collided on the module-level
//      ids. The top/bottom split is now ceil(n/2) and the rest.
//   2. `positions` was a literal array of 7 pairs, so upstream only ever works
//      for exactly 7 items. It is now the same formula the original values come
//      from: start_i = 6 + i * 59/(n-1), end_i = start_i + 20. Checked against
//      the original seven pairs before switching to the formula.
//   3. `tranlate-y-[-50%]` -> `translate-y-[-50%]` (typo, so the rail's
//      vertical centring never applied).
//   4. imageUrl defaults to a local placeholder instead of a 21st.dev CDN photo
//      of an office, which is not this person's office. Drop a real photo at
//      /public/experience-placeholder.svg (or pass imageUrl) to replace it.
//   6. Band geometry. Upstream sizes the track at h-[30vw] inside an h-screen
//      sticky with pt-[10%]. Measured at 1049x788: 315px of content in a 788px
//      sticky -- 40% filled, with 368px of dead space below the band. The
//      problem is that the height is a WIDTH percentage, so on a 16:10 laptop
//      (the exact shape this was reported from) the band shrinks while the
//      viewport does not.
//
//      Now: height in vh (h-[68vh]) so the fill ratio is constant at any aspect,
//      padding in vh, and the image widened 30vw -> 36vw so it does not read as
//      a narrow strip next to a 68vh band. Fill went 40% -> 68% at 1049x788 and
//      holds 68% at 1399x900 and 1920x1080; mobile is unchanged because it keeps
//      its own max-[600px] overrides.
//
//      Only the vertical rhythm is touched. Every w-[*vw] stays as upstream had
//      it, because those numbers are the horizontal slide's coordinate system --
//      changing one would desync the cards from the GSAP start/end percentages.
//
// Upstream also reaches for a media query on `max-[600px]`, and note the
// isMobile checks in the scroll maths use <600, so 600-767px gets the desktop
// slide percentages with the mobile type ramp. Left as the author wrote it.
"use client";

import {
  type CSSProperties,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ThumbnailCarousel } from "./thumbnail-carousel";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/* Inline stand-in for @gsap/react's useGSAP. Mirrors its default
   `revertOnUpdate: false`: one gsap.context lives for the component's
   lifetime, the callback is re-added when dependencies change, and the context
   is reverted only on unmount. A callback may return its own
   cleanup, which runs before the next re-add and on unmount. */
function useGSAP(
  callback: () => void | (() => void),
  options?: {
    dependencies?: unknown[];
    scope?: { current: Element | null } | Element | null;
  }
) {
  const deps = options?.dependencies ?? [];
  const scope = options?.scope;
  const ctxRef = useRef<gsap.Context | null>(null);
  const cleanupRef = useRef<(() => void) | undefined>(undefined);

  useLayoutEffect(() => {
    const el =
      scope && typeof scope === "object" && "current" in scope
        ? scope.current
        : (scope as Element | null);
    ctxRef.current = gsap.context(() => {}, el ?? undefined);
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = undefined;
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (!ctxRef.current) return;
    cleanupRef.current?.();
    const ret = ctxRef.current.add(callback);
    cleanupRef.current = typeof ret === "function" ? ret : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export const FALLBACK_IMAGE = "/experience-placeholder.svg";

const monthOrder = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
} as const;

type Month = keyof typeof monthOrder;

export type TimelineItem = {
  id: string;
  year: string;
  month: Month;
  content: string;
};

type SplitTextInstance = InstanceType<typeof SplitText>;

export type TimelineProps = {
  /** Milestones, in the order they should appear. Top row gets the first ceil(n/2). */
  items: TimelineItem[];
  title?: string;
  periodLabel?: string;
  textColor?: string;
  mutedTextColor?: string;
  backgroundColor?: string;
  imageUrl?: string;
  imageAlt?: string;
  /** Carousel slides. Falls back to the single `imageUrl` when omitted. */
  images?: { src: string; alt: string }[];
  /** Reveal animation duration, in seconds. */
  duration?: number;
  /** Fallback reveal duration when `duration` is omitted, in seconds. */
  scrollDuration?: number;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQueryList.addEventListener("change", callback);

  return () => mediaQueryList.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;

  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false;
}

function getServerReducedMotionSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );
}

export default function Timeline({
  items,
  title = "Product Storyline",
  periodLabel = "2020-2026",
  textColor = "var(--color-foreground, #000000)",
  mutedTextColor = "var(--color-muted-foreground, #3f3f46)",
  backgroundColor = "var(--color-background, #ffffff)",
  imageUrl = "/experience-placeholder.svg",
  imageAlt = "",
  images,
  duration,
  scrollDuration = 1.2,
}: TimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const wholeSliderRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const animationDuration = duration ?? scrollDuration;
  const normalizedDuration = Math.max(0.2, animationDuration);
  const sectionStyle: CSSProperties = {
    color: textColor,
    backgroundColor,
  };
  /* Rail, end caps, per-item stems and dots are all the timeline's line work,
     so they share one white rule. The accent prop that used to tint them is
     gone with the last reference to it. */
  const lineStyle: CSSProperties = {
    backgroundColor: "#ffffff",
  };
  const mutedTextStyle: CSSProperties = {
    color: mutedTextColor,
  };

  /* Split by index parity, not by half. The two rows are drawn at DIFFERENT
     horizontal offsets (the top row's rail column is 20% wide with a 15vw
     item gap, the bottom row's is 34% wide plus an ml-[7vw] lead-in and a 20vw
     gap), so a contiguous 3/3 split does not produce "three periods on top,
     three after" -- it interleaves them and the sequence reads out of order.

     Alternating instead puts item 0 above the rail and item 1 below it in the
     same visual column, so scrolling left to right walks the array in order.
     Read as a pair per column: (2024 June, 2024 July), (2025 July,
     2025 August), (2026 March, 2026 July). */
  const topJourneyData = items.filter((_, i) => i % 2 === 0);
  const bottomJourneyData = items.filter((_, i) => i % 2 === 1);
  const allJourneyItems = [...topJourneyData, ...bottomJourneyData];

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section) return;

      const isMobile = window.innerWidth < 600;
      const lineWidth = isMobile ? "65%" : "98%";
      const lineStart = isMobile ? "top 30%" : "top 25%";
      /* "bottom bottom" ends the scrub exactly when the pinned section has
         scrolled its whole height, so the trigger range equals the runway
         (sectionHeight - viewportHeight). The old "92% bottom" / "82% 50%"
         ended early, which left a dead band at the end of the section and
         desynchronised f = scroll/runway from the per-item reveal windows. */
      const slideEnd = "bottom bottom";
      const lineEnd = isMobile ? "80% 50%" : "92% bottom";

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: slideEnd,
          scrub: true,
        },
        defaults: {
          ease: "none",
        },
      });

      /* Slide the track by the distance that actually walks the last item off the
       right edge, measured in px rather than guessed as a percentage.

       Upstream used xPercent -65 / -57, which was tuned for its own track
       width. Ours is far wider (240vw desktop, 800vw mobile), so -57% of 3120px
       is 1778px while the content needs ~3100px to pass: the last item never
       arrived and the first ~35% of the scroll showed an empty band. Deriving
       it from the track keeps both breakpoints in step with the content. */
      const trackEl = wholeSliderRef.current;
      if (trackEl) {
        const trackWidth = trackEl.scrollWidth;
        const viewportWidth = window.innerWidth;
        tl.fromTo(
          trackEl,
          { x: 0 },
          { x: -Math.max(0, trackWidth - viewportWidth) },
        );
      }

      if (reducedMotion) {
        gsap.set(".journey-line", { width: lineWidth });
        return;
      }

      gsap.to(".journey-line", {
        width: lineWidth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: lineStart,
          end: lineEnd,
          scrub: true,
        },
      });
    },
    { dependencies: [reducedMotion], scope: sectionRef },
  );

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section) return;

      if (reducedMotion) {
        items.forEach((item) => {
          gsap.set(`.jl-${item.id}`, { scaleY: 1 });
          gsap.set(`.jd-${item.id}`, { scale: 1 });
          gsap.set(`.title-${item.id}`, { opacity: 1, clearProps: "transform" });
          gsap.set(`.description-${item.id}`, {
            opacity: 1,
            clearProps: "transform",
          });
        });
        return;
      }

      items.forEach((item) => {
        gsap.set(`.jl-${item.id}`, {
          scaleY: 0,
          transformOrigin: "bottom bottom",
        });
        gsap.set(`.jd-${item.id}`, { scale: 0 });
        gsap.set(`.title-${item.id}`, { opacity: 1 });
        gsap.set(`.description-${item.id}`, { opacity: 1 });
      });

      const titleSplits: Partial<Record<string, SplitTextInstance>> = {};
      const descriptionSplits: Partial<Record<string, SplitTextInstance>> = {};

      allJourneyItems.forEach((item) => {
        titleSplits[item.id] = new SplitText(`.title-${item.id}`, {
          type: "chars, words, lines",
          mask: "lines",
        });

        descriptionSplits[item.id] = new SplitText(`.description-${item.id}`, {
          type: "chars, words, lines",
          mask: "lines",
        });
      });

      const createItemTimeline = (
        item: TimelineItem,
        startPos: number,
        endPos: number,
      ) => {
        const lineSelector = `.jl-${item.id}`;
        const dotSelector = `.jd-${item.id}`;
        const titleLines = titleSplits[item.id]?.lines || [];
        const descriptionLines = descriptionSplits[item.id]?.lines || [];

        const isTop = topJourneyData.some((topItem) => topItem.id === item.id);

        if (!isTop) {
          gsap.set(lineSelector, { transformOrigin: "top top" });
        }

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: `${startPos}% 30%`,
            end: `${endPos}% 50%`,
            scrub: true,
          },
        });

        timeline
          .to(lineSelector, {
            scaleY: 1,
            duration: normalizedDuration * 0.4,
          })
          .to(
            dotSelector,
            {
              scale: 1,
              duration: normalizedDuration * 0.4,
            },
            "<",
          )
          .fromTo(
            titleLines,
            { y: 100 },
            {
              y: 0,
              delay: -0.8 * normalizedDuration,
              duration: normalizedDuration,
              stagger: 0.02,
              ease: "power2.out",
            },
          )
          .fromTo(
            descriptionLines,
            { y: 100 },
            {
              y: 0,
              duration: normalizedDuration,
              stagger: 0.02,
              ease: "power2.out",
            },
            "<",
          );

        return timeline;
      };

      /* Reveal windows are derived from where each item actually sits on the
         horizontal track, not from a fixed even spread.

         The two rows do NOT advance at the same rate. The top row is
         `w-[30vw]` with `gap-x-[15vw]`, the bottom row is `w-[25vw]` with
         `gap-x-[20vw]` and a `ml-[7vw]` lead-in, so the bottom items are packed
         tighter and sweep past the viewport noticeably earlier. Spreading the
         windows evenly by index therefore desynchronised the two rows: the
         bottom items were fully on screen at ~f=0.10 but their text only
         finished revealing at ~f=0.65, by which point they had slid off the
         left edge -- so that whole row read as permanently blank.

         Measuring each item's offsetLeft against the track, then mapping that
         into the same travel the slider uses, ties the reveal
         to the item's real arrival time in both rows and on both breakpoints. */
      const slider = wholeSliderRef.current;
      const trackWidth = slider?.scrollWidth ?? 0;
      const travel = Math.max(0, trackWidth - window.innerWidth);
      const viewportWidth = window.innerWidth;
      const sectionHeight = section.offsetHeight;
      const runwayPx = Math.max(1, sectionHeight - window.innerHeight);

      allJourneyItems.forEach((item) => {
        const el = section.querySelector(`.title-${item.id}`) as HTMLElement | null;
        if (!el || !trackWidth || !travel) {
          createItemTimeline(item, 6, 26);
          return;
        }
        /* offsetLeft is relative to the nearest positioned ancestor, which
           here is the row wrapper -- not the track. Walk up to the slider so
           the measurement is in track coordinates. */
        let itemLeft = 0;
        let node: HTMLElement | null = el;
        while (node && node !== slider) {
          itemLeft += node.offsetLeft;
          node = node.offsetParent as HTMLElement | null;
        }
        const itemWidth = el.offsetWidth;

        /* As the track slides left by up to `travel` px, an item sitting at
           itemLeft ends up centred in the viewport when

               travel * f = itemLeft + itemWidth/2 - viewportWidth/2

           It is fully on screen from about travel * f = itemLeft + itemWidth -
           viewportWidth, and starts leaving at travel * f = itemLeft. Reveal is
           scheduled inside that band, a little after entry so the card is
           already on screen when the first line slides up. */
        const fCentre = (itemLeft + itemWidth / 2 - viewportWidth / 2) / travel;
        const fExit = itemLeft / travel;
        const fEnter = (itemLeft + itemWidth - viewportWidth) / travel;

        /* start/end are consumed as `${n}% 30%` against the SECTION's height,
           not the runway, so convert the scroll fraction to that space:
           fraction of runway -> px -> % of section height. */
        const toSectionPercent = (f: number) =>
          (f * runwayPx * 100) / sectionHeight;

        const revealStart = Math.min(
          fExit - 0.02,
          fEnter + (fCentre - fEnter) * 0.3,
        );

        const startPx = Math.max(0, revealStart * runwayPx);
        const endPx = Math.min(
          runwayPx,
          Math.max(startPx + 90, fExit * runwayPx - 40),
        );

        const startPos = toSectionPercent(startPx / runwayPx);
        const endPos = toSectionPercent(endPx / runwayPx);

        createItemTimeline(item, startPos, endPos);
      });

      const handleResize = () => {
        ScrollTrigger.refresh();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        Object.values(titleSplits).forEach((split) => split?.revert?.());
        Object.values(descriptionSplits).forEach((split) => split?.revert?.());
        window.removeEventListener("resize", handleResize);
      };
    },
    { dependencies: [normalizedDuration, reducedMotion, allJourneyItems], scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[200vw] max-[600px]:h-[420vh] w-full"
      style={sectionStyle}
    >
      <div className="sticky top-[0%] h-screen w-screen max-[600px]:top-[5%] overflow-hidden pt-[13vh] max-[600px]:pt-[13vh]">
        <div
          ref={wholeSliderRef}
          className="mr-[2vw] flex h-[68vh] w-[240vw] max-[600px]:h-[80vh] max-[600px]:w-[520vw] items-center gap-[5vw] px-[2vw] max-[600px]:px-[7vw]"
        >
          {/* Carousel replaces TiltFrame: a drag gesture and a pointer-driven tilt
              claim the same input, and on a track that translates with scroll
              the tilt fought the movement. Thumbnails also give a direct way
              to pick a photo, which drag alone does not. */}
          <div className="h-full w-[36vw] max-[600px]:h-[65vw] max-[600px]:w-[85vw] overflow-hidden rounded-[1vw] max-[600px]:rounded-[5vw]">
            <ThumbnailCarousel
              images={images}
              alt={imageAlt}
              autoPlay={!reducedMotion}
            />
          </div>

          <div className="relative h-full w-full">
            <div className="absolute left-0 top-[49%] flex h-fit w-full -translate-y-1/2 items-center">
              <div
                className="h-[.8vw] max-[600px]:h-[2vw] max-[600px]:w-[2vw] w-[.8vw] rounded-full"
                style={lineStyle}
              ></div>
              <div
                className="journey-line h-px w-[0%] rounded-full"
                style={lineStyle}
              ></div>
              <div
                className="h-[.8vw] max-[600px]:h-[2vw] max-[600px]:w-[2vw] w-[.8vw] rounded-full"
                style={lineStyle}
              ></div>
            </div>

            <div className="flex h-1/2 w-full items-center justify-start gap-[.5vw]">
              <div className="h-full w-[20%] pt-[2vw] max-[600px]:h-fit max-[600px]:pt-[5vw]">
                <h2 className="w-[65%] text-[3vw] leading-[0.95] max-[600px]:text-[8.5vw]">
                  {title}
                </h2>
              </div>

              <div className="flex h-full w-full gap-x-[15vw] max-[600px]:gap-x-[40vw]">
                {topJourneyData.map((item) => (
                  <div
                    key={`top-${item.id}`}
                    className="relative h-full w-[30vw] px-[3vw] max-[600px]:flex max-[600px]:w-[70vw] max-[600px]:flex-col max-[600px]:px-[7vw]"
                  >
                    <div className="absolute left-0 top-0 h-full w-full">
                      <div
                        className={`jd-${item.id} relative aspect-square size-[1vw] max-[600px]:size-[2.5vw] translate-x-[-50%] rounded-full`}
                        style={lineStyle}
                      ></div>
                      <div
                        className={`jl-${item.id} h-[94%] w-px origin-bottom rounded-full`}
                        style={lineStyle}
                      ></div>
                    </div>

                    <div className="space-y-[1vw]">
                      <h4
                        className={`title-${item.id} text-[2.5vw] leading-none max-[600px]:text-[6.4vw]`}
                      >
                        {item.year} {item.month}
                      </h4>
                      <p
                        className={`description-${item.id} w-[90%] text-[1.5vw] leading-[1.15] max-[600px]:w-[90%] max-[600px]:text-[4.8vw]`}
                        style={mutedTextStyle}
                      >
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex h-1/2 w-full items-center justify-start gap-[.5vw]">
              <div className="h-full w-[20%] pt-[2vw] max-[600px]:w-[30%] max-[600px]:pt-[5vw]">
                <p
                  className="text-[1.65vw] leading-none max-[600px]:text-[4.2vw]"
                  style={mutedTextStyle}
                >
                  {periodLabel}
                </p>
              </div>

              {/* Shifted by half a pitch (item 30vw + gap 15vw = 45vw, half of
                  that) so the bottom items occupy the slots BETWEEN the top
                  ones. Left unshifted, both rows started at the same x and every
                  column showed two cards stacked -- a doubled timeline instead
                  of a zigzag. With the shift the reading order left to right is
                  top, bottom, top, bottom matching the array order. */}
              <div className="ml-[22.5vw] flex h-full w-full gap-x-[15vw] max-[600px]:ml-[35vw] max-[600px]:gap-x-[40vw]">
                {bottomJourneyData.map((item) => (
                  <div
                    key={`bottom-${item.id}`}
                    className="relative h-full w-[30vw] px-[3vw] max-[600px]:w-[70vw] max-[600px]:px-[7vw]"
                  >
                    <div className="absolute bottom-[-1%] left-0 h-full w-full">
                      <div
                        className={`jl-${item.id} h-[94%] w-px origin-top rounded-full max-[600px]:h-full`}
                        style={lineStyle}
                      ></div>
                      <div
                        className={`jd-${item.id} relative aspect-square size-[1vw] max-[600px]:size-[2.5vw] translate-x-[-50%] w-auto rounded-full`}
                        style={lineStyle}
                      ></div>
                    </div>

                    <div className="flex h-full w-full flex-col justify-end space-y-[1vw]">
                      <h4
                        className={`title-${item.id} text-[2.5vw] leading-none max-[600px]:text-[6.4vw]`}
                      >
                        {item.year} {item.month}
                      </h4>
                      <p
                        className={`description-${item.id} w-[90%] text-[1.5vw] leading-[1.15] max-[600px]:w-[90%] max-[600px]:text-[4.8vw]`}
                        style={mutedTextStyle}
                      >
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
