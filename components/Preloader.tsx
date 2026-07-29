"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";
import DottedBackground from "@/components/ui/DottedBackground";
import { heroShaderColors, surface } from "@/lib/tokens";
import type { Dict } from "@/lib/i18n";

/**
 * Opening sequence. The hero is already mounted underneath — this only hides
 * it, plays the word cycle, then dissolves and hands over to the reveal
 * timeline. Nothing is animated except opacity and transform.
 *
 * Timing note: WORD_CYCLE is the knob. At 0.72 each word settles, holds, and
 * leaves without ever feeling like a ticker — with three words the hero starts
 * revealing at ~2.8s. Lower it to 0.5 for a ~2.2s open.
 */
const LOGO_IN = 0.6;
const WORDS_AT = 0.5;
const WORD_IN = 0.55;
const WORD_OUT = 0.5;
const WORD_CYCLE = 0.72;
/* How far the outgoing word's exit reaches back into the next word's entrance —
   a wide overlap is what keeps the swap continuous instead of stepped. */
const WORD_OVERLAP = 0.22;
const WORD_BLUR = 6;
const OUTRO = 0.6;

export default function Preloader({ dict }: { dict: Dict }) {
  const root = useRef<HTMLDivElement>(null);
  /* The sheet's own canvas is torn down once it has faded — no WebGL loop is
     left running behind an invisible element for the rest of the session. */
  const [ownBg, setOwnBg] = useState(true);
  const t = dict.preloader;

  useGSAP(
    () => {
      /* A refresh part-way down the page restores the old scroll position, and
         the sequence would open over whatever section happened to be there.
         This runs in a layout effect, before paint, so there is no jump. */
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      window.scrollTo(0, 0);

      /* The page is frozen for the duration of the sequence. Capture-phase and
         non-passive so preventDefault actually lands, and it beats the
         smoother's own observers. ScrollSmoother.paused() covers the smoothed
         content on top of that; it only exists under no-preference, and it is
         created after this layout effect, hence the frame's wait. */
      const SCROLL_KEYS = new Set([
        " ",
        "Spacebar",
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
      ]);
      const listen: AddEventListenerOptions = { passive: false, capture: true };
      const blockEvent = (e: Event) => e.preventDefault();
      const blockKeys = (e: KeyboardEvent) => {
        if (SCROLL_KEYS.has(e.key)) e.preventDefault();
      };
      let locked = true;

      window.addEventListener("wheel", blockEvent, listen);
      window.addEventListener("touchmove", blockEvent, listen);
      window.addEventListener("keydown", blockKeys, listen);
      requestAnimationFrame(() => {
        if (locked) ScrollSmoother.get()?.paused(true);
      });

      const unlock = () => {
        if (!locked) return;
        locked = false;
        window.removeEventListener("wheel", blockEvent, listen);
        window.removeEventListener("touchmove", blockEvent, listen);
        window.removeEventListener("keydown", blockKeys, listen);
        ScrollSmoother.get()?.paused(false);
      };

      const q = gsap.utils.selector(root);
      const logo = q("[data-logo]");
      const words = q("[data-word]");

      const pick = (sel: string) => Array.from(document.querySelectorAll(sel));
      const nav = pick("[data-nav-reveal]");
      const shader = pick("[data-hero-shader]");
      const eyebrow = pick("[data-hero-eyebrow]");
      const title = pick("[data-hero-title]");
      const desc = pick("[data-hero-desc]");
      const ctas = pick("[data-hero-cta]");
      const features = pick("[data-hero-feature]");

      const content = [...nav, ...eyebrow, ...title, ...desc, ...ctas, ...features];

      /* matchMedia rather than a manual media query: GSAP reverts everything
         it created here if the user flips the OS setting mid-session, and on
         unmount. */
      const mm = gsap.matchMedia();

      mm.add(
        {
          full: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          /* Only the hero's *content* starts hidden — the dot matrix behind it
             stays on screen through the whole sequence, so the sheet is a layer
             of words over the finished background rather than a separate white
             screen that has to be traded for one. autoAlpha also flips
             visibility, so hidden elements stay out of the a11y tree. */
          gsap.set([...content, ...shader], { autoAlpha: 0 });

          if (ctx.conditions?.reduce) {
            /* No word cycle, no travel — just the mark, held and released. */
            gsap.set(logo, { autoAlpha: 1, scale: 1 });
            const quick = gsap
              .timeline()
              .to([...shader, ...content], { autoAlpha: 1, duration: 0.4 })
              .to(
                root.current,
                { autoAlpha: 0, duration: 0.4, onComplete: () => setOwnBg(false) },
                0
              );
            return () => quick.kill();
          }

          gsap.set(nav, { y: -16 });
          gsap.set(eyebrow, { y: 20 });
          gsap.set(title, { y: 28 });
          gsap.set(desc, { y: 20 });
          gsap.set(ctas, { y: 20 });
          gsap.set(features, { y: 12 });
          gsap.set(logo, { autoAlpha: 0, scale: 0.96 });
          gsap.set(words, { autoAlpha: 0, y: 10, filter: `blur(${WORD_BLUR}px)` });

          /* The hero, revealed from the top down. Every step overlaps the one
             before it — the offsets are far shorter than the durations, so the
             page arrives as a single swell instead of six separate entrances.
             The shader is absent here: it came up during the opening and simply
             keeps running. */
          const reveal = gsap
            .timeline({ defaults: { ease: "power3.out", duration: 0.7 } })
            .to(nav, { autoAlpha: 1, y: 0 }, 0)
            .to(eyebrow, { autoAlpha: 1, y: 0 }, 0.1)
            .to(title, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.16)
            .to(desc, { autoAlpha: 1, y: 0 }, 0.24)
            .to(ctas, { autoAlpha: 1, y: 0, stagger: 0.08 }, 0.32)
            .to(features, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.07 }, 0.42)
            /* Hand the hero back to CSS: no inline transform or visibility left
               behind to sit in front of hover states or make containing blocks.
               Named properties only — clearProps:"all" blanks the whole style
               attribute (CSSPlugin sets style.cssText = ""), which would take
               React's own inline styles with it: the h1's swsh feature, the
               nav's transition easing, and the shader's radial mask. */
            .set([...content, ...shader], { clearProps: "x,y,opacity,visibility" });

          const master = gsap.timeline();
          master
            /* The dots ease up underneath the sequence — never a hard cut-in,
               and it covers the WebGL canvas warming up. */
            .to(shader, { autoAlpha: 1, duration: 1.2, ease: "sine.out" }, 0)
            .to(logo, { autoAlpha: 1, scale: 1, duration: LOGO_IN, ease: "power2.out" }, 0);

          words.forEach((word, i) => {
            const at = WORDS_AT + i * WORD_CYCLE;
            master
              /* Each word resolves out of a soft focus rather than snapping in. */
              .to(
                word,
                { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: WORD_IN, ease: "power2.out" },
                at
              )
              /* Leaves as the next one arrives — a crossfade, never a gap. */
              .to(
                word,
                {
                  autoAlpha: 0,
                  y: -10,
                  filter: `blur(${WORD_BLUR}px)`,
                  duration: WORD_OUT,
                  ease: "power1.inOut",
                },
                at + WORD_CYCLE - WORD_OVERLAP
              );
          });

          /* The sheet dissolves while the last word is still leaving, and the
             hero starts arriving before the sheet is gone — the two never queue
             behind one another. */
          const outroAt = WORDS_AT + words.length * WORD_CYCLE - 0.1;
          master
            .to(
              root.current,
              {
                autoAlpha: 0,
                duration: OUTRO,
                ease: "power2.out",
                onComplete: () => {
                  unlock();
                  setOwnBg(false);
                },
              },
              outroAt
            )
            .add(reveal, outroAt + 0.15);

          return () => master.kill();
        }
      );

      /* Never leave the page frozen if this unmounts mid-sequence. */
      return () => unlock();
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      data-preloader
      aria-hidden="true"
      /* Self-contained: its own page fill and its own dot matrix, so the
         sequence looks identical no matter where the page was scrolled when it
         loaded. Matches the hero's field exactly, and the hero's own canvas is
         already at full opacity underneath by the time this dissolves. */
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-page"
    >
      {ownBg && (
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          aria-hidden="true"
          style={{
            maskImage: "radial-gradient(ellipse at center, transparent 8%, black 45%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, transparent 8%, black 45%)",
          }}
        >
          <DottedBackground
            bgColor={surface}
            frequency={1.5}
            speed={2}
            cellSize={6}
            gamma={7}
            paletteBias={-5}
            colors={heroShaderColors}
          />
        </div>
      )}

      {/* Sized against the viewport, not the glyphs: the mark and the line
          below it read as one block in the middle of the white field. */}
      <div className="flex w-full max-w-[680px] flex-col items-center px-6">
        <Image
          data-logo
          src="/images/logo-navy.svg"
          alt=""
          width={120}
          height={71}
          className="h-[57px] w-auto sm:h-[70px]"
          priority
        />

        {/* Fixed box — the words are stacked, so nothing reflows as they swap.
            Tall enough for the largest step so Arabic descenders never clip. */}
        <div className="relative mt-[36px] h-[58px] w-full sm:mt-[44px] sm:h-[76px]">
          {t.words.map((word) => (
            <span
              key={word}
              data-word
              dir="auto"
              className="absolute inset-0 flex items-center justify-center whitespace-nowrap font-display text-[34px] font-semibold leading-none text-accent sm:text-[46px]"
              /* swsh matches the rest of the site. The face also ships salt,
                 dlig and ss01/ss03–ss07 if more calligraphic forms are wanted. */
              style={{ fontFeatureSettings: '"swsh"', willChange: "filter, opacity, transform" }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
