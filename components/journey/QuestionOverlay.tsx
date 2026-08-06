"use client";

import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { Dict } from "@/lib/i18n";

type Outro = Dict["journey"]["outro"];

/* ===============================================================
   THE CLOSE

   The six answers are spent. The surface withdraws and one line is
   left standing where it was — the journey's own summary, in the
   same display type the questions were asked in.

   Under the scroll this is laid over the stage it replaces, and it
   is invisible until the last band: the timeline in use-journey.ts
   builds it with a fromTo, whose from-values render immediately, so
   it never flashes over the surface on the way down.

   At rest there is nothing to replace, so it is simply the last
   thing in the section.
   =============================================================== */
export default function QuestionOverlay({
  ref,
  outro,
  rest,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
  outro: Outro;
  rest: boolean;
}) {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center gap-[24px] text-center",
        rest ? "mt-[64px] w-full" : "pointer-events-none absolute inset-0 justify-center"
      )}
    >
      {/* text-center is load-bearing, not decoration: globals.css justifies
          every paragraph in <main> that is not centred, and hyphenates it
          in English. Without it this line sets as justified display type
          and breaks "begins" across two lines. */}
      <p
        dir="auto"
        className="max-w-[820px] text-balance text-center font-display text-[30px] font-bold leading-[1.15] text-ink sm:text-[40px] lg:text-[52px]"
        style={{ fontFeatureSettings: '"swsh"' }}
      >
        {outro.statement}
      </p>

      <p
        dir="auto"
        className="max-w-[560px] text-center text-[18px] font-normal leading-[1.7] text-muted sm:text-[20px]"
      >
        {outro.cta}
      </p>

      {/* The cue into the next section. Decorative — the label is there
          for anyone reading the page rather than looking at it, and the
          arrow itself is hidden from the accessible tree. */}
      <span className="mt-[8px] flex flex-col items-center gap-[6px]">
        <span
          dir="auto"
          className="text-[11px] font-medium uppercase leading-[1.4] tracking-[0.1em] text-faint"
        >
          {outro.scroll}
        </span>
        <Icon
          name="chevron"
          className="size-[20px] animate-[lp-cue_1.8s_ease-in-out_infinite] text-accent motion-reduce:animate-none"
        />
      </span>
    </div>
  );
}
