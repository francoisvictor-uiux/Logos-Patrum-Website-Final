"use client";

import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { Dict } from "@/lib/i18n";
import { STATE_COUNT, STEP_ICONS } from "./states";

type Steps = Dict["journey"]["steps"];

/* ===============================================================
   THE RAIL — where the reader is in the journey.

   Six marks on one line under the surface. It is a control, not a
   read-out: a mark is a button, and pressing it scrolls to that
   state's band so the pin and the panel can never disagree.

   Horizontal, unlike the vertical rail in section 03, because this
   section is composed on the centre line and six steps down the
   side would take width the surface needs.

   At rest it is not a rail at all. With no scroll to place the
   reader on it, a progress line is a lie; the six steps are simply
   listed, with the sentence each one carries.
   =============================================================== */
export default function JourneyTimeline({
  steps,
  step,
  rest,
  onPick,
}: {
  steps: Steps;
  step: number;
  rest: boolean;
  onPick: (i: number) => void;
}) {
  if (rest) {
    return (
      <ol className="grid w-full grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} data-j-step className="flex items-start gap-3">
            <span className="flex size-[32px] shrink-0 items-center justify-center rounded-full border border-accent-line bg-accent-soft">
              <Icon name={STEP_ICONS[i]} className="size-[17px] text-accent" />
            </span>
            <span className="flex min-w-0 flex-col gap-1">
              <span dir="auto" className="text-[15px] font-semibold leading-[1.3] text-title">
                {s.title}
              </span>
              <span dir="auto" className="text-[13px] leading-[1.6] text-muted-2">
                {s.desc}
              </span>
            </span>
          </li>
        ))}
      </ol>
    );
  }

  /* Six marks sit at the centre of six equal columns, which puts them at
     (i + 0.5)/6 across. The line therefore runs from 1/12 to 11/12 — it
     starts and ends on a mark rather than overshooting past the first and
     last — and the fill is step/5 of that, with nothing to measure at
     runtime. That is why this is a fixed 6-column grid and not a
     justify-between row. */
  const reached = Math.max(0, step);

  return (
    <ol className="relative grid w-full grid-cols-6">
      <span
        aria-hidden
        className="absolute top-[16px] h-[2px] overflow-hidden rounded-full bg-line"
        style={{ insetInlineStart: "8.3333%", width: "83.3333%" }}
      >
        <span
          className="absolute inset-y-0 rounded-full bg-accent transition-[width] duration-[800ms] ease-out"
          style={{ insetInlineStart: 0, width: `${(reached / (STATE_COUNT - 1)) * 100}%` }}
        />
      </span>

      {steps.map((s, i) => {
        const done = step > i;
        const now = step === i;
        return (
          <li key={s.title} data-j-step className="min-w-0">
            <button
              type="button"
              onClick={() => onPick(i)}
              aria-current={now ? "step" : undefined}
              className="group flex w-full flex-col items-center gap-2 rounded-[12px] px-1 pb-2 pt-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line"
            >
              {/* Opaque, so the line appears to run behind the six marks
                  rather than through them. z-10 keeps it over the line,
                  which is positioned. */}
              <span
                className={cn(
                  "relative z-10 flex size-[34px] shrink-0 items-center justify-center rounded-full border bg-surface transition-colors duration-[600ms]",
                  now
                    ? "border-accent bg-accent"
                    : done
                      ? "border-accent-line bg-accent-soft"
                      : "border-line"
                )}
              >
                <Icon
                  name={STEP_ICONS[i]}
                  className={cn(
                    "size-[17px] transition-colors duration-[600ms]",
                    now ? "text-on-accent" : done ? "text-accent" : "text-faint"
                  )}
                />
              </span>
              <span
                dir="auto"
                className={cn(
                  "hidden truncate text-[12px] font-medium leading-[1.4] transition-colors duration-[600ms] sm:block",
                  now ? "text-title" : done ? "text-muted-2" : "text-faint"
                )}
              >
                {s.title}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
