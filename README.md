# Sandro — Website Portfolio

A portfolio for [Sandro Rahadian](https://github.com/sandro-rahadian) — independent designer & developer. Built to showcase work, skills, certifications, experience, and contact in one place, with a heavy emphasis on motion and typography.

## Stack

- **Framework:** Next.js (App Router, React, TypeScript)
- **Styling:** Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com/) (new-york)
- **Motion:** Framer Motion, Lenis smooth-scroll, custom motion primitives
- **Fonts:** self-hosted Switzer (sans) + Newsreader (serif) via `next/font`
- **Icons / effects:** custom — shader layer, liquid morph menu, halftone word, scroll-velocity text, 3D stack spread, thumbnail carousel, click-spark

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Project Structure

```
src/
  app/            routes, fonts, globals.css, layout, page
  components/     sections, ui, shared components
  hooks/          usePrefersReducedMotion, useStreamText
  providers/      SmoothScroll (Lenis)
  lib/            utils, section-targets
docs/             design.md, motion-spec.md, build handoff
```

## Design Notes

The site is built from a full reference capture of [midu.design](https://midu.design) (forensic screenshots + computed styles) and reorganized into a portfolio layout. Every type, spacing, radius, and color decision is documented in [`docs/design.md`](docs/design.md) — including the proportional scaling system (1049px reference → fluid `clamp()` values), per-section color tokens, and motion specs in [`docs/motion-spec.md`](docs/motion-spec.md).

## Accessibility

- `prefers-reduced-motion` respected via `usePrefersReducedMotion`
- Color-contrast-audited in `docs/design.md` (AA pass expected on all remaining text roles)
- `aria-hidden` for decorative ghost/parallax layers

## License

[MIT](LICENSE)
