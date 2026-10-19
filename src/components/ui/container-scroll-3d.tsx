"use client";

/* React Bits / Aceternity — ContainerScroll (3D tilt variant)
 *
 * Sole consumer is /cv (src/app/cv/page.tsx), which embeds the PDF in this frame
 * and lets page scroll drive the tip-back. It had a sibling once --
 * container-scroll-animation.tsx, used by the Work section for the CV preview
 * card. That card is gone, the timeline replaced it, and the sibling went with
 * it. (Hence the prop-driven surface below is now unused: containerClassName /
 * containerStyle / offset / scaleRange / rotateRange / yRange / containerHeight
 * all came from that caller. They stay because they are part of the upstream
 * API and removing them would be a rewrite with no caller to justify it.)
 *
 * This variant tilts on rotateX (a 3D tip-back). The deleted sibling rotated on
 * Z, a flat spin -- which is why one file could not replace the other.
 *
 * Deviations from the pasted source, all additive:
 *  - "div" removed from the Header className (stray class in the original)
 *  - prefers-reduced-motion honoured in CSS, NOT by branching on
 *    useReducedMotion() during render -- see the note on Card3DFrame.
 *  - the runway wraps its content in `flex h-full items-center justify-center` so
 *    the card is centred in the runway rather than sitting at its top with
 *    py-40 above it. Same visual centre, but it makes the card's resting
 *    position independent of the runway height, so the card can grow without
 *    also needing more runway.
 */

import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll3D = ({
  titleComponent,
  children,
  containerClassName = "",
  cardClassName = "",
  heightClass = "h-[60rem] md:h-[80rem]",
  cardHeightClass = "h-[30rem] md:h-[40rem]",
}: {
  titleComponent?: React.ReactNode;
  children: React.ReactNode;
  containerClassName?: string;
  cardClassName?: string;
  /** total scroll runway; the tilt is driven by progress across this height */
  heightClass?: string;
  /** the framed card's own height */
  cardHeightClass?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // [INTEGRATION] Default offset kept on purpose. Progress runs from when the
  // runway's top hits the viewport top to when its bottom hits the viewport
  // bottom, so the sweep is (runway - viewport) and the 20deg -> 0 tilt is spread
  // evenly across all of it -- measured 20 / 17 / 14 / 11 / 9 deg at 0/15/30/45/55%
  // of a 636px sweep, hitting 0 only at the end.
  //
  // An earlier "end 1.3" compressed the whole tilt into the first 55% and left
  // the card flat while it scrolled away, which is not the effect this component
  // is for. Raising heightClass lengthens the sweep and slows the tilt, so the
  // two are tuned together.
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scaleDimensions = () => (isMobile ? [0.7, 0.9] : [1.05, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className={`relative p-2 md:p-20 ${heightClass} ${containerClassName}`}
      ref={containerRef}
    >
      <div
        className="flex h-full w-full items-center justify-center"
        style={{ perspective: "1000px" }}
      >
        {titleComponent ? (
          <Header translate={translate} titleComponent={titleComponent} />
        ) : null}
        <Card3DFrame
          rotate={rotate}
          translate={translate}
          scale={scale}
          className={cardClassName}
          heightClass={cardHeightClass}
        >
          {children}
        </Card3DFrame>
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{ translateY: translate }}
      className="max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card3DFrame = ({
  rotate,
  scale,
  children,
  className = "",
  heightClass,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
  className?: string;
  heightClass: string;
}) => {
  return (
    <motion.div
      // [INTEGRATION] No reduced-motion branch here on purpose. useReducedMotion()
      // returns null on the server and true/false on the client, so branching on
      // it during render makes the inline style differ between the two and React
      // throws a hydration mismatch -- the transform would be baked into the
      // server HTML and then disagreed with on the client. Reduced motion is
      // neutralised in CSS instead (see the @media rule in the CV stylesheet), which
      // keeps the markup identical. Same approach as ScrollReveal, which checks
      // prefers-reduced-motion inside useLayoutEffect rather than in render.
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className={`cs-card max-w-5xl -mt-12 mx-auto w-full border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl ${heightClass} ${className}`}
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-gray-100 p-2 md:p-4">
        {children}
      </div>
    </motion.div>
  );
};

export default ContainerScroll3D;
