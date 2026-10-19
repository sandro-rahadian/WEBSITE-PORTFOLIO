import type { Metadata } from "next";
import localFont from "next/font/local";
import { statSync } from "node:fs";
import path from "node:path";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import CvReveal from "@/components/cv-reveal";
import ContainerScroll3D from "@/components/ui/container-scroll-3d";
import s from "./cv.module.css";

const FILE = "CV_Fransiscus_Alessandro_Rahadian.pdf";

/* [cv] Newsreader is the reference's face. Self-hosted for the same reason
   Switzer is: no third-party font request on a page that already has a strict
   font contract. One variable file serves all three weights. */
const newsreader = localFont({
  src: [
    { path: "../fonts/Newsreader-latin.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Newsreader-latin.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Newsreader-latin.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-cv",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: false,
});

/* Baked in at build time, so it can never drift from the file it describes the
   way a hand-typed date would. Falls back to null if the PDF is absent. */
function pdfUpdated(): Date | null {
  try {
    return statSync(path.join(process.cwd(), "public", FILE)).mtime;
  } catch {
    return null;
  }
}

const NAV = [
  { label: "about", href: "/#about" },
  { label: "work", href: "/#work" },
  { label: "certifications", href: "/#light-zone" },
  { label: "faq", href: "/#faq" },
  { label: "contact", href: "/#contact" },
];

export const metadata: Metadata = {
  title: "CV — Fransiscus Alessandro Rahadian",
  description:
    "Curriculum vitae of Fransiscus Alessandro Rahadian, backend developer. Download the PDF or read it inline.",
};

export default function CvPage() {
  const updated = pdfUpdated();
  const stamp = updated
    ? updated.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : null;

  return (
    <div className={`${s.page} ${newsreader.variable}`}>
      <header className={s.header}>
        <div className={`${s.wrap} ${s.headerWrap}`}>
          <div className={s.brand}>
            <Link href="/" className={s.siteName}>
              Fransiscus Alessandro Rahadian
            </Link>
            <span className={s.tagline}>Backend Developer, sandro.my.id</span>
          </div>

          <div className={s.navGroup}>
            <nav className={s.nav}>
              {NAV.map((n) => (
                <Link key={n.label} href={n.href} className={s.navLink}>
                  {n.label}
                </Link>
              ))}
              <span className={`${s.navLink} ${s.navLinkActive}`} aria-current="page">
                cv
              </span>
            </nav>
          </div>
        </div>
      </header>

      <main className={s.main}>
        <div className={s.wrap}>
          <h1 className={s.title}>
            <ScrollReveal
              baseOpacity={0}
              enableBlur
              baseRotation={3}
              blurStrength={10}
              rotationEnd="+=720"
              wordAnimationEnd="+=720"
              stagger={0.034}
            >
              CV
            </ScrollReveal>
          </h1>

          <CvReveal className={s.reveal}>
            <p className={s.intro}>
              {stamp
                ? `Last updated: ${stamp}.`
                : "The PDF is not published yet — add it to /public."}
            </p>
          </CvReveal>

          <CvReveal className={s.reveal} delay={0.08}>
            <a className={s.download} href={`/${FILE}`} download={FILE}>
              <span className={s.downloadArrow} aria-hidden="true">
                ↓
              </span>
              Download CV (PDF)
            </a>
          </CvReveal>
        </div>

        {/* The document is now inside a 3D tilt frame driven by page scroll.
            NOTE: data-lenis-prevent is deliberately NOT set here. Lenis
            preventing the wheel here would deadlock the effect -- the tilt only
            advances with page scroll, so blocking scroll over the card would
            leave it permanently stuck at 20deg. Reading the full document is
            what the download button above is for. */}
        <div className={s.runway}>
          <ContainerScroll3D
            containerClassName={s.scrollFrame}
            cardClassName={s.scrollCard}
            /* [INTEGRATION] Taller than the component default so the CV is the
               largest thing on the page. 54rem (864px) still fits inside a 900px
               viewport with the frame's own border and padding, so the document
               never has to scroll to be read -- the tilt is the motion, not the
               reading. */
            cardHeightClass="h-[32rem] md:h-[54rem]"
            /* [INTEGRATION] The runway is taller than the card by design, but the
               sweep is (runway - viewport), and on mobile those nearly cancel:
               64rem - 844px viewport left just 180px of scroll, far too little to
               read a 20deg -> 0 tilt, so the card sat frozen at 20deg. 80rem
               gives ~436px on a 390x844 screen while staying comfortable on
               desktop, where the extra height is harmless dead scroll. */
            heightClass="h-[80rem] md:h-[96rem]"
          >
            <object
              className={s.embedInFrame}
              data={`/${FILE}#view=FitH`}
              type="application/pdf"
              aria-label="Curriculum vitae of Fransiscus Alessandro Rahadian"
            >
              <div className={s.embedFallback}>
                <p>
                  This browser cannot display PDFs inline.{" "}
                  <a href={`/${FILE}`} download={FILE}>
                    Download the CV
                  </a>
                  .
                </p>
              </div>
            </object>
          </ContainerScroll3D>
        </div>
      </main>

      <footer className={s.footer}>
        <div className={s.wrap}>
          © {updated ? updated.getUTCFullYear() : 2026} Fransiscus Alessandro
          Rahadian
        </div>
      </footer>
    </div>
  );
}
