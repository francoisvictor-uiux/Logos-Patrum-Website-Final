"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { Observer } from "gsap/Observer";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, Observer, useGSAP);

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
            y: 32,
            duration: 0.8,
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
            y: 32,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: group, start: "top 86%" },
          });
        });

        /* Observer-driven glide across the hero ↔ pillars boundary. A wheel
           tick or swipe at the top of the page hands the viewport to the next
           section in one eased move; the reverse gesture at the boundary
           glides back. Everything below scrolls natively — hijacking one seam
           is a transition, hijacking the whole page is a cage. */
        const heroEl = document.querySelector("#top");
        const pillarsEl = document.querySelector("#pillars");
        let boundary: Observer | null = null;
        const listen: AddEventListenerOptions = { passive: false, capture: true };
        const block = (e: Event) => e.preventDefault();
        const unblock = () => {
          window.removeEventListener("wheel", block, listen);
          window.removeEventListener("touchmove", block, listen);
        };

        if (heroEl && pillarsEl) {
          let gliding = false;

          const busy = () => {
            if (gliding) return true;
            // The mobile drawer locks the page; respect it.
            if (document.body.style.overflow === "hidden") return true;
            // Never glide while the opening sequence still owns the viewport.
            const pre = document.querySelector<HTMLElement>("[data-preloader]");
            return !!pre && getComputedStyle(pre).visibility !== "hidden";
          };

          const glide = (y: number) => {
            gliding = true;
            // Swallow momentum for the duration so the tween owns the scroll.
            window.addEventListener("wheel", block, listen);
            window.addEventListener("touchmove", block, listen);
            gsap.to(smoother, {
              scrollTop: y,
              duration: 1.1,
              ease: "power2.inOut",
              overwrite: true,
              onComplete: () => {
                unblock();
                gliding = false;
              },
            });
          };

          boundary = Observer.create({
            target: window,
            type: "wheel,touch",
            /* Inverting the wheel makes wheel-down and swipe-up both report as
               "up", so one callback means "advance" on every input. */
            wheelSpeed: -1,
            tolerance: 10,
            onUp: () => {
              if (busy()) return;
              if (smoother.scrollTop() < 40) glide(smoother.offset(pillarsEl, "top top"));
            },
            onDown: () => {
              if (busy()) return;
              const y = smoother.scrollTop();
              // Anywhere between the boundary and the top glides home.
              if (y > 40 && y <= smoother.offset(pillarsEl, "top top") + 60) glide(0);
            },
          });
        }

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

        return () => {
          document.removeEventListener("click", onClick);
          boundary?.kill();
          unblock();
        };
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
