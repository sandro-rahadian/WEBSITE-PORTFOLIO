"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const ease = [0.22, 1, 0.36, 1] as const;

/* Widths for the three states. The expanded bar is deliberately wider than the
   viewport is tall -- it is a full-bleed header strip at the top of the page,
   while 150px is the original compact pill. */
const WIDTH_OPEN = 280;
const WIDTH_PILL = 150;
const WIDTH_WIDE = 520;

interface MenuItem {
  label: string;
  onClick?: () => void;
}

interface FloatingMenuProps {
  items?: MenuItem[];
}

/* The per-character roll used by BOTH nav surfaces.
   Each glyph is duplicated and stacked inside a 1em overflow-hidden box, so
   hovering slides the inner copy up by exactly its own height while the
   duplicate hides the gap. The 30ms-per-index stagger is what makes it read
   as text rolling rather than the whole word jumping.

   Previously this only lived inside MenuButton (the open dropdown), so the wide
   bar's inline links had a plain `hover:text-white` with no motion at all. The
   guard matters on both: without it, a pointer that leaves mid-stagger snaps
   `hovered` false and the remaining glyphs jump back to the unrolled copy. */
function useCharRoll(text: string) {
  const [hovered, setHovered] = useState(false);
  const animatingRef = useRef(false);
  const pendingLeaveRef = useRef(false);
  const lockDuration = 30 * text.length + 300;

  const onEnter = useCallback(() => {
    pendingLeaveRef.current = false;
    if (hovered) return;
    setHovered(true);
    animatingRef.current = true;
    setTimeout(() => {
      animatingRef.current = false;
      if (pendingLeaveRef.current) {
        pendingLeaveRef.current = false;
        setHovered(false);
      }
    }, lockDuration);
  }, [hovered, lockDuration]);

  const onLeave = useCallback(() => {
    if (animatingRef.current) {
      pendingLeaveRef.current = true;
    } else {
      setHovered(false);
    }
  }, []);

  return { hovered, onEnter, onLeave };
}

/* Renders `text` as the rolling glyph strip. `uppercase` and the font size are
   the caller's; only the roll is shared. */
function RollingText({
  text,
  hovered,
  className,
  style,
}: {
  text: string;
  hovered: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span className={className} style={style} aria-label={text}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-top"
          style={{ height: "1em" }}
        >
          <span
            className="flex flex-col"
            style={{
              transitionProperty: "transform",
              transitionDuration: hovered ? "800ms" : "0ms",
              transitionDelay: hovered ? `${30 * i}ms` : "0ms",
              transform: hovered ? "translateY(-50%)" : "translateY(0%)",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <span className="block" style={{ height: "1em", lineHeight: "1em" }}>
              {char}
            </span>
            <span
              className="block"
              style={{ height: "1em", lineHeight: "1em" }}
              aria-hidden
            >
              {char}
            </span>
          </span>
        </span>
      ))}
    </span>
  );
}

/* An inline link for the wide bar. Same glyph roll as the dropdown's
   MenuButton, so hovering reads identically in both states -- previously this
   was a flat button whose only hover response was a colour change. */
function NavLink({ label, onClick }: { label: string; onClick?: () => void }) {
  const { hovered, onEnter, onLeave } = useCharRoll(label);

  return (
    <button
      type="button"
      className="leading-none whitespace-nowrap"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <RollingText
        text={label}
        hovered={hovered}
        className="text-[13px] md:text-[15px]"
        style={{
          fontFamily: "var(--font-switzer), sans-serif",
          letterSpacing: "-0.02em",
          lineHeight: "1em",
          /* The roll needs the label to brighten on hover, so the colour
             transition lives here rather than on the button -- a `hover:`
             class cannot reach inside the glyph spans. */
          color: hovered ? "#ffffff" : "rgba(255,255,255,0.6)",
          transition: "color 300ms",
        }}
      />
    </button>
  );
}

function MenuButton({
  label,
  onClick,
  isOpen,
  index,
}: {
  label: string;
  onClick?: () => void;
  isOpen: boolean;
  index: number;
}) {
  const { hovered, onEnter, onLeave } = useCharRoll(label);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="shrink-0 text-white text-[24px] uppercase leading-none overflow-hidden"
      style={{
        fontFamily: "var(--font-switzer), sans-serif",
        letterSpacing: "-0.03em",
        height: "1em",
      }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{
        duration: 0.4,
        delay: isOpen ? 0.4 + 0.08 * index : 0,
        ease,
      }}
    >
      <div className="flex justify-center">
        <RollingText
          text={label}
          hovered={hovered}
          style={{
            fontFamily: "var(--font-switzer), sans-serif",
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            lineHeight: "1em",
            fontSize: "24px",
          }}
        />
      </div>
    </motion.button>
  );
}

export default function FloatingMenu({ items }: FloatingMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Wide at the top of the page, shrinking to the compact "Menu" pill once
     scrolled. Three states rather than two: the open dropdown always uses the
     pill width, so a scroll landing mid-page must not stretch it back out. */
  const { scrollY } = useScroll();
  const [condensed, setCondensed] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = latest > 80;
    setCondensed((prev) => (prev === next ? prev : next));
  });

  const menuItems: MenuItem[] = items ?? [
    { label: "Home" },
    { label: "Works" },
    { label: "Contact" },
  ];

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  // Escape closes. Pure UX addition, no visual change.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <motion.div
      ref={containerRef}
      className="fixed top-10 left-1/2 z-[100]"
      style={{ x: "-50%", pointerEvents: "auto" }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
    >
      <motion.div
        className="relative overflow-hidden flex flex-col"
        onClick={() => {
          if (!isOpen) setIsOpen(true);
        }}
        style={{
          fontFamily: "var(--font-switzer), sans-serif",
          letterSpacing: "-0.02em",
          cursor: isOpen ? "default" : "pointer",
        }}
        animate={{
          width: isOpen ? WIDTH_OPEN : condensed ? WIDTH_PILL : WIDTH_WIDE,
          height: isOpen ? 260 : 48,
          borderRadius: isOpen ? 32 : condensed ? 72 : 26,
          scale: 1,
        }}
        whileHover={isOpen ? undefined : { scale: 1.05 }}
        transition={{
          duration: reducedMotion ? 0 : 0.8,
          ease,
          height: { duration: isOpen ? 0.8 : 0.15 },
          scale: { duration: 0.25, ease },
        }}
      >
        {/* Glass background layer. Colours come from the site's own surface
            tokens (--surface-pill family) so it matches .glass-chip and
            GradualBlur rather than reading as a separate component. No outline
            per request -- the edge is defined by the blur itself. */}
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundColor: "rgba(21, 21, 21, 0.62)",
          }}
          transition={{ duration: isOpen ? 0.1 : 0.3, ease }}
          style={{
            borderRadius: "inherit",
            backdropFilter: "blur(24px) saturate(190%)",
            WebkitBackdropFilter: "blur(24px) saturate(190%)",
          }}
        />

        {/* Dark circle expanding from bottom -- the morph. Kept translucent so
            the page reads through it, dark enough (0.72) to hold white items. */}
        <motion.div
          className="absolute left-1/2"
          style={{
            width: "200%",
            height: "200%",
            borderRadius: "50%",
            x: "-50%",
            backgroundColor: "rgba(5, 5, 5, 0.68)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
          animate={{ bottom: isOpen ? "-20%" : "-200%" }}
          transition={{
            duration: 0.8,
            ease,
            delay: isOpen ? 0.1 : 0,
          }}
        />

        {/* Menu items */}
        <div
          className="relative z-10 flex flex-col gap-1 items-center justify-center"
          style={{
            pointerEvents: isOpen ? "auto" : "none",
            opacity: isOpen ? 1 : 0,
            flex: isOpen ? 1 : 0,
            overflow: "hidden",
          }}
        >
          {menuItems.map((item, idx) => (
            <MenuButton
              key={item.label}
              label={item.label}
              onClick={() => {
                item.onClick?.();
                setIsOpen(false);
              }}
              isOpen={isOpen}
              index={idx}
            />
          ))}
        </div>

        {/* Bottom bar: Menu + hamburger */}
        <motion.div
          className="relative z-10 flex items-center w-full shrink-0"
          onClick={() => setIsOpen(!isOpen)}
          animate={{
            paddingLeft: isOpen ? 24 : 20,
            paddingRight: isOpen ? 24 : 20,
            paddingBottom: isOpen ? 24 : 0,
            height: 48,
            /* Menu, links and hamburger spread across the strip in the wide
               state, and across the narrow pill when condensed or open. No
               justify-between in the className -- a static utility there wins
               over this and left the links stacked on top of each other. */
            justifyContent: "space-between",
            gap: 0,
          }}
          transition={{ duration: reducedMotion ? 0 : 0.8, ease }}
          style={{ alignItems: "center" }}
        >
          <motion.span
            className="text-[14px] md:text-[20px] leading-none"
            animate={{ color: "#ffffff" }}
            transition={{ duration: 0.3, ease }}
          >
            Menu
          </motion.span>

          {/* Only in the wide state. Without something in the middle, a 520px
              bar holding one word plus an icon reads as a stretched pill
              rather than a header, so the section links fill the gap.

              pointerEvents flips to "auto" here so these are real links in the
              wide state: clicking one scrolls straight to the section. Left at
              "none" they were unclickable and the click fell through to the
              bar's own onClick, which opened the 280px dropdown -- the user had
              to watch the navbar shrink before navigating anywhere. */}
          <motion.div
            className="flex items-center justify-center gap-6 overflow-hidden"
            animate={{
              opacity: !isOpen && !condensed ? 1 : 0,
              pointerEvents: !isOpen && !condensed ? "auto" : "none",
            }}
            transition={{ duration: reducedMotion ? 0 : 0.4, ease }}
          >
            {menuItems.slice(0, 4).map((item) => (
              <NavLink key={item.label} label={item.label} onClick={item.onClick} />
            ))}
          </motion.div>

          <div className="relative w-[24px] h-[24px] flex items-center justify-center">
            <motion.span
              className="absolute block w-[18px] h-[2px] rounded-full"
              animate={{
                rotate: isOpen ? 45 : 0,
                y: isOpen ? 0 : -3,
                backgroundColor: "#ffffff",
              }}
              transition={{ duration: 0.4, ease }}
            />
            <motion.span
              className="absolute block w-[18px] h-[2px] rounded-full"
              animate={{
                rotate: isOpen ? -45 : 0,
                y: isOpen ? 0 : 3,
                backgroundColor: "#ffffff",
              }}
              transition={{ duration: 0.4, ease }}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
