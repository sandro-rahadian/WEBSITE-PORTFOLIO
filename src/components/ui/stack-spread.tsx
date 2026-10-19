// Built using Hyperiux Vault: https://vault.hyperiux.com
// Integrated 2026-09-27. The scatter mechanism, spring parallax, responsive
// fallback and reduced-motion handling are the vendor's, unchanged. See
// INTEGRATION-NOTES.md at the bottom of this file for exactly what was altered.

"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { CERT_TILES } from "@/components/CertTiles";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// [INTEGRATION] The vendor ships 8 remote photos on an R2 bucket. Those were
// replaced with the owner's 6 real certificates, served from /public/certificates
// -- so the section makes zero external image requests. The host was also
// unreliable: img1 returned 200-with-0-bytes then a hard connection failure on
// consecutive requests.
const ALT = CERT_TILES.map((t) => t.alt);
const LABEL = CERT_TILES.map((t) => t.label);
const SRC = CERT_TILES.map((t) => t.image);

// [INTEGRATION] Cards are A4 landscape certificates, not photos, so the height
// cannot come from `h` (vh) the way the vendor's square-ish crops did -- a
// vw x vh box changes its aspect ratio with every viewport, which cropped the
// certificate text away. Height is derived from width via `aspect` instead, and
// `scale` is left at 1 so `w` is the card's final width in vw.
const CARD_ASPECT = 1.4142; // A4 landscape

// [INTEGRATION] `w` is in vw but the card's height is in px (derived from `w`),
// so a card sized purely in vw outgrows its row on a wide-but-short window --
// 1920x820. Capping against the viewport HEIGHT as well keeps two rows of A4
// landscape cards inside the fold on any screen, and the min() lets the cards
// still grow with the window on a tall display.
const CARD_MAX_W = "min(29vw, 41vh)";

// x = card centre in vw, y in vh. w = final width in vw (scale is 1).
// Row layout: [x, y, w, restScale, stackRotate]
//
// Two rows of three, with the headline in the gap between them. The reference
// ran 3-2-3 across three rows; at six cards that third row is what forced every
// card down to ~300px to keep the rows from colliding. Collapsing to 2x3 buys a
// whole row of vertical space, so the cards are ~40% wider and still breathe.
// The middle column sits directly above/below the headline, which the 3x2
// version had to dodge.
const TIDY: [number, number, number, number, number][] = [
  [-32, -25, 28, 1, -8], // row 1, left
  [0, -25, 29, 1, 6], // row 1, centre
  [32, -25, 27, 1, -4], // row 1, right
  [-31, 25, 27, 1, 5], // row 2, left
  [1, 25, 29, 1, -7], // row 2, centre
  [33, 25, 28, 1, 3], // row 2, right
];
// tight fan so the clustered stack still reads as a stack, not a ring
const SOX = [-6, 6, -8, 8, -5, 5];
const SOY = [-8, -8, -2, -2, 4, 4];

// [INTEGRATION] Touch devices drop to two columns, where a 2x3 grid becomes
// 3x2 -- so this needs its own column assignment rather than deriving one from
// x. The middle row also sits just below the centred headline instead of
// straddling it.
const SM_X = [-22, 22, -22, 22, -22, 22];
const SM_Y = [-34, -30, 12, 12, 40, 40];

const CARDS: StackSpreadCard[] = SRC.map((src, i) => {
  const [x, y, w, scale, rot] = TIDY[i];
  return {
    item: { src, alt: ALT[i], label: LABEL[i] },
    stackOffset: { x: SOX[i], y: SOY[i] },
    stackRotate: rot,
    aspect: CARD_ASPECT,
    target: { x, y, rotate: 0, scale, w, h: w / CARD_ASPECT },
    targetSm: { x: SM_X[i], y: SM_Y[i] },
    z: i + 2,
  };
});

// ---------------------------------------------------------------------------
// Mechanism (vendor's, unchanged)
// ---------------------------------------------------------------------------

// Scroll progress where the cluster starts scattering and where it finishes.
const SCATTER_START = 0.12;
const SCATTER_END = 0.9;

const PARALLAX_X = 2.6;
const PARALLAX_Y = 2.2;
const PARALLAX_SPRING = { stiffness: 90, damping: 22, mass: 0.6 };
const parallaxDepth = (i: number, total: number) =>
  total <= 1 ? 1 : 0.55 + (i / (total - 1)) * 0.75;

const RESPONSIVE = {
  desktop: {
    scale: null as number | null,
    small: false,
    colX: null as number | null,
    card: null as { w: number; h: number } | null,
  },
  small: {
    scale: 0.72,
    small: true,
    colX: 22,
    card: { w: 40, h: 20 },
  },
};

function useResponsive() {
  const [r, setR] = useState(RESPONSIVE.desktop);
  useEffect(() => {
    // Touch vs. mouse, not raw width: a narrow but mouse-driven frame (21st
    // preview, split editor) keeps the desktop scatter + pointer parallax;
    // only real touch devices drop to the stacked column layout.
    const mq = window.matchMedia("(pointer: coarse)");
    const read = () => setR(mq.matches ? RESPONSIVE.small : RESPONSIVE.desktop);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);
  return r;
}

function usePointerParallax(active: boolean, enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, PARALLAX_SPRING);
  const y = useSpring(rawY, PARALLAX_SPRING);

  useEffect(() => {
    if (!enabled) return;

    if (!active) {
      rawX.set(0);
      rawY.set(0);
      return;
    }

    const onMove = (event: PointerEvent) => {
      rawX.set((event.clientX / window.innerWidth) * 2 - 1);
      rawY.set((event.clientY / window.innerHeight) * 2 - 1);
    };
    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [active, enabled, rawX, rawY]);

  return { x, y };
}

export interface StackSpreadItem {
  src: string;
  alt?: string;
  /** short name, used for an accessible name when the card is activatable */
  label?: string;
}

export interface StackSpreadTarget {
  x: number;
  y: number;
  rotate: number;
  scale?: number;
  w: number;
  h: number;
}

export interface StackSpreadCard {
  item: StackSpreadItem;
  target: StackSpreadTarget;
  /**
   * [INTEGRATION] width / height. When set, the card's height is derived from
   * its width with CSS `aspect-ratio` instead of the vendor's `h` (vh), so the
   * box keeps one shape at every viewport size. Omit to fall back to `h` vh.
   */
  aspect?: number;
  /** final x/y (vw/vh) for tablet + mobile; falls back to `target` */
  targetSm?: { x: number; y: number };
  /** angle while clustered */
  stackRotate?: number;
  /** offset while clustered (vw/vh) */
  stackOffset?: { x: number; y: number };
  /** paint order, higher on top */
  z?: number;
}

function Card({
  card,
  progress,
  reduce,
  clusterRotation,
  scaleMul,
  isSmall,
  colX,
  fixedCard,
  stackScale,
  cardRadius,
  pointer,
  depth,
  index,
  onActivate,
}: {
  card: StackSpreadCard;
  progress: MotionValue<number>;
  reduce: boolean | null;
  clusterRotation: boolean;
  /** uniform rest-scale for every card; null = use each card's own scale */
  scaleMul: number | null;
  isSmall: boolean;
  colX: number | null;
  fixedCard: { w: number; h: number } | null;
  /** scale of the cards while clustered, before the scatter */
  stackScale: number;
  /** corner radius on each card, in px (desktop) */
  cardRadius: number;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  depth: number;
  index: number;
  onActivate?: (index: number) => void;
}) {
  const { item, target } = card;

  const flat = reduce === true;
  const stackRotate = flat ? 0 : clusterRotation ? card.stackRotate ?? 0 : 0;
  const stackOffset = card.stackOffset ?? { x: 0, y: 0 };
  const restScale = scaleMul ?? target.scale ?? 1;

  // final resting spot: column grid on small screens, scatter on desktop
  const sm = isSmall && card.targetSm ? card.targetSm : null;
  const endX = sm
    ? colX != null
      ? Math.sign(sm.x) * colX
      : sm.x
    : target.x;
  const endY = sm ? sm.y : target.y;
  const endRotate = flat || isSmall ? 0 : target.rotate;

  // -50% keeps card centred on its anchor
  const translate = useTransform(
    [progress, pointer.x, pointer.y],
    ([p, px, py]: number[]) => {
      const tx = stackOffset.x + (endX - stackOffset.x) * p;
      const ty = stackOffset.y + (endY - stackOffset.y) * p;
      const drift = depth * p;
      const dx = tx - px * PARALLAX_X * drift;
      const dy = ty - py * PARALLAX_Y * drift;
      return `calc(-50% + ${dx}vw) calc(-50% + ${dy}vh)`;
    },
  );
  const rotate = useTransform(progress, [0, 1], [stackRotate, endRotate]);
  const scale = useTransform(progress, [0, 1], [stackScale, restScale]);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 will-change-transform"
      style={{
        width: `${fixedCard ? fixedCard.w : target.w}vw`,
        // the touch layout already scales its cards down to 40vw * restScale,
        // so the desktop cap must not clamp it as well
        maxWidth: isSmall ? undefined : CARD_MAX_W,
        ...(card.aspect
          ? { aspectRatio: `${card.aspect}` }
          : { height: `${fixedCard ? fixedCard.h : target.h}vh` }),
        zIndex: card.z ?? 1,
        translate,
        rotate,
        scale,
      }}
    >
      <CardFace
        item={item}
        cardRadius={cardRadius}
        label={item.label}
        onActivate={onActivate ? () => onActivate(index) : undefined}
      />
    </motion.div>
  );
}

function CardFace({
  item,
  cardRadius,
  label,
  onActivate,
}: {
  item: StackSpreadItem;
  cardRadius: number;
  /** short name used for the button's accessible name */
  label?: string;
  /** when set, the face becomes a real button that opens a preview */
  onActivate?: () => void;
}) {
  const img = (
    <img
      src={item.src}
      alt={item.alt ?? ""}
      draggable={false}
      loading="lazy"
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover"
    />
  );

  if (!onActivate) {
    return (
      <div
        className="ss-card-face relative h-full w-full overflow-hidden"
        style={{ borderRadius: `${cardRadius}px` }}
      >
        {img}
      </div>
    );
  }

  // A <button> rather than a div+onClick so the certificate is reachable by
  // keyboard and announced as activatable. The alt stays on the img, so the
  // button's own name is the short label.
  return (
    <button
      type="button"
      onClick={onActivate}
      aria-label={label ? `Perbesar sertifikat: ${label}` : undefined}
      aria-haspopup="dialog"
      className="ss-card-face relative block h-full w-full cursor-zoom-in overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px]"
      style={{ borderRadius: `${cardRadius}px` }}
    >
      {img}
    </button>
  );
}

interface StackSpreadStageProps {
  cards: StackSpreadCard[];
  /** scatter scroll distance, in vh */
  scrollLength?: number;
  bgColor?: string;
  /** fan the clustered stack (default) or start flat */
  clusterRotation?: boolean;
  /** scale of the cards while clustered, before the scatter */
  stackScale?: number;
  /** corner radius on each card, in px (desktop only — mobile keeps its responsive radius) */
  cardRadius?: number;
  /** color of the centre headline and subtitle */
  textColor?: string;
  /** scroll progress (0-1) where the centre text starts fading in */
  textFadeStart?: number;
  /** show the "scroll to spread" hint at the bottom until the scatter begins */
  showScrollHint?: boolean;
  /** called with the card index when a card is clicked / activated */
  onCardActivate?: (index: number) => void;
  // [INTEGRATION] The vendor hardcodes "Design That Responds." + a paragraph in
  // the centre, which would duplicate this site's existing
  // "Certifications & tools I master." heading. Both are now optional and
  // default to empty, so the caller decides.
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Escape hatch for a heading that needs the stage's scroll progress -- e.g.
      the halftone wordmark, whose ink-in is scrubbed off this same MotionValue
      so it cannot drift out of step with the section. Receives the stage
      progress. */
  renderTitle?: (progress: MotionValue<number>) => React.ReactNode;
}

function StackSpreadStage({
  cards,
  scrollLength = 350,
  bgColor = "#ececeb",
  clusterRotation = true,
  stackScale = 0.82,
  cardRadius = 8,
  textColor = "#141414",
  textFadeStart = 0.3,
  showScrollHint = true,
  onCardActivate,
  title,
  subtitle,
  renderTitle,
}: StackSpreadStageProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scale: scaleMul, small: isSmall, colX, card: fixedCard } =
    useResponsive();

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  // hold, scatter, then settle
  const progress = useTransform(
    scrollYProgress,
    [0, SCATTER_START, SCATTER_END, 1],
    [0, 0, 1, 1],
  );

  // centre text always fades in on scroll; the scale-in is dropped only when
  // reduced motion is confirmed (`true`), not on the null SSR value.
  const [spread, setSpread] = useState(false);
  useMotionValueEvent(progress, "change", (p) => {
    setSpread((was) => (was ? p > 0.985 : p >= 0.999));
  });
  const parallaxEnabled = reduce !== true && !isSmall;
  const pointer = usePointerParallax(spread, parallaxEnabled);

  const noScale = reduce === true;
  /* Fade window tightened from 0.35 to 0.16. The heading inside this wrapper can
     only be seen while the wrapper is opaque enough to read, and a 0.35-wide
     ramp left almost none of the stage's scroll progress at usable opacity --
     the word appeared while it was still ~10% visible, which reads as "no
     animation at all". A short ramp finishes early and leaves the rest of the
     scroll for the heading itself.
     The heading does NOT ink in across this window any more. Measured against
     the cards, all six still cross the heading's band until progress 0.55, so
     LightZone inks the halftone in at 0.50 -> 0.61 instead, once they have
     scattered out of it. This ramp only has to get out of the way by then. */
  const copyOpacity = useTransform(progress, [textFadeStart, textFadeStart + 0.16], [0, 1]);
  const copyScale = useTransform(progress, [textFadeStart, 0.9], [0.85, 1]);

  // scroll hint: visible while clustered, gone by the time the scatter starts
  const hintOpacity = useTransform(progress, [0, SCATTER_START], [1, 0]);

  const hasCopy = Boolean(title || subtitle);

  return (
    <section
      ref={wrapRef}
      className="relative w-full"
      style={{ height: `${scrollLength}vh`, backgroundColor: bgColor }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* centre text */}
        {hasCopy && (
          <motion.div
            /* z-[20], not z-[5]. The cards sit in a z-10 layer and carry their
               own z-index up to 10, so at z-5 any card above that index drew
               straight over the headline -- measured 6 of the 6 cards covering
               it mid-scatter, which cut "Certifications & Tools" in half. The
               copy is pointer-events-none anyway, so lifting it costs nothing. */
            /* z-[60], not z-[20]. The cards each carry their own z-index (2-7)
               inside the z-10 card layer, and every one of them is transformed
               for the scatter -- which makes each a stacking context of its own.
               At z-20 the headline still lost: measured all 6 cards painting
               over it mid-scatter, clipping "Certifications & Tools". Above the
               card layer's own z-10 by enough headroom it cannot be overtaken
               regardless of what the card inline styles say. */
            className="pointer-events-none absolute inset-0 z-[60] flex flex-col items-center justify-center px-6 text-center max-md:px-8"
            style={{
              opacity: copyOpacity,
              scale: noScale ? 1 : copyScale,
            }}
          >
            {title && (
              <h2
                className="w-full whitespace-pre-line text-[4.5vw] font-normal leading-none! tracking-tight max-md:text-[10vw]"
                style={{ color: textColor }}
              >
                {renderTitle ? renderTitle(progress) : title}
              </h2>
            )}
            {subtitle && (
              <p
                className="mt-[1.2vw] w-full max-w-[42ch] text-[1.15vw] leading-relaxed tracking-tight max-md:mt-3 max-md:text-[3.6vw]"
                style={{ color: textColor, opacity: 0.6 }}
              >
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        {/* scattering cards */}
        <div className="absolute inset-0 z-10">
          {cards.map((card, i) => (
            <Card
              key={i}
              card={card}
              progress={progress}
              reduce={reduce}
              clusterRotation={clusterRotation}
              scaleMul={scaleMul}
              isSmall={isSmall}
              colX={colX}
              fixedCard={fixedCard}
              stackScale={stackScale}
              cardRadius={cardRadius}
              pointer={pointer}
              depth={parallaxEnabled ? parallaxDepth(i, cards.length) : 0}
              index={i}
              onActivate={onCardActivate}
            />
          ))}
        </div>

        {/* scroll hint */}
        {showScrollHint && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-[3vh] z-20 flex flex-col items-center gap-[0.6vh] text-[0.8vw] font-medium uppercase tracking-[0.2em] max-md:bottom-6 max-md:gap-1 max-md:text-[2.8vw]"
            style={{ color: textColor, opacity: hintOpacity }}
          >
            <span>Scroll</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-bounce max-md:h-[4vw] max-md:w-[4vw]"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export interface StackSpreadProps {
  /** scatter scroll distance, in vh */
  scrollLength?: number;
  bgColor?: string;
  /** fan the clustered stack (default) or start flat */
  clusterRotation?: boolean;
  /** scale of the cards while clustered, before the scatter */
  stackScale?: number;
  /** corner radius on each card, in px (desktop only — mobile keeps its responsive radius) */
  cardRadius?: number;
  /** color of the centre headline and subtitle */
  textColor?: string;
  /** scroll progress (0-1) where the centre text starts fading in */
  textFadeStart?: number;
  /** show the "scroll to spread" hint at the bottom until the scatter begins */
  showScrollHint?: boolean;
  /** called with the card index when a card is clicked / activated */
  onCardActivate?: (index: number) => void;
  /** optional centre headline; omit to keep the stage text-free */
  title?: React.ReactNode;
  /** optional centre paragraph; omit to keep the stage text-free */
  subtitle?: React.ReactNode;
  /** escape hatch so a heading can react to the stage's own scroll progress */
  renderTitle?: (progress: MotionValue<number>) => React.ReactNode;
}

export default function StackSpread({
  scrollLength = 350,
  bgColor = "#ececeb",
  clusterRotation = true,
  stackScale = 0.82,
  cardRadius = 8,
  textColor = "#141414",
  textFadeStart = 0.3,
  showScrollHint = true,
  onCardActivate,
  title,
  subtitle,
  renderTitle,
}: StackSpreadProps) {
  return (
    <StackSpreadStage
      cards={CARDS}
      scrollLength={scrollLength}
      bgColor={bgColor}
      clusterRotation={clusterRotation}
      stackScale={stackScale}
      cardRadius={cardRadius}
      textColor={textColor}
      textFadeStart={textFadeStart}
      showScrollHint={showScrollHint}
      onCardActivate={onCardActivate}
      title={title}
      subtitle={subtitle}
      renderTitle={renderTitle}
    />
  );
}

/* ===========================================================================
   INTEGRATION-NOTES.md — what changed vs. the vendor file, and why
   ===========================================================================

   0. `useReducedMotion` -> `usePrefersReducedMotion` (src/hooks/)
      The vendor's hook returns null on the server and a boolean on the client,
      and `flat = reduce === true` is read during render, so the two produced
      different inline transforms and React threw a hydration mismatch under
      prefers-reduced-motion. Same fix as Hero, ScrollReveal and Marquee -- see
      src/hooks/usePrefersReducedMotion.ts. The vendor's intent (flatten the
      scatter when reduced motion is requested) is preserved.
   ===========================================================================

   1. `motion/react` -> `framer-motion`
      No new dependency. framer-motion 12.43.0 already exports all 7 symbols
      this file imports (motion, useScroll, useTransform, useReducedMotion,
      useMotionValue, useSpring, useMotionValueEvent). `motion` is the renamed
      framer-motion, so installing it too would have shipped a second copy of
      the same ~50KB library.

   2. 8 remote R2 photos -> 6 local certificate scans
      The vendor's IMG map pointed at a public R2 bucket. Measured as
      unreliable: img1 returned "200 with 0 bytes" and then a hard connection
      failure on back-to-back requests. Replaced with the owner's six real
      certificates in /public/certificates (Telkom competency, two Dicoding,
      two HackerRank, Samsung Innovation Campus) so the section issues zero
      external image requests. Scaled to 1200px wide, JPEG q65, 636KB total,
      and loaded lazily -- 6 document scans at full resolution would otherwise
      cost several MB up front.

   3. Card size: `h` (vh) -> `aspect` (width / height)
      The vendor sized cards as `w` vw x `h` vh, which is only stable for
      near-square photo crops: the box's aspect ratio shifts with the viewport,
      so on this 16:10 and 21:9 screens alike the `object-cover` face cropped
      the certificate text out of frame. Cards now set `aspect` and let CSS
      derive the height, so a card is 1.4142 (A4 landscape) everywhere. `h` is
      still populated and still used whenever `aspect` is absent, so the
      vendor's own layout values remain valid.

   4. 8 cards -> 6 cards, vendor anchors reused
      Six of the vendor's eight hand-tuned x/y anchors are kept verbatim --
      the two dropped are the top-centre and bottom-centre ones, which sit
      directly above/below the headline and crowd it at this card count. The
      survivors still form the reference's loose hexagonal ring. Widths are
      13-19vw (the reference ranged 11.7-19.9vw) and `scale` is 1 so `w` is the
      final width.

   5. Hardcoded centre copy -> optional `title` / `subtitle` props
      The vendor hardcoded "Design That Responds." plus a paragraph. This site
      already has its own "Certifications & tools I master." heading, so the
      stage renders text-free by default.

   NOT changed: the scatter easing curve, SCATTER_START/END thresholds,
   PARALLAX_* constants, spring config, parallaxDepth(), useResponsive()'s
   touch-vs-width logic, usePointerParallax(), the -50% centring maths, the
   reduced-motion branches, the mobile column fallback, or the scroll hint.
   =========================================================================== */
