"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

/* ===============================================================
   THE QUESTION

   One question is visible at a time, in the largest type on the
   page. The old one lifts, blurs and goes; the new one rises from
   below and comes into focus. Nothing else moves.

   Every question occupies the same grid cell, so the block is as
   tall as the longest of them from the first frame and the surface
   below it never shifts as the questions change.

   At rest — no script, or reduced motion — the six questions are
   simply a list. A reader who cannot have the sequence still gets
   the sequence; it just does not move.
   =============================================================== */
export default function QuestionSequence({
  questions,
  step,
  rest,
}: {
  questions: readonly string[];
  step: number;
  rest: boolean;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (rest) return;
      const items = gsap.utils.toArray<HTMLElement>("[data-q]", scope.current);
      const active = items[step];
      if (!active) return;

      /* The outgoing questions are already invisible on the first pass —
         they ship with opacity-0 and GSAP tweens them from where they
         are — so this is a no-op on arrival and a real hand-off after. */
      gsap
        .timeline({ defaults: { ease: "power3.out", overwrite: "auto" } })
        .to(
          items.filter((n) => n !== active),
          { autoAlpha: 0, yPercent: -28, filter: "blur(8px)", duration: 0.45 },
          0
        )
        .fromTo(
          active,
          { autoAlpha: 0, yPercent: 28, filter: "blur(10px)" },
          { autoAlpha: 1, yPercent: 0, filter: "blur(0px)", duration: 0.85 },
          0.12
        );
    },
    { dependencies: [step, rest], scope }
  );

  return (
    <div
      ref={scope}
      data-j-question
      className={cn(
        "w-full",
        rest ? "flex flex-col items-center gap-[10px]" : "grid grid-cols-1 justify-items-center"
      )}
    >
      {questions.map((question, i) => (
        <p
          key={question}
          data-q
          dir="auto"
          /* Hidden questions leave the accessible tree, so the surface
             below is announced as the answer to one question rather than
             to six at once. At rest none of them are hidden. */
          aria-hidden={!rest && i !== step ? true : undefined}
          className={cn(
            "max-w-[900px] text-balance text-center font-display font-bold leading-[1.15] text-ink",
            rest
              ? "text-[22px] sm:text-[26px]"
              : cn(
                  "col-start-1 row-start-1 text-[30px] sm:text-[40px] lg:text-[56px]",
                  /* The starting state for everything the timeline has not
                     reached yet. GSAP's inline styles take it from here. */
                  i !== step && "opacity-0"
                )
          )}
          style={{ fontFeatureSettings: '"swsh"' }}
        >
          {question}
        </p>
      ))}
    </div>
  );
}
