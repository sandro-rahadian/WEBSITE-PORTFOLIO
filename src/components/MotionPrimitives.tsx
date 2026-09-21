"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  awardEase,
  fadeUpVariant,
  popInVariant,
  wordContainerVariant,
  wordItemVariant,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

interface WordRevealProps {
  text: string;
  className?: string;
  highlightWord?: string;
  highlightColor?: string;
  highlightClass?: string;
  delay?: number;
}

export function WordReveal({
  text,
  className,
  highlightWord,
  highlightColor = "var(--token-orange)",
  highlightClass,
  delay = 0,
}: WordRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(" ");

  if (shouldReduceMotion) {
    return (
      <span className={className}>
        {words.map((word, i) => {
          const isHighlight =
            highlightWord &&
            word.toLowerCase().includes(highlightWord.toLowerCase());
          return (
            <span
              key={i}
              className={cn("inline-block mr-[0.25em]", isHighlight && highlightClass)}
              style={isHighlight && !highlightClass ? { color: highlightColor } : undefined}
            >
              {word}
            </span>
          );
        })}
      </span>
    );
  }

  return (
    <motion.span
      className={cn("inline-block", className)}
      variants={wordContainerVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delayChildren: delay }}
    >
      {words.map((word, index) => {
        const isHighlight =
          highlightWord &&
          word.toLowerCase().includes(highlightWord.toLowerCase());

        return (
          <span
            key={index}
            className="inline-block overflow-hidden align-top mr-[0.25em]"
          >
            <motion.span
              className={cn("inline-block", isHighlight && highlightClass)}
              style={
                isHighlight && !highlightClass
                  ? { color: highlightColor }
                  : undefined
              }
              variants={wordItemVariant}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </motion.span>
  );
}

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: awardEase,
      }}
    >
      {children}
    </motion.div>
  );
}

interface PopInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function PopIn({ children, className, delay = 0 }: PopInProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <span className={className}>{children}</span>;
  }

  return (
    <motion.span
      className={cn("inline-block", className)}
      variants={popInVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4, ease: awardEase }}
    >
      {children}
    </motion.span>
  );
}

interface WipeHighlightProps {
  children: React.ReactNode;
  className?: string;
  bgClassName?: string;
}

export function WipeHighlight({
  children,
  className,
  bgClassName = "bg-[var(--token-orange)]",
}: WipeHighlightProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <span className={cn("px-2 py-0.5 rounded-sm text-black font-semibold", bgClassName, className)}>
        {children}
      </span>
    );
  }

  return (
    <motion.span
      className={cn("relative inline-block px-2 py-0.5 rounded-sm font-semibold text-black overflow-hidden align-baseline", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <motion.span
        className={cn("absolute inset-0 z-0", bgClassName)}
        initial={{ x: "-100%" }}
        whileInView={{ x: "0%" }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: awardEase }}
      />
      <span className="relative z-10">{children}</span>
    </motion.span>
  );
}
