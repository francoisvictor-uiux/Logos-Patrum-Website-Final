# Logos Patrum — Website

Marketing site for Logos Patrum, a research platform for the writings of the
Church Fathers. Next.js App Router, Tailwind CSS v4, GSAP.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root path redirects to
the default locale (`/ar`).

## Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Development server         |
| `npm run build` | Production build           |
| `npm run start` | Serve the production build |
| `npm run lint`  | ESLint                     |

## Structure

```
app/[locale]/        Locale-scoped layout and the single landing page
components/          Header, Footer, SmoothScroll, shared primitives (ui.tsx), icons
components/sections/ One file per landing-page section, in page order
components/ui/       Visual effects (dotted background, smoky/rotating text)
lib/i18n/            Dictionaries (en, ar) and locale config
proxy.ts             Locale redirect for paths without a locale prefix
scripts/shoot.py     Playwright screenshot pass over both locales (dev aid)
```

## Localisation

Arabic is the default locale and the site is Arabic-first; English is reached
through the header switcher. `lib/i18n/en.ts` defines the `Dict` type, so
`ar.ts` must mirror its shape — adding a key to one means adding it to the
other. Direction (`ltr` / `rtl`) is set on `<html>` from the locale.

## Styling

Design tokens (colour, radii, type scale, motion) live in the `@theme` block of
`app/globals.css` and are consumed as Tailwind utilities. Reusable pieces are
the `dm-*` primitive classes plus the components in `components/ui.tsx`. Compose
class names with `cn()` from `lib/utils.ts`.

## Motion

`components/SmoothScroll.tsx` sets up GSAP ScrollSmoother and drives every
reveal. Mark an element with `data-reveal` for a single fade-up, or wrap a group
in `data-reveal-group` with `data-reveal-item` children for a stagger. All of it
is gated behind `prefers-reduced-motion: no-preference`.
