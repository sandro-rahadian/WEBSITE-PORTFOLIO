"use client";

import { useLenis as useLenisContext } from "@/components/LenisProvider";

export function useLenis() {
  const { lenis } = useLenisContext();

  const scrollTo = (target: string | number | HTMLElement, options?: { offset?: number; duration?: number }) => {
    if (lenis) {
      lenis.scrollTo(target, options);
    } else if (typeof target === "string" && target.startsWith("#")) {
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return {
    lenis,
    scrollTo,
  };
}
