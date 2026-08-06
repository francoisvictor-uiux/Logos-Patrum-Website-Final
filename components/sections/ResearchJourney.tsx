"use client";

import { useRef } from "react";
import { Eyebrow, TwoTone } from "@/components/ui";
import type { Dict, Locale } from "@/lib/i18n";
import QuestionSequence from "@/components/journey/QuestionSequence";
import WorkspaceDemo from "@/components/journey/WorkspaceDemo";
import JourneyTimeline from "@/components/journey/JourneyTimeline";
import QuestionOverlay from "@/components/journey/QuestionOverlay";
import { useJourney } from "@/components/journey/use-journey";

/**
 * Section 05 — from question to discovery.
 *
 * Section 03 shows what the workspace contains. This one shows what it is
 * like to use: one question at a time, in the largest type on the page,
 * and the surface underneath answering it. Six questions, six answers, no
 * new features — the argument is that research here is continuous, that
 * you never leave the verse to ask the next thing about it.
 *
 * The section is pinned for the length of the journey, so the reader
 * scrolls through the questions rather than past them, and it closes by
 * pulling the surface back to leave a single line.
 *
 * This file is composition only. Every timeline lives in
 * components/journey/use-journey.ts; the four parts below are markup and
 * state. See that file for why the split is drawn where it is.
 */
export default function ResearchJourney({ dict, locale }: { dict: Dict; locale: Locale }) {
  const t = dict.journey;
  const root = useRef<HTMLElement>(null);
  /* Question + surface + rail + the closing line: this is what is pinned. */
  const held = useRef<HTMLDivElement>(null);
  /* The same, minus the closing line — what pulls back to reveal it. */
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);

  const nf = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US");
  const format = (n: number) => nf.format(n);

  const { step, rest, goTo } = useJourney({ root, held, stage, frame, overlay, format });

  return (
    <section
      id="journey"
      ref={root}
      /* Pure white, and the only section on the page that is. The story
         belongs on paper: the navy workbench in 03 and the turning rings
         in 04 both carry their own field, so this one earns its weight by
         having none. */
      className="relative isolate overflow-hidden bg-surface px-5 py-[96px] md:py-[128px] lg:px-8 lg:py-[160px]"
    >
      {/* The spotlight. One soft radial wash behind the surface, sitting
          just above where the question lands, so the centre of the section
          is fractionally warmer than its edges and the white does not read
          as flat. Nothing else is behind this section. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(58% 42% at 50% 38%, var(--color-primary-50) 0%, transparent 72%)",
        }}
      />

      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center">
        {/* The header scrolls away before the pin takes hold: it says what
            the section is, and then the section says it. */}
        <div className="flex flex-col items-center gap-[16px] text-center">
          <div data-j-eyebrow>
            <Eyebrow>{t.eyebrow}</Eyebrow>
          </div>
          <h2
            data-j-title
            dir="auto"
            className="max-w-[760px] text-balance font-display text-[32px] font-bold leading-[1.12] text-muted sm:text-[40px] lg:text-[48px]"
            style={{ fontFeatureSettings: '"swsh"' }}
          >
            <TwoTone text={t.title} />
          </h2>
          <p
            data-j-desc
            dir="auto"
            className="mt-[8px] max-w-[720px] text-center text-[18px] font-normal leading-[1.7] text-muted-2 sm:text-[20px]"
          >
            {t.description}
          </p>
        </div>

        {/* 96px between the sentence and the journey, per the spacing
            ladder — this is the seam where the section stops explaining
            itself and starts demonstrating. */}
        <div className="h-[64px] lg:h-[96px]" aria-hidden />

        {/* Everything from here down is what gets pinned, so at lg it is
            sized to the screen exactly: a viewport tall, the question and
            the rail taking their natural height and the surface taking
            the rest. svh, not vh, so a mobile browser's collapsing
            toolbar cannot make it taller than what is actually visible. */}
        {/* A viewport less the header, so the pinned block sits under the
            navigation rather than behind it — see HEADER_CLEARANCE, which
            the pin's start offset reads from the same constant. */}
        <div
          ref={held}
          className="relative flex w-full flex-col items-center lg:h-[calc(100svh-104px)] lg:py-[28px]"
        >
          <div
            ref={stage}
            className="flex w-full flex-1 flex-col items-center justify-center gap-[28px] lg:min-h-0 lg:gap-[32px]"
          >
            <QuestionSequence questions={t.questions} step={step} rest={rest} />

            {/* The surface is held narrower than the section and capped in
                height. At the full 1280 it ran edge to edge and stopped
                reading as an application floating on a page; given the
                whole remaining viewport it stretched to a height its five
                panels could not fill. Capped and centred, the space it
                gives back goes to the question above it. */}
            <div
              className={
                rest ? "w-full" : "flex w-full min-h-0 flex-1 items-center justify-center"
              }
            >
              <WorkspaceDemo
                ref={frame}
                ui={t.ui}
                step={step}
                rest={rest}
                format={format}
              />
            </div>

            <JourneyTimeline steps={t.steps} step={step} rest={rest} onPick={goTo} />
          </div>

          <QuestionOverlay ref={overlay} outro={t.outro} rest={rest} />
        </div>
      </div>
    </section>
  );
}
