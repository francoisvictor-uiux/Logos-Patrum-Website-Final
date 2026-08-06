"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";
import DigitalRain from "@/components/ui/DigitalRain";
import { Icon, type IconName } from "@/components/icons";
import { SectionBadge } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Dict } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP);

type WS = Dict["workspace"];
type UI = WS["ui"];

/* The four states of the demonstration, in scroll order. */
const SEARCH = 0;
const ANALYZE = 1;
const TRANSLATE = 2;
const CONNECT = 3;
const STEP_ICONS: IconName[] = ["search", "analyze", "translation", "network"];

/* REST is not a state the scroll can reach: it is the workspace at rest, with
   every panel open at once. It is what the server renders, what a reader with
   no JavaScript keeps, and what a reader who has asked for reduced motion
   keeps — the whole product in one still, rather than a demo frozen on frame
   one. The script leaves it for SEARCH the moment it takes over. */
const REST = -1;

/**
 * Section 03 — the workspace itself.
 *
 * The pillars above say what the platform believes; this says how it works.
 * One application surface is pinned for the length of the section and answers
 * the scroll: the reader searches, opens a word, asks for a reading, and then
 * watches the passage take its place among the Fathers who cite it. Four
 * states, one screen, no cuts — the timeline underneath keeps the place.
 *
 * The surface is not a browser mockup and not a laptop: it is the application,
 * floating on the page, with the section's own spotlight behind it.
 *
 * Motion is GSAP ScrollTrigger for the pin and the state clock, and CSS
 * transitions for everything the states change, so the whole thing degrades to
 * a single complete screenshot when the script never runs.
 */
export default function Workspace({ dict }: { dict: Dict }) {
  const t = dict.workspace;
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  /* Everything that is held still: the badge, the headline, the sentence, and
     the stage under them. */
  const held = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const rain = useRef<HTMLDivElement>(null);
  /* Held so the step buttons can drive the same pin the wheel drives. */
  const pinned = useRef<ScrollTrigger | null>(null);
  const [step, setStep] = useState<number>(REST);
  /* Whether the rain is mounted — see the observer below. */
  const [field, setField] = useState(false);

  /* At rest every panel is open; under the scroll exactly one is. */
  const rest = step === REST;

  /* A step is a real control, not a read-out. Clicking one does not set the
     state directly — it scrolls to the middle of that state's band, and the
     scrub sets the state on the way, so the pin and the panel can never
     disagree about where the reader is. Without a pin (reduced motion) there
     is nothing to scroll, so the click just opens the panel. */
  const goTo = (i: number) => {
    const st = pinned.current;
    if (!st) {
      setStep(i);
      return;
    }
    const y = st.start + (st.end - st.start) * ((i + 0.5) / 4);
    const smoother = ScrollSmoother.get();
    if (smoother) smoother.scrollTo(y, true);
    else window.scrollTo({ top: y, behavior: "smooth" });
  };
  const at = (s: number) => rest || step === s;
  const from = (s: number) => rest || step >= s;

  /* Mount the rain on approach, drop it on the way out — it runs a rAF loop
     over a full-bleed canvas, and the hero already owns a live one for the
     whole page.

     An observer rather than a ScrollTrigger. A trigger's isActive cannot be
     read from onRefresh, which is the only callback that fires when the
     reader lands already inside the section: GSAP moves the scroll position
     to remeasure and has not restored it by the time the callback runs, so it
     reports the section as unreached. The layer then unmounts mid-section and
     no onToggle ever comes to bring it back, because as far as the trigger is
     concerned nothing changed. An observer only ever answers the question
     actually being asked — is this near the screen — and cannot be caught
     mid-measurement.

     Outside the matchMedia block on purpose: a reader who has asked for
     reduced motion still gets the field, as one still frame. */
  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setField(entry.isIntersecting), {
      rootMargin: "30% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          /* Listed so the pin is rebuilt at the breakpoint where the surface
             changes shape — the rail arrives at lg and the scroll distance is
             measured against a different frame height. */
          wide: "(min-width: 1024px)",
        },
        (ctx) => {
          if (!ctx.conditions?.motion) return;

          /* Entrance — eyebrow, headline, description, then the surface
             itself, each 80ms behind the last. */
          gsap
            .timeline({
              defaults: { ease: "power3.out", duration: 0.8 },
              scrollTrigger: { trigger: root.current, start: "top 70%" },
            })
            .from(q("[data-w-eyebrow]"), { autoAlpha: 0, y: 32 })
            .from(q("[data-w-title]"), { autoAlpha: 0, y: 32 }, "<0.08")
            .from(q("[data-w-desc]"), { autoAlpha: 0, y: 32 }, "<0.08")
            .from(frame.current, { autoAlpha: 0, y: 40, scale: 0.98, duration: 1 }, "<0.08")
            .from(q("[data-w-step]"), { autoAlpha: 0, y: 20, stagger: 0.06 }, "<0.2");

          /* The script is running, so the surface stops showing everything and
             starts telling it. */
          setStep(SEARCH);

          /* The pin. Three viewports of scroll carry four states, so each one
             holds for a viewport before the next takes over. scrub ties the
             progress to the wheel rather than to a clock: nothing advances
             unless the reader moves, and reversing walks it back.

             Wide screens hold the whole block — badge, headline, sentence and
             stage together — so the section keeps saying what it is while the
             reader walks its four steps. That only works because the block is
             a viewport tall there and the stage takes whatever the words
             leave; see the classes on it.

             Narrow screens still pin the stage alone. Below lg the surface and
             the step list are stacked rather than side by side, so the block
             is already taller than the screen and adding the header to it
             would only push the surface off the bottom. */
          const whole = !!ctx.conditions?.wide;
          const target = whole ? held.current : stage.current;
          const pin = ScrollTrigger.create({
            trigger: target,
            start: whole ? "top top" : "center center",
            end: () => "+=" + window.innerHeight * 3,
            pin: target,
            pinSpacing: true,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const next = Math.min(CONNECT, Math.floor(self.progress * 4));
              setStep((current) => (current === next ? current : next));
            },
          });
          pinned.current = pin;

          /* The rain is held to one viewport and pinned across the section
             rather than stretched over it. The pin above makes this section
             four screens tall; a canvas that tall would be some 30 million
             device pixels to clear and repaint every frame, and the columns
             are laid out across the diagonal, so the count grows with the
             height twice over. Pinned, it is always exactly one screen.

             pinSpacing is off — this is a background, it must not add
             layout. refreshPriority puts it behind the surface pin on
             recalculation, so its end is measured against a section height
             that already includes that pin's spacer. */
          const rainST = ScrollTrigger.create({
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            pin: rain.current,
            pinSpacing: false,
            refreshPriority: -1,
          });

          /* Parallax — the surface only, fine pointers only, and never more
             than 6px. quickTo eases it so it drifts rather than tracks. */
          const el = frame.current;
          if (!el || window.matchMedia("(pointer: coarse)").matches) {
            return () => {
              pinned.current = null;
              rainST.kill();
              pin.kill();
            };
          }

          const xTo = gsap.quickTo(el, "x", {
            duration: 0.7,
            ease: "power3.out",
          });
          const yTo = gsap.quickTo(el, "y", {
            duration: 0.7,
            ease: "power3.out",
          });
          /* The panels inside drift a little further and a little later, so the
             surface reads as layers rather than as one flat card. */
          const inner = q("[data-w-drift]");
          const driftX = inner.map((n) =>
            gsap.quickTo(n, "x", { duration: 0.9, ease: "power3.out" })
          );
          const driftY = inner.map((n) =>
            gsap.quickTo(n, "y", { duration: 0.9, ease: "power3.out" })
          );

          const onMove = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
            const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
            const cx = gsap.utils.clamp(-1, 1, dx);
            const cy = gsap.utils.clamp(-1, 1, dy);
            xTo(cx * 6);
            yTo(cy * 6);
            driftX.forEach((to, i) => to(cx * (i % 2 ? 3 : -3)));
            driftY.forEach((to, i) => to(cy * (i % 2 ? 3 : -3)));
          };
          const onLeave = () => {
            xTo(0);
            yTo(0);
            driftX.forEach((to) => to(0));
            driftY.forEach((to) => to(0));
          };

          const section = root.current!;
          section.addEventListener("pointermove", onMove);
          section.addEventListener("pointerleave", onLeave);
          return () => {
            section.removeEventListener("pointermove", onMove);
            section.removeEventListener("pointerleave", onLeave);
            pinned.current = null;
            rainST.kill();
            pin.kill();
          };
        }
      );
    },
    { scope: root }
  );

  return (
    <section
      id="workspace"
      ref={root}
      /* Everything inside is chosen against primary-500: white display type
         (10.9:1), primary-100 body (11.9:1), primary-300 for the quiet
         register (5.6:1), and the light orange for progress (7.2:1). Nothing
         here relies on the light-mode text tokens, which would all but vanish
         on this field.

         -mt-px laps this section a pixel over the pillars above it, which is
         the same navy. ScrollSmoother moves the content by fractional pixels,
         so the join between two sections lands mid-pixel and the browser
         blends both edges with what is behind them — the body's #fafafa —
         drawing a pale hairline that only appears while scrolling. Overlapping
         leaves no gap for it to come through. */
      className="relative isolate -mt-px bg-primary-500 px-5 py-[96px] md:py-[128px] lg:px-8 lg:py-[160px]"
    >
      {/* The rain. It paints on transparency, so the section's blue is still
          the ground — the glyphs fall on the brand colour rather than on the
          component's own black.

          The outer layer spans the section and is what -z-10 puts behind the
          content; the inner one is a single screen and is what the pin holds
          in place. Held well back: the white heads compete with the white
          display type sitting over them, and now that the headline is pinned
          it is over the field for the whole section rather than passing
          through. That opacity is the one knob — raise it for a heavier
          field. */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.38]">
        {/* One screen tall, because the pin holds it to the screen. Under
            reduced motion there is no pin and no pinned scroll length either,
            so the section is short enough for the layer to simply fill it. */}
        <div ref={rain} className="h-screen w-full motion-reduce:h-full">
          {field && <DigitalRain style={{ width: "100%", height: "100%" }} />}
        </div>
      </div>

      {/* On wide screens this whole block is what gets pinned, so it is sized
          to the screen exactly: a viewport tall, the words taking their
          natural height at the top and the stage below taking the rest. svh,
          not vh, so a mobile browser's collapsing toolbar cannot make it
          taller than what is actually visible. */}
      <div
        ref={held}
        className="mx-auto flex w-full max-w-[1280px] flex-col items-center lg:h-[100svh] lg:py-[40px]"
      >
        <div data-w-eyebrow className="mb-[16px]">
          <SectionBadge tone="dark">{t.eyebrow}</SectionBadge>
        </div>

        {/* The clause break is authored in the copy, not left to the wrap. */}
        <h2
          data-w-title
          dir="auto"
          className="mb-[24px] max-w-[760px] whitespace-pre-line text-center font-display text-[32px] font-bold leading-[1.12] text-white sm:text-[40px] lg:text-[48px]"
          style={{ fontFeatureSettings: '"swsh"' }}
        >
          {t.title}
        </h2>

        <p
          data-w-desc
          dir="auto"
          /* 40 rather than 80 at lg: the words and the stage now share one
             screen, and every pixel spent here is taken off the surface. */
          className="mb-[56px] max-w-[720px] text-center font-sans text-[18px] font-normal leading-[1.7] text-primary-100 sm:text-[20px] lg:mb-[40px]"
        >
          {t.description}
        </p>

        {/* Everything from here down is what gets pinned. The screen leads and
            the four steps stand beside it, aligned to its full height, so the
            reader can see the whole journey and the state it is in at once.
            The columns are source-ordered, not left/right: the screen takes
            the reading-start side, which is the left in English and the right
            in Arabic, like every other split on this page. */}
        {/* items-stretch, not items-start: the two columns have to fill the
            height the row is given rather than each claim its own. */}
        <div
          ref={stage}
          className="grid w-full gap-8 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-stretch lg:gap-10"
        >
          <Surface ref={frame} ui={t.ui} step={step} rest={rest} at={at} from={from} />
          <Journey steps={t.steps} step={step} rest={rest} onPick={goTo} />
        </div>
      </div>
    </section>
  );
}

/* ===============================================================
   THE SURFACE — a floating application, not a mockup of one.
   =============================================================== */
function Surface({
  ref,
  ui,
  step,
  rest,
  at,
  from,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
  ui: UI;
  step: number;
  rest: boolean;
  at: (s: number) => boolean;
  from: (s: number) => boolean;
}) {
  return (
    <div
      ref={ref}
      aria-label={ui.label}
      className={cn(
        /* No drop shadow: the blue field is the separation, and a navy
           shadow on a navy ground only muddies the edge. */
        "relative flex w-full flex-col overflow-hidden rounded-[24px] border border-line bg-white",
        /* Fixed while the scroll drives it, so no state change moves the
           furniture; at rest it grows to hold every panel at once. At lg it
           takes the height the pinned block has left instead of naming one,
           which is what keeps the header on screen beside it. */
        !rest && "h-[520px] sm:h-[540px] lg:h-full"
      )}
    >
      <TitleBar />
      <TopBar ui={ui} step={step} rest={rest} />

      {/* min-h-0 all the way down, or a flex child refuses to shrink below its
          content and the fixed frame height stops meaning anything. */}
      <div
        className={cn(
          "flex flex-col gap-3 p-3 lg:gap-4 lg:p-4",
          rest ? "lg:flex-row" : "min-h-0 flex-1 lg:flex-row"
        )}
      >
        <Results ui={ui} rest={rest} on={from(SEARCH)} />

        {/* Reading pane and sidebar share a stage: the graph rises over both
            of them in the last state. */}
        <div className="relative flex min-h-0 flex-1 flex-col gap-3 lg:flex-row lg:gap-4">
          <Reading ui={ui} rest={rest} lit={from(ANALYZE)} />

          <div
            data-w-drift
            className={cn(
              "shrink-0 lg:w-[288px]",
              rest ? "flex flex-col gap-3" : "relative min-h-[196px] lg:min-h-0"
            )}
          >
            <Morphology ui={ui} rest={rest} on={at(ANALYZE)} />
            <Translation ui={ui} rest={rest} on={at(TRANSLATE)} />
          </div>

          <Graph ui={ui} rest={rest} on={at(CONNECT)} />
        </div>
      </div>
    </div>
  );
}

/* The title bar — the window itself, above everything the application does.
   Its own row on a faint fill, the way a browser or a desktop app sits: just
   the three lights on the reading-start side. The document's name is gone from
   the bar; the surface still carries it as its accessible name, so the region
   is still announced without the page saying it twice. */
function TitleBar() {
  return (
    <div className="flex items-center border-b border-gray-100 bg-gray-50 px-4 py-2.5 lg:px-5">
      <span aria-hidden className="flex shrink-0 items-center gap-[6px]">
        {["bg-red-400", "bg-yellow-400", "bg-green-400"].map((c) => (
          <span key={c} className={cn("block size-[10px] rounded-full", c)} />
        ))}
      </span>
    </div>
  );
}

/* The toolbar under it — the search field and the language filters. The query
   types itself in as the first state lands. */
function TopBar({ ui, step, rest }: { ui: UI; step: number; rest: boolean }) {
  const typed = rest || step >= SEARCH;

  return (
    <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 lg:px-5">
      <div
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2 rounded-[10px] border px-3 py-2 transition-colors duration-500",
          typed ? "border-accent-line bg-white" : "border-transparent bg-chip"
        )}
      >
        <Icon name="search" className="size-4 shrink-0 text-faint" />
        <span className="grid min-w-0 flex-1 grid-cols-1 text-[13px] leading-[1.7]">
          <span
            dir="auto"
            className={cn(
              "col-start-1 row-start-1 min-w-0 truncate text-faint transition-opacity duration-300",
              typed ? "opacity-0" : "opacity-100"
            )}
          >
            {ui.search}
          </span>
          <span
            className={cn(
              "col-start-1 row-start-1 flex min-w-0 items-center transition-opacity duration-300",
              typed ? "opacity-100" : "opacity-0"
            )}
          >
            <span dir="ltr" className="truncate font-greek text-[15px] text-title">
              {ui.query}
            </span>
            <span
              className={cn(
                "ms-[2px] inline-block h-[15px] w-px bg-accent",
                typed ? "animate-pulse motion-reduce:animate-none" : "opacity-0"
              )}
            />
          </span>
        </span>
      </div>

      <div className="hidden items-center gap-2 md:flex">
        {ui.filters.map((f, i) => (
          <span
            key={f}
            dir="auto"
            className={cn(
              "cursor-default rounded-full px-3 py-1 text-[12px] leading-[1.4] transition-all duration-300 hover:-translate-y-[2px]",
              i === 0 ? "bg-accent text-white" : "bg-chip text-muted-2 hover:bg-chip-hover"
            )}
          >
            {f}
          </span>
        ))}
      </div>

    </div>
  );
}

/* The results rail. The first witness is the one the reader opens. */
function Results({ ui, rest, on }: { ui: UI; rest: boolean; on: boolean }) {
  return (
    /* A column beside the text on a wide screen; a strip above it on a narrow
       one, so the first state still has results to show where there is no room
       for a rail. */
    <aside data-w-drift className="flex shrink-0 flex-col gap-1.5 lg:w-[212px]">
      <div className="mb-0.5 flex items-baseline justify-between gap-2 px-3">
        <span
          dir="auto"
          className="text-[11px] font-medium uppercase leading-[1.4] tracking-[0.1em] text-faint"
        >
          {ui.resultsLabel}
        </span>
        <span dir="auto" className="text-[11px] leading-[1.4] text-faint">
          {ui.resultsCount}
        </span>
      </div>

      <div
        className={cn(
          "flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0",
          rest && "flex-col overflow-visible pb-0"
        )}
      >
        {ui.results.map((r, i) => (
          <div
            key={r.title}
            dir="auto"
            className={cn(
              "flex min-w-[172px] shrink-0 cursor-default flex-col gap-1 rounded-[12px] border px-3 py-2.5 transition-all duration-[400ms] ease-out hover:border-line hover:bg-chip motion-reduce:transform-none lg:min-w-0",
              on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
              i === 0 && on ? "border-accent-line bg-accent-soft" : "border-transparent"
            )}
            style={{ transitionDelay: `${on ? i * 90 : 0}ms` }}
          >
            <span className="text-[13px] font-medium leading-[1.5] text-gray-700">{r.title}</span>
            <span className="text-[11px] leading-[1.5] text-faint">{r.meta}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

/* The reading pane. One word in the passage is the subject of everything the
   sidebar does, so it lights when the analysis opens. */
function Reading({ ui, rest, lit }: { ui: UI; rest: boolean; lit: boolean }) {
  /* Only the first occurrence is marked: the panel beside it is about that
     word, in that position, not about every time the passage says it. */
  const cut = ui.passage.indexOf(ui.word);

  return (
    <div
      data-w-drift
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-3 rounded-[16px] border border-gray-100 bg-gray-50/60 p-4 transition-shadow duration-300 hover:shadow-lift lg:p-5",
        !rest && "min-h-0"
      )}
    >
      <div className="flex items-baseline gap-2">
        <span dir="auto" className="text-[13px] font-medium leading-[1.5] text-gray-700">
          {ui.readingLabel}
        </span>
        <span dir="auto" className="text-[11px] leading-[1.5] text-faint">
          {ui.readingMeta}
        </span>
      </div>

      <p dir="ltr" className="font-greek text-[19px] leading-[1.9] text-gray-700 lg:text-[22px]">
        {cut < 0 ? (
          ui.passage
        ) : (
          <>
            {ui.passage.slice(0, cut)}
            <mark
              className={cn(
                "rounded-[6px] px-1 transition-colors duration-500",
                lit ? "bg-accent-soft text-title" : "bg-transparent text-gray-700"
              )}
            >
              {ui.word}
            </mark>
            {ui.passage.slice(cut + ui.word.length)}
          </>
        )}
      </p>
    </div>
  );
}

/* A sidebar panel. Under the scroll the panels are stacked on one another and
   only one is up; at rest they simply follow each other down the column. */
function Panel({
  title,
  on,
  rest,
  children,
}: {
  title: string;
  on: boolean;
  rest: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-hidden={!on}
      className={cn(
        "flex flex-col gap-3 rounded-[16px] border border-line bg-white p-4 transition-all duration-[700ms] ease-out hover:shadow-lift motion-reduce:transform-none",
        rest ? "" : "absolute inset-0 overflow-hidden",
        on ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <h3
        dir="auto"
        className="text-[11px] font-medium uppercase leading-[1.4] tracking-[0.1em] text-accent"
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

/* State 2 — the word comes apart. */
function Morphology({ ui, rest, on }: { ui: UI; rest: boolean; on: boolean }) {
  return (
    <Panel title={ui.morphLabel} on={on} rest={rest}>
      <span
        dir="ltr"
        className="self-start rounded-[10px] border border-accent-line bg-accent-soft px-3 py-1.5 font-greek text-[20px] leading-none text-title"
      >
        {ui.word}
      </span>

      <dl className="flex flex-col">
        {ui.morph.map((row, i) => (
          <div
            key={row.label}
            className={cn(
              "flex items-baseline justify-between gap-3 border-b border-gray-100 py-2 last:border-0 transition-all duration-500 ease-out motion-reduce:transform-none",
              on ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
            )}
            style={{ transitionDelay: `${on ? 120 + i * 70 : 0}ms` }}
          >
            <dt dir="auto" className="shrink-0 text-[11px] leading-[1.5] text-faint">
              {row.label}
            </dt>
            <dd dir="auto" className="text-end text-[12px] font-medium leading-[1.5] text-gray-700">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

/* State 3 — the readings, and the reason behind them. */
function Translation({ ui, rest, on }: { ui: UI; rest: boolean; on: boolean }) {
  return (
    <Panel title={ui.translateLabel} on={on} rest={rest}>
      <div className="flex flex-col gap-2.5">
        {ui.translations.map((line, i) => (
          <div
            key={line.lang}
            className={cn(
              "flex flex-col gap-1 transition-all duration-500 ease-out motion-reduce:transform-none",
              on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            )}
            style={{ transitionDelay: `${on ? 100 + i * 110 : 0}ms` }}
          >
            <span
              dir="auto"
              className="text-[10px] uppercase leading-[1.4] tracking-[0.1em] text-faint"
            >
              {line.lang}
            </span>
            <span
              dir="auto"
              className={cn(
                "leading-snug",
                i === 0
                  ? "font-greek text-[15px] text-gray-700"
                  : "font-sans text-[14px] text-title"
              )}
            >
              {line.text}
            </span>
          </div>
        ))}
      </div>

      <div
        className={cn(
          "mt-auto flex flex-col gap-1.5 rounded-[12px] bg-accent-soft/70 p-3 transition-all duration-500 ease-out motion-reduce:transform-none",
          on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        )}
        style={{ transitionDelay: `${on ? 440 : 0}ms` }}
      >
        <span
          dir="auto"
          className="text-[10px] uppercase leading-[1.4] tracking-[0.1em] text-accent"
        >
          {ui.noteLabel}
        </span>
        <p dir="auto" className="text-[12px] leading-[1.6] text-muted-2">
          {ui.note}
        </p>
      </div>
    </Panel>
  );
}

/* ===============================================================
   STATE 4 — the passage among the Fathers who carry it.

   Lines are SVG so they can draw themselves; the nodes are HTML so the labels
   are real type in either script. Both are positioned in percentages off the
   same table, so they cannot drift apart.
   =============================================================== */
const GRAPH_NODES = [
  { x: 50, y: 50, kind: "concept" },
  { x: 17, y: 20, kind: "passage" },
  { x: 50, y: 12, kind: "concept" },
  { x: 84, y: 22, kind: "father" },
  { x: 20, y: 82, kind: "father" },
  { x: 82, y: 80, kind: "source" },
] as const;

const GRAPH_EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [3, 5],
  [4, 1],
];

function Graph({ ui, rest, on }: { ui: UI; rest: boolean; on: boolean }) {
  return (
    <section
      aria-hidden={!on}
      className={cn(
        "group/graph flex flex-col gap-3 rounded-[16px] border border-line bg-white p-4 transition-all duration-[800ms] ease-out",
        rest
          ? "min-h-[340px]"
          : cn(
              "absolute inset-0",
              on ? "scale-100 opacity-100" : "pointer-events-none scale-[0.98] opacity-0"
            )
      )}
    >
      <div className="flex items-baseline gap-2">
        <h3
          dir="auto"
          className="text-[11px] font-medium uppercase leading-[1.4] tracking-[0.1em] text-accent"
        >
          {ui.graphLabel}
        </h3>
        <span dir="auto" className="text-[11px] leading-[1.5] text-faint">
          {ui.graphCaption}
        </span>
      </div>

      <div className="relative min-h-0 flex-1">
        {/* No viewBox: percentage coordinates resolve against the rendered box,
            so the lines stay hairlines at every size instead of scaling with a
            viewBox. pathLength normalises every edge to 1 so one dash offset
            draws them all at the same rate whatever their length. */}
        <svg aria-hidden className="absolute inset-0 h-full w-full overflow-visible">
          {GRAPH_EDGES.map(([a, b], i) => (
            <line
              key={i}
              x1={`${GRAPH_NODES[a].x}%`}
              y1={`${GRAPH_NODES[a].y}%`}
              x2={`${GRAPH_NODES[b].x}%`}
              y2={`${GRAPH_NODES[b].y}%`}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={on ? 0 : 1}
              strokeWidth={1}
              className={cn(
                "transition-[stroke-dashoffset,stroke] duration-[900ms] ease-out",
                on ? "stroke-primary-300" : "stroke-line"
              )}
              style={{ transitionDelay: `${on ? 120 + i * 90 : 0}ms` }}
            />
          ))}
        </svg>

        {/* A zero-width anchor sits on the point and centres the chip over it.
            A -50% translate would have to know the writing direction; a flex
            centre does not, so the chips land on their nodes in both scripts. */}
        {GRAPH_NODES.map((n, i) => (
          <span
            key={ui.nodes[i]}
            className="absolute flex w-0 -translate-y-1/2 justify-center"
            style={{ insetInlineStart: `${n.x}%`, top: `${n.y}%` }}
          >
            <span
              dir="auto"
              className={cn(
                "flex cursor-default items-center gap-2 whitespace-nowrap rounded-full border bg-white px-3 py-1.5 text-[12px] leading-[1.4] transition-all duration-500 ease-out hover:shadow-lift motion-reduce:transform-none",
                n.kind === "concept"
                  ? "border-accent-line bg-accent-soft font-medium text-accent"
                  : "border-line text-gray-700",
                on ? "scale-100 opacity-100" : "scale-90 opacity-0"
              )}
              style={{ transitionDelay: `${on ? 80 + i * 70 : 0}ms` }}
            >
              {n.kind === "father" && (
                <span
                  aria-hidden
                  className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-chip text-[9px] font-semibold uppercase text-muted-2"
                >
                  {ui.nodes[i].slice(0, 1)}
                </span>
              )}
              {ui.nodes[i]}
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}

/* ===============================================================
   THE JOURNEY — four steps, and where the reader is in them.
   =============================================================== */
function Journey({
  steps,
  step,
  rest,
  onPick,
}: {
  steps: WS["steps"];
  step: number;
  rest: boolean;
  onPick: (i: number) => void;
}) {
  /* One line runs the whole column, from the first node's centre to the last,
     and the fill walks it. Four equal rows are what make that possible in pure
     CSS: the nodes then sit at exact thirds of the line, so the fill is
     step/3 of its length with nothing to measure at runtime. That is why the
     column is a fixed-height 4-row grid rather than a stack that grows. */
  const reached = rest ? 3 : Math.max(0, step);

  return (
    <ol className="relative grid h-[500px] w-full grid-rows-4 sm:h-[520px] lg:h-full">
      {/* The spine. It starts and ends on a node centre — 34px down each row,
          which is the row's 16px padding plus half the 36px node — so the line
          never overshoots past the first or last step. */}
      <span
        aria-hidden
        className="absolute top-[34px] h-[75%] w-[2px] overflow-hidden rounded-full bg-white/15"
        style={{ insetInlineStart: "33px" }}
      >
        <span
          className="absolute inset-x-0 top-0 rounded-full bg-orange-300 transition-[height] duration-700 ease-out"
          style={{ height: `${(reached / 3) * 100}%` }}
        />
      </span>

      {steps.map((s, i) => {
        const done = !rest && step > i;
        const now = rest || step === i;
        const lit = now || done;
        return (
          <li key={s.title} data-w-step className="min-h-0">
            <button
              type="button"
              onClick={() => onPick(i)}
              aria-current={now ? "step" : undefined}
              className="group flex h-full w-full items-start gap-3 rounded-[14px] p-4 text-start transition-colors duration-500 ease-out hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
            >
              {/* The node sits on the line and hides it: opaque, so the spine
                  appears to run behind the four marks rather than through
                  them. z-10 keeps it over the spine, which is positioned. */}
              <span
                className={cn(
                  "relative z-10 flex size-[36px] shrink-0 items-center justify-center rounded-full border bg-primary-500 transition-colors duration-500",
                  now
                    ? "border-orange-300 bg-orange-300"
                    : done
                      ? "border-orange-300/60"
                      : "border-white/20"
                )}
              >
                <Icon
                  name={STEP_ICONS[i]}
                  className={cn(
                    "size-[19px] transition-colors duration-500",
                    now ? "text-primary-500" : done ? "text-orange-300" : "text-primary-300"
                  )}
                />
              </span>

              {/* Hierarchy: the verb carries the row at 17/600 in white, the
                  sentence follows two steps down in size and one in weight, so
                  the eye takes the four verbs first and the detail second. */}
              <span className="flex min-w-0 flex-col gap-1.5 pt-[6px]">
                <span
                  dir="auto"
                  className={cn(
                    "font-sans text-[17px] font-semibold leading-[1.3] transition-colors duration-500",
                    lit ? "text-white" : "text-primary-200"
                  )}
                >
                  {s.title}
                </span>
                <span
                  dir="auto"
                  className={cn(
                    "font-sans text-[13.5px] font-normal leading-[1.6] transition-colors duration-500",
                    now ? "text-primary-100" : "text-primary-300"
                  )}
                >
                  {s.desc}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
