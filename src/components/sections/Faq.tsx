"use client";

import { useState } from "react";

/* Rewritten from generic freelance boilerplate ("typical engagement", "do you
   sign NDAs", "how do you price work") to things about this person that are
   genuinely confusing from the outside. Every answer is grounded in something
   verifiable on the rest of the page -- the timeline, the certificates, the
   projects -- so nothing here is a claim the portfolio does not already show.

   The split is 5 left / 4 right (unchanged, see left/right below) because the
   section is a two-column grid that reads top-to-bottom per column. */
const FAQ = [
  {
    q: "Are you a frontend or a backend developer?",
    a: "Backend. I specialise in APIs, databases and server-side logic -- Node.js, Prisma, PostgreSQL, REST. The frontend work exists, but it is not where I want to be known.",
  },
  {
    q: "You write about APIs. Is that the same as backend development?",
    a: "No, and the distinction matters. API work means designing the contract between two systems and keeping it stable under change. Backend development is everything behind that contract: storage, auth, validation, migrations. Most people use the words interchangeably, which is why bad APIs get built.",
  },
  {
    q: "What was Simpuli, and is it still running?",
    a: "Simpuli is an e-commerce platform I founded and built end to end in 2025 -- the whole stack, not a slice of it. It was my first real product with real users, which taught me more about shipping than any course did.",
  },
  {
    q: "Are the certificates on this page real?",
    a: "Yes, and they are the actual files, not badges. Telkom for Next.js and NestJS, Dicoding for AWS cloud and Gen AI, HackerRank for JavaScript and Node.js at Intermediate, plus a Python one from Samsung Innovation. Click any of them to see it full size.",
  },
  {
    q: "What is Spec-Driven Development?",
    a: "Writing the specification before the code, and treating it as the thing being built. A spec that cannot be tested is a wish. It is why I was drawn to Kiro, and it is how I keep scope from quietly growing mid-build.",
  },
  {
    q: "You are still at SMK Telkom Malang. How much can you actually deliver?",
    a: "The timeline on this page is the honest answer: production backend work at a company, leading a national competition team, and running my own product, all while finishing school. I would rather show that timeline than assert seniority.",
  },
  {
    q: "Why so many certificates if you already work on real projects?",
    a: "They are not a substitute for the work, they fill a gap the work cannot. School gives structure and theory; the certificates prove I can finish external assessment on the exact tools I use, rather than only in a self-directed setting.",
  },
  {
    q: "Do you work with design or frontend teams, or only solo?",
    a: "I have shipped inside teams where the backend had to be built against a design that was still moving. I am most useful where the frontend is decided and the contract underneath it has not been written yet.",
  },
  {
    q: "What do you want work on next?",
    a: "Backend problems with real users and real consequences -- payments, inventory, auth, anything where getting it wrong costs something. Portfolio pieces do not teach you what a slow query feels like at 3am.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const left = FAQ.slice(0, 5);
  const right = FAQ.slice(5);

  return (
    <section
      id="faq"
      className="w-full"
      style={{
        background: "var(--bg-dark)",
        position: "relative",
        zIndex: 1,
        marginTop: "max(-24px, -4.29vw)",
        paddingTop: "var(--section-pad-y)",
        paddingBottom: "var(--section-pad-y)",
      }}
    >
      <div style={{ paddingLeft: "var(--gutter-b)", paddingRight: "var(--gutter-b)" }}>
        <h3 className="t-card-title m-0 text-white">Frequently Asked Questions</h3>
      </div>

      <div
        className="mt-[var(--section-pad-y)] grid grid-cols-1 gap-[var(--grid-gap-tight)] md:grid-cols-2"
        style={{ paddingLeft: "var(--gutter-b)", paddingRight: "var(--gutter-b)" }}
      >
        <div className="flex flex-col gap-[var(--grid-gap-tight)]">
          {left.map((item, i) => (
            <FaqItem
              key={item.q}
              item={item}
              index={i}
              open={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>
        <div className="flex flex-col gap-[var(--grid-gap-tight)]">
          {right.map((item, i) => {
            const index = left.length + i;
            return (
              <FaqItem
                key={item.q}
                item={item}
                index={index}
                open={open === index}
                onToggle={() => setOpen(open === index ? null : index)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FaqItem({
  item,
  index,
  open,
  onToggle,
}: {
  item: { q: string; a: string };
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`faq-a-${index}`}
        id={`faq-q-${index}`}
        className="flex w-full cursor-pointer items-center justify-between gap-4 border-0 text-left outline-offset-4 focus-visible:outline focus-visible:outline-2"
        style={{
          minHeight: "var(--faq-item-h)",
          background: "var(--surface-04)",
          borderRadius: "var(--r-card)",
          paddingTop: "var(--pad-faq-y)",
          paddingBottom: "var(--pad-faq-y)",
          paddingLeft: "var(--pad-faq-x)",
          paddingRight: "var(--pad-faq-x)",
          color: "#ffffff",
          fontSize: "var(--fs-body)",
          fontWeight: 500,
          letterSpacing: "var(--ls-faq-q)",
          lineHeight: 1.3,
        }}
      >
        <span>{item.q}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          aria-hidden="true"
          style={{
            flexShrink: 0,
            transform: open ? "rotate(45deg)" : "none",
            transition: "transform 200ms ease",
          }}
        >
          <path
            d="M7 1v12M1 7h12"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div
        id={`faq-a-${index}`}
        role="region"
        aria-labelledby={`faq-q-${index}`}
        hidden={!open}
        className="m-0"
        style={{
          paddingTop: 12,
          paddingLeft: "var(--pad-faq-x)",
          paddingRight: "var(--pad-faq-x)",
          fontSize: "var(--fs-body-s)",
          fontWeight: 500,
          letterSpacing: "normal",
          lineHeight: 1.3,
          color: "var(--text-dim-60)",
        }}
      >
        {item.a}
      </div>
    </div>
  );
}
