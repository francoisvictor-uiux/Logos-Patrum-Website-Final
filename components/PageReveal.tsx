"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

/**
 * PageReveal — listens for the custom "page-reveal" event fired by the Loader,
 * then runs a GSAP entrance animation on all elements that carry [data-reveal] or
 * individual [data-reveal-item] attributes.
 *
 * Wrap this around {children} in the layout so the whole page is covered.
 */
export default function PageReveal({ children }: { children: React.ReactNode }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [ready, setReady] = React.useState(false);

  // Listen for the loader to signal "done"
  React.useEffect(() => {
    const handler = () => setReady(true);
    window.addEventListener("page-reveal", handler);
    return () => window.removeEventListener("page-reveal", handler);
  }, []);

  useGSAP(
    () => {
      if (!ready || !containerRef.current) return;

      const ctx = gsap.context(() => {
        // ── Hero section elements ────────────────────────────────────────────
        // Any element with data-reveal-item gets a staggered fade-up
        const items = gsap.utils.toArray<HTMLElement>("[data-reveal-item]");

        if (items.length) {
          gsap.fromTo(
            items,
            { y: 48, opacity: 0, scale: 0.97 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.12,
              clearProps: "all",
            }
          );
        }

        // ── Any section with data-reveal gets a simple fade-up ───────────────
        const sections = gsap.utils.toArray<HTMLElement>("[data-reveal]:not([data-reveal-item])");

        if (sections.length) {
          gsap.fromTo(
            sections,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.0,
              ease: "power3.out",
              stagger: 0.15,
              clearProps: "all",
            }
          );
        }

        // ── Navbar ────────────────────────────────────────────────────────────
        const nav = document.querySelector("[data-reveal-nav]");
        if (nav) {
          gsap.fromTo(
            nav,
            { y: -80, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", clearProps: "all" }
          );
        }
      }, containerRef);

      return () => ctx.revert();
    },
    { dependencies: [ready] }
  );

  return (
    <div ref={containerRef} style={{ opacity: ready ? undefined : 0 }}>
      {children}
    </div>
  );
}
