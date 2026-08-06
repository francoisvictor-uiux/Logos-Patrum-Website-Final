"use client";

import { useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";
import {
  BAND_HEIGHT,
  BANDS,
  HEADER_CLEARANCE,
  OUTRO,
  REST,
  STATE_COUNT,
  TRANSLATE,
} from "./states";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP);

/* ===============================================================
   THE ANIMATION LAYER FOR SECTION 05

   Every timeline in the section lives in this file. The components
   that follow are markup and state only — they receive `step` and
   render, and never reach for GSAP themselves.

   The split is deliberate and it is not merely tidiness: the states
   are driven by React, so the same markup has to be correct with no
   script at all. GSAP owns the things that cannot be expressed
   without it — the pin, the scroll clock, the question's blurred
   hand-off, the closing pull-back, and the small perpetual motions
   (caret, glow, counting numbers). Everything a *state* changes —
   which panel is up, which line is lit — is a CSS transition on a
   class, so the section degrades to one complete, legible still.
   =============================================================== */

export type JourneyRefs = {
  /** The <section>. Scope for every selector below. */
  root: RefObject<HTMLElement | null>;
  /** Question + surface + rail. This is what gets pinned. */
  held: RefObject<HTMLDivElement | null>;
  /** The same three, minus the overlay — what pulls back at the close. */
  stage: RefObject<HTMLDivElement | null>;
  /** The application surface, for the entrance. */
  frame: RefObject<HTMLDivElement | null>;
  /** The closing statement, laid over the stage it replaces. */
  overlay: RefObject<HTMLDivElement | null>;
  /** Locale-aware number formatting for the counter in the toolbar. */
  format: (n: number) => string;
};

export type Journey = {
  /** The current state, or REST when the script is not driving. */
  step: number;
  /** REST — no script, or reduced motion: show everything at once. */
  rest: boolean;
  /** Scroll to the middle of a state's band. Used by the rail. */
  goTo: (i: number) => void;
};

export function useJourney({ root, held, stage, frame, overlay, format }: JourneyRefs): Journey {
  const [step, setStep] = useState<number>(REST);
  /* There is deliberately no `outro` state to match. The close is one
     scrubbed tween on the timeline below, and autoAlpha takes the stage
     out of the accessible tree and the overlay into it on its own — a
     React flag would re-render the whole section once per crossing to
     say something the DOM already says. */
  /* Held so the rail's buttons can drive the same pin the wheel drives. */
  const pinned = useRef<ScrollTrigger | null>(null);

  const rest = step === REST;

  /* A rail step is a real control, not a read-out. Clicking one does not
     set the state directly — it scrolls to the middle of that state's
     band and lets the scrub set the state on the way, so the pin and the
     panel can never disagree about where the reader is. With no pin
     (reduced motion) there is nothing to scroll, so the click just opens
     the panel. */
  const goTo = (i: number) => {
    const st = pinned.current;
    if (!st) {
      setStep(i);
      return;
    }
    const y = st.start + (st.end - st.start) * ((i + 0.5) / BANDS);
    const smoother = ScrollSmoother.get();
    if (smoother) smoother.scrollTo(y, true);
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          /* Listed so the pin is rebuilt at the breakpoint where the block
             changes shape — below lg the rail moves under the surface and
             the pinned height is measured against a different box. */
          wide: "(min-width: 1024px)",
        },
        (ctx) => {
          if (!ctx.conditions?.motion) return;

          /* ---- Entrance. Eyebrow, heading, sentence, question, surface,
             rail — each 80ms behind the last, nothing louder than 40px. */
          const intro = gsap.timeline({
            defaults: { ease: "power3.out", duration: 0.8 },
            scrollTrigger: { trigger: root.current, start: "top 70%" },
          });
          intro
            .from(q("[data-j-eyebrow]"), { autoAlpha: 0, y: 32 })
            .from(q("[data-j-title]"), { autoAlpha: 0, y: 32 }, "<0.08")
            .from(q("[data-j-desc]"), { autoAlpha: 0, y: 32 }, "<0.08")
            .from(q("[data-j-question]"), { autoAlpha: 0, y: 32 }, "<0.08")
            .from(frame.current, { autoAlpha: 0, y: 40, scale: 0.98, duration: 1 }, "<0.08")
            .from(q("[data-j-step]"), { autoAlpha: 0, y: 20, stagger: 0.06 }, "<0.2");

          /* The occurrence count counts up as the surface arrives. The
             element ships with the final figure already formatted, so a
             reader who never sees the animation still reads the number. */
          const counter = q("[data-j-count]")[0];
          if (counter) {
            const target = Number(counter.dataset.jCount);
            const n = { v: 0 };
            intro.to(
              n,
              {
                v: target,
                duration: 1.6,
                ease: "power2.out",
                onUpdate: () => {
                  counter.textContent = format(Math.round(n.v));
                },
              },
              "<0.2"
            );
          }

          /* The script is running, so the section stops showing everything
             at once and starts telling it one question at a time. */
          setStep(TRANSLATE);

          /* ---- The pin and the scroll clock.

             Seven bands: six research states and the close. scrub ties the
             playhead to the wheel rather than to a clock, so nothing
             advances unless the reader moves and reversing walks it back.

             The states themselves are not tweened here — they are React
             state, set from the band the progress falls in. Only the
             closing pull-back is on this timeline, positioned at band six
             of seven, which is why the timeline opens with a six-unit
             spacer. */
          const whole = !!ctx.conditions?.wide;
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: held.current,
              /* At lg the block is a viewport less the header, and parks
                 directly under it; below that it is taller than the screen
                 and is centred instead, which clears the header anyway. */
              start: whole ? `top top+=${HEADER_CLEARANCE}` : "center center",
              end: () => "+=" + window.innerHeight * BANDS * BAND_HEIGHT,
              pin: held.current,
              pinSpacing: true,
              scrub: true,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                /* The last band belongs to the close, so the state clamps
                   at the final question and simply stays there while the
                   surface withdraws behind the statement. */
                const band = Math.floor(self.progress * BANDS);
                const next = Math.min(STATE_COUNT - 1, band);
                setStep((current) => (current === next ? current : next));
              },
            },
          });
          pinned.current = tl.scrollTrigger ?? null;

          tl.to({}, { duration: OUTRO })
            /* The surface does not cut away; it withdraws. Scale and
               opacity only — blurring a subtree this large costs a
               repaint per scrubbed frame and buys nothing the scale does
               not already say. */
            .to(stage.current, {
              scale: 0.94,
              autoAlpha: 0,
              ease: "power2.inOut",
              duration: 0.55,
            })
            /* fromTo, so the from-values render the moment the timeline is
               built: the statement is hidden for the whole section rather
               than flashing over the surface until its turn arrives. */
            .fromTo(
              overlay.current,
              { autoAlpha: 0, y: 28 },
              { autoAlpha: 1, y: 0, ease: "power3.out", duration: 0.45 },
              ">-0.25"
            );

          /* ---- The small perpetual motions.

             A caret that blinks, and a soft breath under the word every
             panel is about. Both are decoration on elements the reader
             never interacts with, and both only exist inside this
             reduced-motion branch. */
          const caret = gsap.to(q("[data-j-caret]"), {
            autoAlpha: 0,
            duration: 0.55,
            repeat: -1,
            yoyo: true,
            /* A caret snaps; it does not fade. */
            ease: "steps(1)",
          });

          const glow = gsap.fromTo(
            q("[data-j-glow]"),
            { autoAlpha: 0.35, scale: 1 },
            {
              autoAlpha: 0.9,
              scale: 1.06,
              duration: 1.8,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            }
          );

          return () => {
            pinned.current = null;
            caret.kill();
            glow.kill();
            tl.scrollTrigger?.kill();
            tl.kill();
            intro.scrollTrigger?.kill();
            intro.kill();
          };
        }
      );
    },
    { scope: root }
  );

  return { step, rest, goTo };
}

/* ---------------------------------------------------------------
   The knowledge graph draws itself.

   Kept apart from the timeline above because it belongs to one
   panel and one state: the lines are only ever asked to draw when
   the graph rises, and asked to retract when it goes. pathLength is
   normalised to 1 on every edge in the markup, so a single offset
   drives them all at the same rate whatever their length.
   --------------------------------------------------------------- */
export function useGraphDraw(scope: RefObject<HTMLElement | null>, on: boolean) {
  useGSAP(
    () => {
      const edges = gsap.utils.toArray<SVGLineElement>("[data-j-edge]", scope.current);
      if (!edges.length) return;

      /* No matchMedia branch here: under reduced motion the section never
         leaves REST, the graph is simply open, and `on` never changes —
         so this runs once and lands the lines drawn. */
      gsap.to(edges, {
        strokeDashoffset: on ? 0 : 1,
        duration: on ? 0.9 : 0.4,
        ease: "power3.out",
        stagger: on ? 0.07 : 0,
        overwrite: true,
      });
    },
    { dependencies: [on], scope }
  );
}
