"use client";

import React from "react";
import { useLenis } from "@/hooks/useLenis";

export function NavCorners() {
  const { scrollTo } = useLenis();

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    target: string
  ) => {
    e.preventDefault();
    scrollTo(target);
  };

  return (
    <>
      {/* Top Left: Logo / Brand */}
      <a
        href="#"
        onClick={(e) => handleNavClick(e, "top")}
        className="corner-nav corner-top-left group cursor-pointer"
        aria-label="Scroll to top"
      >
        <span>yx</span>
        <span className="text-[var(--token-orange)] group-hover:rotate-45 inline-block transition-transform duration-200">
          *
        </span>
      </a>

      {/* Top Right: Work */}
      <a
        href="#work"
        onClick={(e) => handleNavClick(e, "#work")}
        className="corner-nav corner-top-right cursor-pointer"
        aria-label="Scroll to work section"
      >
        work
      </a>

      {/* Bottom Left: About */}
      <a
        href="#about"
        onClick={(e) => handleNavClick(e, "#about")}
        className="corner-nav corner-bottom-left cursor-pointer"
        aria-label="Scroll to about section"
      >
        about
      </a>

      {/* Bottom Right: Lab */}
      <a
        href="#lab"
        onClick={(e) => handleNavClick(e, "#lab")}
        className="corner-nav corner-bottom-right cursor-pointer"
        aria-label="Scroll to lab section"
      >
        lab
      </a>
    </>
  );
}
