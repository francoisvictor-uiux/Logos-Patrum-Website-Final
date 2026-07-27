"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const wrapper = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const smoother = ScrollSmoother.create({
          wrapper: "#smooth-wrapper",
          content: "#smooth-content",
          smooth: 1.15,
          effects: true,
        });

        // Single-element reveals
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 28,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          });
        });

        // Staggered group reveals
        gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
          const items = group.querySelectorAll("[data-reveal-item]");
          if (!items.length) return;
          gsap.from(items, {
            autoAlpha: 0,
            y: 24,
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: group, start: "top 86%" },
          });
        });

        // Route anchor clicks through the smoother (header is fixed outside it)
        const onClick = contextSafe!((e: MouseEvent) => {
          const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
          if (!anchor) return;
          const href = anchor.getAttribute("href")!;
          if (href === "#" || href === "#top") {
            e.preventDefault();
            smoother.scrollTo(0, true);
            return;
          }
          const target = document.querySelector(href);
          if (!target) return;
          e.preventDefault();
          smoother.scrollTo(target, true, "top 110px");
        });
        document.addEventListener("click", onClick);

        return () => document.removeEventListener("click", onClick);
      });
    },
    { scope: wrapper }
  );

  return (
    <div id="smooth-wrapper" ref={wrapper}>
      <div id="smooth-content">{children}</div>
    </div>
  );
}
