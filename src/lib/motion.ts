import { type Variants, type Transition } from "framer-motion";

export const awardEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const transitionSmooth: Transition = {
  duration: 0.8,
  ease: awardEase,
};

export const transitionFast: Transition = {
  duration: 0.4,
  ease: awardEase,
};

export const fadeUpVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: awardEase,
    },
  },
};

export const wordContainerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const wordItemVariant: Variants = {
  hidden: {
    opacity: 0,
    y: "100%",
    rotateZ: 4,
  },
  visible: {
    opacity: 1,
    y: "0%",
    rotateZ: 0,
    transition: {
      duration: 0.6,
      ease: awardEase,
    },
  },
};

export const popInVariant: Variants = {
  hidden: {
    opacity: 0,
    scale: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: awardEase,
    },
  },
};

export const heroCollageVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: awardEase,
    },
  },
};

export const fannedCardContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

export const fannedCardVariant = (targetRotate: number, targetX: number = 0, targetY: number = 0): Variants => ({
  hidden: {
    opacity: 0,
    y: 40,
    rotate: 0,
    x: 0,
  },
  visible: {
    opacity: 1,
    y: targetY,
    x: targetX,
    rotate: targetRotate,
    transition: {
      duration: 0.8,
      ease: awardEase,
    },
  },
});
