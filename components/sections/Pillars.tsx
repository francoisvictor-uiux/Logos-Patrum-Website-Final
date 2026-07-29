"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Icon, type IconName } from "@/components/icons";
import { LiveDot } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Dict } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Pillars = Dict["pillars"];
type UI = Pillars["ui"];

const PILLAR_ICONS: IconName[] = ["search", "translation", "network"];

/**
 * Research Pillars — the methodology section, directly under the hero.
 *
 * Not three feature cards: one simplified workspace carries the product, and
 * three editorial columns beneath it name the stages of the workflow. The
 * workspace answers to the reader — scrolling through the columns (or hovering
 * one) lights the matching panel, so the surface reads as one tool responding
 * to the story rather than a static screenshot.
 *
 * Styling follows the hero: swsh display headings in the title token, the
 * accent navy reserved for emphasis, and the hero's orange ping as the single
 * "live" signal. Motion is GSAP throughout — ScrollTrigger entrance, a
 * scroll-spy for the story, and a quickTo parallax capped at 8px / 1°.
 */
export default function Pillars({ dict }: { dict: Dict }) {
  const t = dict.pillars;
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  /* A deliberate pointer beats ambient scroll progress. */
  const shown = hovered ?? active;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(
        {
          full: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          if (ctx.conditions?.reduce) return;

          /* Entrance — eyebrow, headline, description, workspace, pillars,
             each 80ms behind the last. ScrollTrigger lives on the timeline,
             never on child tweens. */
          gsap
            .timeline({
              defaults: { ease: "power3.out", duration: 0.8 },
              scrollTrigger: { trigger: root.current, start: "top 75%" },
            })
            .from(q("[data-p-eyebrow]"), { autoAlpha: 0, y: 32 })
            .from(q("[data-p-title]"), { autoAlpha: 0, y: 32 }, "<0.08")
            .from(q("[data-p-desc]"), { autoAlpha: 0, y: 32 }, "<0.08")
            .from(
              stage.current,
              {
                autoAlpha: 0,
                y: 32,
                scale: 0.97,
                duration: 1,
              },
              "<0.08"
            )
            .from(q("[data-p-pillar]"), { autoAlpha: 0, y: 32, stagger: 0.08 }, "<0.08");

          /* The stage used to be driven by a scroll-spy over this range. The
             workspace now plays itself on a loop (see Workspace), and two
             drivers on one piece of state only fight — so the demo owns it and
             a pointer on a pillar still overrides, below. */

          /* Parallax — workspace only, fine pointers only. 8px and one degree,
             eased through quickTo so it drifts rather than tracks. */
          const el = stage.current;
          if (!el || window.matchMedia("(pointer: coarse)").matches) return;

          gsap.set(el, { transformPerspective: 1200 });
          const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
          const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
          const rxTo = gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3.out" });
          const ryTo = gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3.out" });

          const onMove = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
            const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
            xTo(gsap.utils.clamp(-8, 8, dx * 8));
            yTo(gsap.utils.clamp(-8, 8, dy * 8));
            ryTo(gsap.utils.clamp(-1, 1, dx));
            rxTo(gsap.utils.clamp(-1, 1, -dy));
          };
          const onLeave = () => {
            xTo(0);
            yTo(0);
            rxTo(0);
            ryTo(0);
          };

          const section = root.current!;
          section.addEventListener("pointermove", onMove);
          section.addEventListener("pointerleave", onLeave);
          return () => {
            section.removeEventListener("pointermove", onMove);
            section.removeEventListener("pointerleave", onLeave);
          };
        }
      );
    },
    { scope: root }
  );

  return (
    <section
      id="pillars"
      ref={root}
      className="relative isolate overflow-clip bg-white px-5 py-[96px] md:py-[128px] lg:px-8 lg:py-[160px]"
    >
      {/* One soft spotlight behind the workspace. No page-wide gradients. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[46%] -z-10 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.06] blur-[130px]"
        style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }}
      />

      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center">
        {/* Eyebrow — the hero's badge carried forward whole, not just its dot:
            chip fill on a hairline, 10px live point, 16px/600 at 0.08em. The
            two sides of the fold now open on the same object. (Arabic zeroes
            the tracking via the tracking-* rule in globals.css.) */}
        <div
          data-p-eyebrow
          className="mb-[16px] flex min-h-[36px] items-center gap-[8px] rounded-[100px] border border-line-strong bg-chip px-[17px] py-[4px]"
        >
          <LiveDot className="size-[10px] [&>span]:size-[10px]" />
          <p
            dir="auto"
            className="text-balance text-center font-sans text-[16px] font-semibold leading-[24px] tracking-[0.08em] text-muted-2"
            style={{ fontFeatureSettings: '"swsh"' }}
          >
            {t.eyebrow}
          </p>
        </div>

        {/* whitespace-pre-line, not text-balance: the clause break lives in the
            translation so both scripts land the same two lines. Each line still
            wraps on its own if the viewport is too narrow to hold it. */}
        <h2
          data-p-title
          dir="auto"
          className="mb-[24px] max-w-[760px] whitespace-pre-line text-center font-display text-[32px] font-bold leading-[1.12] text-title sm:text-[40px] lg:text-[48px]"
          style={{ fontFeatureSettings: '"swsh"' }}
        >
          {t.title}
        </h2>

        <p
          data-p-desc
          dir="auto"
          className="mb-[64px] max-w-[720px] text-center font-sans text-[18px] font-normal leading-[1.7] text-muted sm:text-[20px] lg:mb-[96px]"
        >
          {t.description}
        </p>

        {/* Workspace + pillars share one wrapper. */}
        <div className="flex w-full flex-col items-center">
          <Workspace ref={stage} ws={t.workspace} ui={t.ui} shown={shown} onStage={setActive} />

          {/* Three editorial columns — no cards, no fills, no borders. */}
          {/* Spacing system: 3-column grid gap 32, workspace → pillars 96. */}
          <div className="mt-[64px] grid w-full max-w-[1120px] gap-8 md:grid-cols-3 lg:mt-[96px]">
            {t.cards.map((card, i) => (
              <article
                key={card.title}
                data-p-pillar
                onPointerEnter={() => setHovered(i)}
                onPointerLeave={() => setHovered(null)}
                className="group flex cursor-default flex-col gap-4 transition-transform duration-[220ms] ease-out hover:-translate-y-1 motion-reduce:transform-none"
              >
                <div className="flex items-center gap-3">
                  <Icon
                    name={PILLAR_ICONS[i]}
                    className="size-5 shrink-0 text-accent transition-transform duration-[220ms] ease-out group-hover:scale-[1.06] motion-reduce:transform-none"
                  />
                  {/* The live dot walks the row as the demo advances, and leads
                      the number — right of it in Arabic, left of it in English. */}
                  <LiveDot
                    className={cn(
                      "transition-opacity duration-300",
                      shown === i ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="text-[13px] font-medium leading-none tracking-[0.08em] text-faint">
                    {card.num}
                  </span>
                </div>

                {/* Title —12— body, per the card rhythm. */}
                <div className="flex flex-col gap-3">
                  <h3
                    dir="auto"
                    className="font-display text-[26px] font-bold leading-none text-title transition-colors duration-[220ms] ease-out group-hover:text-accent"
                    style={{ fontFeatureSettings: '"swsh"' }}
                  >
                    {card.title}
                  </h3>
                  <p dir="auto" className="font-sans text-[16px] leading-[1.7] text-muted-2">
                    <span className="font-medium text-gray-700">{card.lead}</span> {card.desc}
                  </p>
                </div>

                <Preview index={i} ui={t.ui} on={shown === i} />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===============================================================
   WORKSPACE — a simplified application surface that plays itself.

   Not a screenshot and not a video file: a scripted pointer walks the
   real markup — types the query, picks a filter, opens a result, then
   moves through the three panels — and loops. The same DOM answers to a
   real pointer, so nothing has to be swapped out when the reader takes
   over. Under reduced motion the cursor never appears and the surface
   is simply the still it always was.
   =============================================================== */
function Workspace({
  ref,
  ws,
  ui,
  shown,
  onStage,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
  ws: Pillars["workspace"];
  ui: UI;
  shown: number;
  onStage: (i: number) => void;
}) {
  const cursor = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLSpanElement>(null);
  const field = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLSpanElement>(null);
  const typed = useRef<HTMLSpanElement>(null);
  const caret = useRef<HTMLSpanElement>(null);
  const chips = useRef<(HTMLSpanElement | null)[]>([]);
  const rows = useRef<(HTMLDivElement | null)[]>([]);
  /* Indexed by stage, not by DOM order: 0 analyse, 1 translate, 2 connect. */
  const panels = useRef<(HTMLElement | null)[]>([]);

  const [chip, setChip] = useState(0);
  const [row, setRow] = useState(0);

  useGSAP(
    () => {
      const root = ref.current;
      const cur = cursor.current;
      if (!root || !cur) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          /* Listed so GSAP rebuilds the script when a stop appears or
             disappears — the filters arrive at sm, the results rail at lg. */
          chipsUp: "(min-width: 640px)",
          railUp: "(min-width: 1024px)",
        },
        (ctx) => {
          if (!ctx.conditions?.motion) return;

          /* Local coordinates read off the layout, not off screen rects: the
             stage carries a parallax rotation and the cursor lives inside it,
             so rects are projected where offsets are not. */
          const at = (el: HTMLElement) => ({
            x: el.offsetLeft + el.offsetWidth / 2,
            y: el.offsetTop + el.offsetHeight / 2,
          });
          /* offsetParent is null exactly when a breakpoint has display:none'd
             the stop — the cursor skips it rather than diving to the origin. */
          const shows = (el: HTMLElement | null): el is HTMLElement => !!el?.offsetParent;

          const rtl = getComputedStyle(root).direction === "rtl";
          const query = ui.word;

          const clear = () => {
            setChip(-1);
            setRow(-1);
            onStage(-1);
            if (typed.current) typed.current.textContent = "";
          };

          const tl = gsap.timeline({
            paused: true,
            repeat: -1,
            repeatDelay: 1,
            /* Re-reads every function-based value each loop, so a resize
               between passes lands the cursor on the new layout. */
            repeatRefresh: true,
            defaults: { ease: "power2.inOut" },
          });

          const hold = (duration: number) => tl.to({}, { duration });

          /* Glide, dip, ring — one press. The action fires on the dip so the
             panel answers the click rather than trailing it. */
          const visit = (el: HTMLElement | null, run?: () => void, after = 0.7) => {
            if (!shows(el)) return;
            tl.to(cur, { duration: 0.75, x: () => at(el).x, y: () => at(el).y }, "+=0.12")
              .to(cur, { scale: 0.82, duration: 0.12, ease: "power2.out" })
              .fromTo(
                ring.current,
                { scale: 0.3, autoAlpha: 0.5 },
                { scale: 2.6, autoAlpha: 0, duration: 0.6, ease: "power2.out" },
                "<"
              )
              .to(cur, { scale: 1, duration: 0.22 }, "<0.1");
            if (run) tl.call(run, undefined, "<");
            hold(after);
          };

          tl.call(clear)
            .set([hint.current, caret.current], { autoAlpha: 1 })
            .set(caret.current, { autoAlpha: 0 })
            /* Enters from the reader's side of the surface. */
            .fromTo(
              cur,
              {
                autoAlpha: 0,
                scale: 1,
                x: () => root.offsetWidth * (rtl ? 0.84 : 0.16),
                y: () => root.offsetHeight * 0.86,
              },
              { autoAlpha: 1, duration: 0.45, ease: "power2.out" }
            );

          // 1 — the query, typed into the real field.
          if (shows(field.current)) {
            visit(field.current, undefined, 0.15);
            tl.set(hint.current, { autoAlpha: 0 }).set(caret.current, { autoAlpha: 1 });
            const t = { i: 0 };
            tl.fromTo(
              t,
              { i: 0 },
              {
                i: query.length,
                duration: query.length * 0.11,
                ease: "none",
                onUpdate: () => {
                  if (typed.current) {
                    typed.current.textContent = query.slice(0, Math.round(t.i));
                  }
                },
              }
            );
            hold(0.6);
          }

          // 2 — narrow it to the source language.
          visit(chips.current[0], () => setChip(0), 0.5);

          // 3 — open a result; the morphology answers.
          visit(rows.current[0], () => {
            setRow(0);
            onStage(0);
          }, 1.4);

          // 4 — the received reading.
          visit(panels.current[1], () => onStage(1), 1.6);

          // 5 — and where it is cited.
          visit(panels.current[2], () => onStage(2), 1.6);

          tl.to(cur, { autoAlpha: 0, duration: 0.4, ease: "power2.in" });
          hold(0.5);

          /* A loop nobody is looking at is just a heater. onToggle only reports
             transitions, so onRefresh seeds the state — otherwise landing with
             the section already on screen leaves the demo parked on frame one. */
          const playing = (self: ScrollTrigger) => (self.isActive ? tl.play() : tl.pause());
          ScrollTrigger.create({
            trigger: root,
            start: "top 92%",
            end: "bottom 8%",
            onToggle: playing,
            onRefresh: playing,
          });

          return () => {
            tl.kill();
          };
        }
      );
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      aria-label={ws.label}
      /* relative: the offsetParent every stop is measured against, and the
         containing block for the cursor. */
      className="relative w-full max-w-[960px] rounded-[24px] border border-line bg-white p-3 lg:min-h-[560px] lg:p-4"
    >
      {/* Toolbar */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-2 pb-3">
        <div ref={field} className="flex flex-1 items-center gap-2 rounded-[10px] bg-chip px-3 py-2">
          <Icon name="search" className="size-4 shrink-0 text-faint" />
          {/* The placeholder is taken out of flow so the typed query starts at
              the head of the line in either direction. */}
          <span className="relative flex min-w-0 flex-1 items-center text-[13px] leading-none">
            <span
              ref={hint}
              dir="auto"
              className="absolute inset-0 flex items-center truncate text-faint"
            >
              {ws.search}
            </span>
            {/* Written by the demo, never by React — left empty so a re-render
                cannot wipe what has been typed so far. */}
            <span ref={typed} dir="ltr" className="font-greek text-title" />
            <span ref={caret} className="ms-[2px] inline-block h-[13px] w-px bg-accent opacity-0" />
          </span>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          {ws.filters.map((f, i) => (
            <span
              key={f}
              ref={(el) => {
                chips.current[i] = el;
              }}
              dir="auto"
              className={cn(
                "rounded-full px-3 py-1.5 text-[12px] leading-none transition-colors duration-300",
                chip === i ? "bg-accent text-white" : "bg-chip text-muted-2"
              )}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-3 lg:h-[476px] lg:flex-row">
        {/* Results rail */}
        <aside className="hidden w-full shrink-0 flex-col gap-2 lg:flex lg:w-[220px]">
          <span className="px-2 text-[11px] font-medium uppercase leading-none tracking-[0.1em] text-faint">
            {ws.resultsLabel}
          </span>
          {ws.results.map((r, i) => (
            <div
              key={r.title}
              ref={(el) => {
                rows.current[i] = el;
              }}
              dir="auto"
              className={cn(
                "flex flex-col gap-1 rounded-[12px] px-3 py-2.5 transition-colors duration-300",
                row === i && "bg-accent-soft"
              )}
            >
              <span className="text-[13px] font-medium leading-none text-gray-700">{r.title}</span>
              <span className="text-[11px] leading-none text-faint">{r.meta}</span>
            </div>
          ))}
        </aside>

        <div className="flex flex-1 flex-col gap-3">
          {/* Translation panel — the crossfade from generic to received reading */}
          <Panel
            ref={(el) => {
              panels.current[1] = el;
            }}
            title={ws.panels.translate}
            active={shown === 1}
            className="flex-1"
          >
            <div className="flex flex-col gap-3">
              <p dir="ltr" className="font-greek text-[17px] leading-relaxed text-gray-700">
                {ui.sourceLine}
              </p>
              <span className="h-px w-full bg-chip" aria-hidden />
              <CrossfadeLine ui={ui} on={shown === 1} className="text-[16px]" />
              <span
                dir="auto"
                className={cn(
                  "w-fit rounded-full bg-accent-soft px-3 py-1 text-[11px] leading-none text-accent",
                  "transition-opacity duration-500",
                  shown === 1 ? "opacity-100" : "opacity-50"
                )}
              >
                {ui.tradition}
              </span>
            </div>
          </Panel>

          <div className="flex flex-col gap-3 sm:flex-row lg:h-[210px]">
            {/* Analysis panel — morphology lights up */}
            <Panel
              ref={(el) => {
                panels.current[0] = el;
              }}
              title={ws.panels.analyze}
              active={shown === 0}
              className="flex-1"
            >
              <div className="flex flex-col items-start gap-3">
                <span
                  dir="ltr"
                  className="rounded-[10px] border border-line px-3 py-1.5 font-greek text-[20px] leading-none text-title"
                >
                  {ui.word}
                </span>
                <MorphTags tags={ui.tags} on={shown === 0} quiet />
              </div>
            </Panel>

            {/* Connections panel — the graph expands */}
            <Panel
              ref={(el) => {
                panels.current[2] = el;
              }}
              title={ws.panels.connect}
              active={shown === 2}
              className="flex-1"
            >
              <NodeGraph labels={ui.nodes} label={ui.graph} on={shown === 2} compact />
            </Panel>
          </div>
        </div>
      </div>

      {/* The playback cursor. Decorative: the surface is fully described by
          its own markup, so nothing here is announced. */}
      <div
        ref={cursor}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-20 opacity-0"
      >
        <span
          ref={ring}
          className="absolute -left-[14px] -top-[14px] block size-[28px] rounded-full border border-accent opacity-0"
        />
        <svg
          width="20"
          height="22"
          viewBox="0 0 20 22"
          fill="none"
          className="relative -translate-x-px -translate-y-px"
        >
          <path
            d="M1.5 1.2 L1.5 15.8 L5.6 12.1 L8.2 17.9 L11.1 16.6 L8.5 10.9 L14.2 10.6 Z"
            className="fill-accent"
            stroke="#fff"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

/* A workspace panel. The active stage gets the hero's live dot; the
   others stay legible but recede. */
function Panel({
  ref,
  title,
  active,
  className,
  children,
}: {
  ref?: React.Ref<HTMLElement>;
  title: string;
  active: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      ref={ref}
      className={cn(
        "rounded-[16px] border p-4 transition-[opacity,border-color,background-color] duration-500 ease-out",
        active
          ? "border-accent-line bg-accent-soft/60 opacity-100"
          : "border-gray-100 bg-white opacity-65",
        className
      )}
    >
      {/* The dot leads the label, so it sits to the right of the word in Arabic
          and to the left in English. Always rendered, only faded — appearing
          into the flow would shunt the label sideways on every stage change. */}
      <h4
        dir="auto"
        className={cn(
          "mb-3 flex items-center gap-2 text-[11px] font-medium uppercase leading-none tracking-[0.1em] transition-colors duration-500",
          active ? "text-accent" : "text-faint"
        )}
      >
        <LiveDot
          className={cn(
            "size-[6px] transition-opacity duration-500 [&>span]:size-[6px]",
            active ? "opacity-100" : "opacity-0"
          )}
        />
        {title}
      </h4>
      {children}
    </section>
  );
}

/* ===============================================================
   MINI PREVIEWS — one per pillar, all reacting to `on`
   =============================================================== */
function Preview({ index, ui, on }: { index: number; ui: UI; on: boolean }) {
  return (
    /* mt-2 + the article's gap-4 = 24px body → preview. */
    <div
      className={cn(
        "mt-2 min-h-[136px] rounded-[16px] border p-4 transition-colors duration-300",
        on ? "border-line bg-gray-50" : "border-gray-100 bg-gray-50"
      )}
    >
      {index === 0 && (
        <div className="flex flex-col items-start gap-3">
          <span
            dir="ltr"
            className="rounded-[10px] border border-line bg-white px-3 py-1.5 font-greek text-[22px] leading-none text-title"
          >
            {ui.word}
          </span>
          <MorphTags tags={ui.tags} on={on} />
        </div>
      )}
      {index === 1 && <TranslatePreview ui={ui} on={on} />}
      {index === 2 && <NodeGraph labels={ui.nodes} label={ui.graph} on={on} />}
    </div>
  );
}

/* Morphology tags — animate into view when their stage is live. */
function MorphTags({ tags, on, quiet }: { tags: readonly string[]; on: boolean; quiet?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag, i) => (
        <span
          key={tag}
          dir="auto"
          className={cn(
            "rounded-full border px-2.5 py-1 text-[11px] leading-none transition-all duration-300 ease-out motion-reduce:transform-none",
            on
              ? "translate-y-0 border-accent-line bg-white text-accent opacity-100"
              : cn(
                  "border-transparent bg-chip text-faint",
                  quiet ? "translate-y-0 opacity-60" : "translate-y-1 opacity-70"
                )
          )}
          style={{ transitionDelay: `${on ? i * 60 : 0}ms` }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

/* Generic rendering ⇄ received reading, softly crossfaded. */
function CrossfadeLine({ ui, on, className }: { ui: UI; on: boolean; className?: string }) {
  return (
    <span className={cn("relative block font-sans leading-snug", className)} dir="auto">
      {/* The received reading holds the layout… */}
      <span
        className={cn(
          "block text-title transition-opacity duration-500 ease-out",
          on ? "opacity-100" : "opacity-0"
        )}
      >
        {ui.targetLine}
      </span>
      {/* …while the generic line sits on top until the stage goes live. */}
      <span
        className={cn(
          "absolute inset-0 block text-muted-2 transition-opacity duration-500 ease-out",
          on ? "opacity-0" : "opacity-100"
        )}
        aria-hidden={on}
      >
        {ui.targetGeneric}
      </span>
    </span>
  );
}

function TranslatePreview({ ui, on }: { ui: UI; on: boolean }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-1">
        <span dir="auto" className="text-[10px] uppercase leading-none tracking-[0.1em] text-faint">
          {ui.source}
        </span>
        <span dir="ltr" className="font-greek text-[15px] leading-snug text-gray-700">
          {ui.sourceLine}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span dir="auto" className="text-[10px] uppercase leading-none tracking-[0.1em] text-faint">
          {ui.target}
        </span>
        <CrossfadeLine ui={ui} on={on} className="text-[14px]" />
      </div>
      <div
        className={cn(
          "flex items-center gap-2 transition-all duration-500 ease-out motion-reduce:transform-none",
          on ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
        )}
      >
        <span dir="auto" className="text-[10px] uppercase leading-none tracking-[0.1em] text-faint">
          {ui.contextLabel}
        </span>
        <span
          dir="auto"
          className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] leading-none text-accent"
        >
          {ui.tradition}
        </span>
      </div>
    </div>
  );
}

/* ===============================================================
   NODE GRAPH — four Fathers in a diamond, citations between them.
   Symmetric by construction, so text direction never affects it.
   =============================================================== */
const NODES = [
  { cx: 150, cy: 22, dy: -13 },
  { cx: 44, cy: 76, dy: 22 },
  { cx: 256, cy: 76, dy: 22 },
  { cx: 150, cy: 122, dy: 22 },
];
const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
];

function NodeGraph({
  labels,
  label,
  on,
  compact,
}: {
  labels: readonly string[];
  label: string;
  on: boolean;
  compact?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 300 148"
      role="img"
      aria-label={label}
      className={cn(
        "h-auto w-full origin-center transition-transform duration-700 ease-out motion-reduce:transform-none",
        on ? "scale-100" : "scale-[0.94]",
        compact && "max-h-[150px]"
      )}
    >
      {EDGES.map(([a, b], i) => (
        <line
          key={i}
          x1={NODES[a].cx}
          y1={NODES[a].cy}
          x2={NODES[b].cx}
          y2={NODES[b].cy}
          strokeWidth="1"
          strokeDasharray="3 4"
          strokeDashoffset={on ? 0 : 14}
          className={cn(
            "transition-[stroke,stroke-dashoffset] duration-700 ease-out",
            on ? "stroke-primary-300" : "stroke-line"
          )}
          style={{ transitionDelay: `${on ? i * 60 : 0}ms` }}
        />
      ))}

      {NODES.map((n, i) => (
        <g key={labels[i]}>
          {/* The pulse only breathes while the stage is live. */}
          {on && (
            <circle
              cx={n.cx}
              cy={n.cy}
              r="9"
              opacity="0.6"
              className="fill-live-halo animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          )}
          <circle
            cx={n.cx}
            cy={n.cy}
            r={on ? 5.5 : 4}
            className={cn(
              "transition-all duration-500 ease-out",
              on ? "fill-accent" : "fill-gray-300"
            )}
            style={{ transitionDelay: `${on ? i * 70 : 0}ms` }}
          />
          <text
            x={n.cx}
            y={n.cy + n.dy}
            textAnchor="middle"
            dominantBaseline="middle"
            className={cn(
              "text-[11px] transition-colors duration-500",
              on ? "fill-gray-700" : "fill-faint"
            )}
          >
            {labels[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}
