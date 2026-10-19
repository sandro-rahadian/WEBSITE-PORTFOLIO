"use client";

import Wordmark from "@/components/Wordmark";
import { SECTION_TARGETS } from "@/lib/section-targets";

const LINKS = {
  // Targets come from lib/section-targets so this list and the floating navbar
  // cannot drift apart again. They did once: the footer kept #certifications
  // after that section had been merged into #light-zone, and the link resolved
  // to null and did nothing at all.
  Explore: [
    { label: "Experiences", href: `#${SECTION_TARGETS.experiences}` },
    { label: "Certifications", href: `#${SECTION_TARGETS.certifications}` },
    { label: "FAQ", href: `#${SECTION_TARGETS.faq}` },
  ],
  Socials: [
    { label: "Email", href: "mailto:fransiscusalessandrorahadian@gmail.com" },
    { label: "GitHub", href: "https://github.com/sandro-rahadian" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/fransiscus-alessandro-rahadian/",
    },
  ],
};

export default function Contact() {
  return (
    <footer
      id="contact"
      className="relative w-full overflow-hidden"
      style={{ background: "var(--bg-dark)", paddingTop: "var(--section-pad-y)" }}
    >
      <div style={{ paddingLeft: "var(--gutter-a)", paddingRight: "var(--gutter-a)" }}>
        <h2
          className="t-footer-tagline m-0 max-w-[390px] text-white"
        >
          Backend that holds up when traffic isn't kind.
        </h2>

        <a
          href="mailto:fransiscusalessandrorahadian@gmail.com"
          className="t-body t-cta-contact mt-8 inline-flex items-center gap-2 no-underline outline-offset-4 focus-visible:outline focus-visible:outline-2"
          style={{
            width: "var(--cta-contact-w)",
            height: "var(--cta-contact-h)",
            paddingLeft: "var(--pad-pill-x)",
            paddingRight: "var(--pad-pill-x)",
            background: "var(--cta-02)",
            borderRadius: "var(--r-pill)",
            color: "var(--text-on-solid)",
            fontWeight: 500,
            letterSpacing: "var(--ls-body)",
          }}
        >
          <svg
            className="contact-spark shrink-0"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            aria-hidden="true"
          >
            <path
              d="M7 0C7 4 4 7 0 7c4 0 7 3 7 7 0-4 3-7 7-7-4 0-7-3-7-7Z"
              fill="#030303"
            />
          </svg>
          Get in touch
        </a>

        <div className="mt-[var(--section-pad-y)] flex justify-between gap-8">
          {(Object.keys(LINKS) as (keyof typeof LINKS)[]).map((group) => (
            <div key={group} className={group === "Socials" ? "text-right" : ""}>
              <p
                className="t-caption m-0"
                style={{ color: "var(--text-dim-60)" }}
              >
                {group}
              </p>
              <ul className="m-0 mt-2 flex list-none flex-col p-0" style={{ gap: 0 }}>
                {LINKS[group].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="inline-flex items-center no-underline outline-offset-4 focus-visible:outline focus-visible:outline-2"
                      style={{
                        minHeight: 44,
                        minWidth: 44,
                        paddingLeft: 0,
                        paddingRight: 0,
                        fontSize: "var(--fs-body-s)",
                        fontWeight: 400,
                        letterSpacing: "var(--ls-body-s)",
                        lineHeight: 1.25,
                        color: "#ffffff",
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-[var(--section-pad-y)] flex flex-wrap items-center justify-between gap-4 pb-6">
          <p className="t-micro m-0" style={{ color: "var(--text-dim-60)" }}>
            © 2026 Sandro, ALL RIGHTS RESERVED
          </p>
          <div className="flex items-center" style={{ gap: 8 }}>
            <a
              href="#hero"
              className="t-micro inline-flex items-center no-underline outline-offset-4 focus-visible:outline focus-visible:outline-2"
              style={{ color: "var(--text-dim-60)", minHeight: 44, minWidth: 44 }}
            >
              TERMS
            </a>
            <a
              href="#hero"
              className="t-micro inline-flex items-center no-underline outline-offset-4 focus-visible:outline focus-visible:outline-2"
              style={{ color: "var(--text-dim-60)", minHeight: 44, minWidth: 44 }}
            >
              PRIVACY POLICY
            </a>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none select-none overflow-hidden"
        style={{ marginTop: -24, marginBottom: -120 }}
      >
        <Wordmark
          variant="footer"
          style={{
            fontSize: "clamp(72px, 22.9vw, 330px)",
            width: "100%",
          }}
        />
      </div>
    </footer>
  );
}
