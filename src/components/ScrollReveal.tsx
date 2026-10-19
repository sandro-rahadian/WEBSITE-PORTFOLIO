"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type ScrollRevealProps = {
  children: React.ReactNode;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
  stagger?: number;
};

export default function ScrollReveal({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
  rotationEnd = "bottom bottom",
  wordAnimationEnd = "bottom bottom",
  stagger = 0.08,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const reduce = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const words = Array.from(container.querySelectorAll<HTMLElement>("[data-reveal-word]"));
    const scroller = scrollContainerRef?.current;

    if (reduce || words.length === 0) {
      gsap.set(container, { rotate: 0, transformOrigin: "0% 0%" });
      gsap.set(words, { opacity: 1, filter: "none" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(container, { transformOrigin: "0% 0%", rotate: baseRotation });
      gsap.to(container, {
        rotate: 0,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          scroller,
          start: "top bottom",
          end: rotationEnd,
          scrub: true,
        },
      });

      const from: gsap.TweenVars = { opacity: baseOpacity, stagger };
      if (enableBlur) from.filter = `blur(${blurStrength}px)`;

      const to: gsap.TweenVars = {
        opacity: 1,
        stagger,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          scroller,
          start: "top bottom",
          end: wordAnimationEnd,
          scrub: true,
        },
      };
      if (enableBlur) to.filter = "blur(0px)";

      gsap.fromTo(words, from, to);
    }, container);

    return () => ctx.revert();
  }, [
    children,
    scrollContainerRef,
    enableBlur,
    baseOpacity,
    baseRotation,
    blurStrength,
    rotationEnd,
    wordAnimationEnd,
    stagger,
    reduce,
  ]);

  const text = typeof children === "string" ? children : null;

  return (
    <span ref={containerRef} className={containerClassName} style={{ willChange: "transform" }}>
      {text !== null ? (
        <span className={textClassName} aria-label={text}>
          {text.split(" ").map((word, i) => (
            <span key={`${word}-${i}`} aria-hidden="true" style={{ display: "inline-block" }}>
              <span data-reveal-word style={{ display: "inline-block", willChange: "opacity, filter" }}>
                {word}
              </span>{" "}
            </span>
          ))}
        </span>
      ) : (
        children
      )}
    </span>
  );
}
