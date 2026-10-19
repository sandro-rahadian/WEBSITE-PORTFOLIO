"use client";

import { usePathname } from "next/navigation";
import FloatingMenu from "@/components/ui/liquid-morph-floating-menu";

// The section ids live here now, in one place. They were previously duplicated
// between this file and Contact.tsx, which is how the footer's Certifications
// link ended up pointing at #certifications while the section's real id is
// light-zone -- a target that resolved to null, so the link did nothing at all.
// Anything that scrolls to a section imports this instead of retyping an id.

// The StackSpread stage used to be a separate section and was merged into
// #light-zone, but the old id survived in the footer nav. That is the dangling
// reference, not a rename that was forgotten elsewhere.
export const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  // #work now leads with the experience timeline rather than a project grid.
  { id: "work", label: "Experiences" },
  { id: "light-zone", label: "Certifications" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
] as const;

export default function FloatingNav() {
  const pathname = usePathname();

  // The CV page carries its own header nav. Keeping the floating pill there as
  // well would double the chrome, and every section target would be dead --
  // getElementById returns null on a route that has no sections.
  if (pathname !== "/") return null;

  return (
    <FloatingMenu
      items={SECTIONS.map((s) => ({
        label: s.label,
        onClick: () => scrollToSection(s.id),
      }))}
    />
  );
}

/* One scroll implementation, null-safe on purpose: an id that no longer exists
   must not throw, and must not silently do nothing either -- it warns, because a
   dead nav entry is invisible until someone reports it. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[nav] no element with id="${id}" -- check section-targets.ts`);
    }
    return;
  }
  el.scrollIntoView({ behavior: "smooth" });
}
