"use client";

import { motion } from "framer-motion";

/* [cv] Matches the reveal character used elsewhere on the site (Work/About use
   ScrollReveal's blur + rotate; paragraphs use framer-motion), kept as its own
   client component so /cv can stay a server component -- the build-time PDF mtime
   is read with node:fs, which a client component cannot do.
 *
   Reduced motion is NOT branched here. useReducedMotion() returns null on the
   server and a boolean on the client, so an early return would make the two
   renders differ and React would throw a hydration mismatch. The markup is
   always identical; the `.cv-reveal` rule in the CV stylesheet neutralises the
   animation for users who asked for it. */
export default function CvReveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
