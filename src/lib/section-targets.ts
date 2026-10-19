/* Single source of truth for in-page scroll targets.
 *
 * The section ids were duplicated between FloatingNav and Contact, and the two
 * copies drifted: the footer kept "#certifications" after that section had been
 * merged into #light-zone, so the link resolved to null and silently did
 * nothing. Both files now read from here, so a rename has one place to land.
 *
 * Verified against the ids actually rendered on /:
 *   hero, about, work, light-zone, faq, contact
 */

export const SECTION_TARGETS = {
  home: "hero",
  about: "about",
  /* Leads with the experience timeline, not a project grid. */
  experiences: "work",
  /* The Certifications section; StackSpread's stage used to live under this
     separate id and was merged into it. */
  certifications: "light-zone",
  faq: "faq",
  contact: "contact",
} as const;

export type SectionTarget = (typeof SECTION_TARGETS)[keyof typeof SECTION_TARGETS];