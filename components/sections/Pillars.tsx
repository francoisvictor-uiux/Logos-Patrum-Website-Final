"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Icon, type IconName } from "@/components/icons";
import { SectionBadge } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Dict } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Pillars = Dict["pillars"];
type UI = Pillars["ui"];
/* The translate demo's three states: nothing asked, working, answered. */
type Phase = "idle" | "working" | "done";

/* The steps in the order they are read, each with its mark and its demo. This
   list runs parallel to `pillars.cards` in the dictionaries — reorder one and
   you must reorder the other. The order is the loader's: translate, analyse,
   connect. */
const STEPS = [
  { icon: "translation", demo: "translate" },
  { icon: "search", demo: "analyse" },
  { icon: "network", demo: "connect" },
] as const satisfies readonly { icon: IconName; demo: string }[];

type StepKind = (typeof STEPS)[number]["demo"];

/* Two sentinel values for the relay. ALL is the resting state — every demo
   settled — which is what renders on the server and what a reader under
   reduced motion keeps, since the script that moves off it never runs there.
   NONE is the dark frame the relay starts from once the script does run. */
const ALL = -1;
const NONE = -2;

/* Which card is playing, and whether it has reached its second beat. Every
   demo is two beats: something arrives, then it resolves. */
type Beat = { card: number; deep: boolean };

/**
 * Research Pillars — the methodology section, directly under the hero.
 *
 * Three cards, one per stage of the work. Each carries a small looping demo of
 * its own stage above an icon, the verb, and one sentence — no chrome around
 * the demo but a hairline, nothing around the words at all.
 *
 * The three play as a relay rather than together: analyse, then translate, then
 * connect, then round again. One thing moves at a time, so the section reads as
 * a sequence of steps instead of three features competing for the eye. A
 * pointer on any card takes it over and shows that stage resolved.
 *
 * Styling follows the hero: swsh display headings in the title token and the
 * accent navy reserved for emphasis. Motion is GSAP — a ScrollTrigger entrance
 * and the relay clock — while the demos themselves are CSS transitions keyed
 * off the beat, so they are correct with no script at all.
 */
export default function Pillars({ dict }: { dict: Dict }) {
  const t = dict.pillars;
  const root = useRef<HTMLElement>(null);
  const [beat, setBeat] = useState<Beat>({ card: ALL, deep: true });
  const [hovered, setHovered] = useState<number | null>(null);

  /* A deliberate pointer beats the clock. */
  const playing = hovered ?? beat.card;
  const isOn = (i: number) => playing === ALL || playing === i;
  /* Hovering skips the wait and shows the stage answered. */
  const isDeep = (i: number) =>
    playing === ALL || (playing === i && (hovered !== null || beat.deep));

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

          /* Entrance — eyebrow, headline, description, cards, each 80ms behind
             the last. ScrollTrigger lives on the timeline, never on child
             tweens. */
          gsap
            .timeline({
              defaults: { ease: "power3.out", duration: 0.8 },
              scrollTrigger: { trigger: root.current, start: "top 75%" },
            })
            .from(q("[data-p-eyebrow]"), { autoAlpha: 0, y: 32 })
            .from(q("[data-p-title]"), { autoAlpha: 0, y: 32 }, "<0.08")
            .from(q("[data-p-desc]"), { autoAlpha: 0, y: 32 }, "<0.08")
            .from(q("[data-p-pillar]"), { autoAlpha: 0, y: 32, stagger: 0.08 }, "<0.08");

          /* With a script running, the demos start dark and the relay lights
             them. Without one they stay as rendered: all three settled. */
          setBeat({ card: NONE, deep: false });

          /* The relay clock. Nothing but setState — every demo is CSS from
             here, so there is one timeline for the section rather than three
             animation engines running inside three cards. */
          const tl = gsap.timeline({
            paused: true,
            repeat: -1,
            repeatDelay: 0.6,
          });
          const hold = (duration: number) => tl.to({}, { duration });

          [0, 1, 2].forEach((card) => {
            tl.call(() => setBeat({ card, deep: false }));
            hold(0.9);
            tl.call(() => setBeat({ card, deep: true }));
            hold(2.2);
          });

          /* A loop nobody is looking at is just a heater. onToggle only reports
             transitions, so onRefresh seeds the state — otherwise landing with
             the section already on screen leaves the relay parked on frame
             one. */
          const playPause = (self: ScrollTrigger) => (self.isActive ? tl.play() : tl.pause());
          ScrollTrigger.create({
            trigger: root.current,
            start: "top 92%",
            end: "bottom 8%",
            onToggle: playPause,
            onRefresh: playPause,
          });

          return () => {
            tl.kill();
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
      /* The padding does two jobs, and both are proportions rather than
         distances.

         It pays for whichever edge of the sheet is deckled — the bite is 13.4%
         of the sheet inward. Standing, that is horizontal, so the side padding
         is a percentage: a fixed inset that cleared it on a phone would be
         swallowed at 1024.

         And it is what sets the sheet's white margin. The design draws a
         1746×1115 sheet around a 1120 grid — 313 of white on each side and
         ~195 above and below — so the margin is most of what makes the sheet
         read as a sheet rather than as a backing board. Since the sheet is
         already near the full width of the section, that margin has to come
         from insetting the content: 10% a side, and 240 top and bottom. */
      className="relative isolate overflow-clip bg-primary-500 px-[17%] py-[96px] md:py-[128px] lg:px-[10%] lg:py-[240px]"
    >
      {/* The sheet. The section's ground is navy and everything the reader
          reads sits on a torn sheet of paper laid over it, so the type keeps
          the light-mode tokens it was chosen for — nothing inside had to be
          recoloured for the darker section.

          The artwork is drawn portrait and carries its deckled edges on its two
          long sides. From lg, where the steps stand three across and the
          section is wider than it is tall, the sheet is turned a quarter and
          flipped exactly as the design has it, which puts those edges along the
          top and bottom. Below that the steps stack into a tall column and the
          sheet is left standing — the orientation the artwork was drawn in.

          The layer is inset by the same amount on both sides, so the sheet is
          centred in the section; the content inside is centred on it in turn by
          its own mx-auto.

          The turn needs the box's height as the image's width, which no
          percentage can express — hence the container units. The SVG itself
          carries preserveAspectRatio="none", so it takes whatever box it is
          given rather than letterboxing inside it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-3 inset-y-10 -z-10 [container-type:size] sm:inset-x-6 lg:inset-x-8 lg:inset-y-12"
      >
        {/* Standing — the stacked column. */}
        <div className="size-full bg-[url('/images/pillars-paper.svg')] bg-[length:100%_100%] bg-no-repeat lg:hidden" />
        {/* Turned — the three-across grid. */}
        <div className="absolute left-1/2 top-1/2 hidden h-[100cqw] w-[100cqh] -translate-x-1/2 -translate-y-1/2 -rotate-90 scale-y-[-1] bg-[url('/images/pillars-paper.svg')] bg-[length:100%_100%] bg-no-repeat lg:block" />
      </div>
      {/* Centred on the sheet, which is itself centred in the section: one
          column, the words at the top and the three steps under them. */}
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center">
        {/* The page-wide section badge — see SectionBadge in components/ui. */}
        <div data-p-eyebrow className="mb-[16px]">
          <SectionBadge>{t.eyebrow}</SectionBadge>
        </div>

        {/* whitespace-pre-line, not text-balance: the clause break lives in the
            translation so both scripts land the same two lines. Each line still
            wraps on its own if the viewport is too narrow to hold it — which is
            why the cap opens to 900 at the 48px step, where the longer clause
            measures 632px and a tighter cap would have folded it. */}
        <h2
          data-p-title
          dir="auto"
          className="mb-[24px] max-w-[760px] whitespace-pre-line text-center font-display text-[32px] font-bold leading-[1.12] text-title sm:text-[40px] lg:max-w-[900px] lg:text-[48px]"
          style={{ fontFeatureSettings: '"swsh"' }}
        >
          {t.title}
        </h2>

        <p
          data-p-desc
          dir="auto"
          className="mb-[64px] max-w-[720px] text-center font-sans text-[18px] font-normal leading-[1.85] text-muted sm:text-[20px] lg:mb-[96px]"
        >
          {t.description}
        </p>

        {/* Three steps. The demo is framed; the words under it are not. Three
            across only from lg — below it the sheet is standing and its deckle
            takes 17% off each side, so columns there would leave nothing. */}
        <div className="grid w-full max-w-[1120px] gap-x-8 gap-y-[56px] lg:grid-cols-3">
          {t.cards.map((card, i) => (
            <article
              key={card.title}
              data-p-pillar
              onPointerEnter={() => setHovered(i)}
              onPointerLeave={() => setHovered(null)}
              className="group flex cursor-default flex-col gap-5 transition-transform duration-[220ms] ease-out hover:-translate-y-1 motion-reduce:transform-none"
            >
              <StepDemo kind={STEPS[i].demo} ui={t.ui} on={isOn(i)} deep={isDeep(i)} />

              <div className="flex flex-col gap-3">
                {/* The icon leads the verb — right of it in Arabic, left of it
                    in English. Nothing else on the line. */}
                <div className="flex items-center gap-3">
                  <Icon
                    name={STEPS[i].icon}
                    className="size-6 shrink-0 text-accent transition-transform duration-[220ms] ease-out group-hover:scale-[1.06] motion-reduce:transform-none"
                  />
                  <h3
                    dir="auto"
                    className="font-display text-[26px] font-bold leading-none text-title transition-colors duration-[220ms] ease-out group-hover:text-accent"
                    style={{ fontFeatureSettings: '"swsh"' }}
                  >
                    {card.title}
                  </h3>
                </div>

                <p
                  dir="auto"
                  className="text-justify font-sans text-[16px] leading-[1.85] text-muted-2"
                >
                  <span className="font-medium text-gray-700">{card.lead}</span> {card.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===============================================================
   THE DEMOS — one per step, each two beats long.

   No toolbars, no search fields, no window chrome: each frame holds only the
   thing its step is about. They are CSS transitions keyed off the beat rather
   than animations of their own, so a demo that is never reached — reduced
   motion, no JS — simply renders as the finished picture.
   =============================================================== */
function StepDemo({ kind, ui, on, deep }: { kind: StepKind; ui: UI; on: boolean; deep: boolean }) {
  return (
    <div
      className={cn(
        "flex h-[200px] w-full items-center justify-center rounded-[16px] border px-4 transition-colors duration-500 ease-out sm:h-[220px]",
        /* Live: the orange wash inside a deep orange rule. A pointer arrives
           here by the same door the relay clock does — hover feeds the same
           on/deep state — so there is one live look on these cards rather
           than a hover look and a loop look.

           The card at rest is not empty and not hidden, it is quiet: every
           demo shows all of its content in grey, and going live colours it in
           and plays the step. So nothing is withheld from a reader who never
           hovers and never waits for the clock. */
        on ? "border-orange-700 bg-orange-100" : "border-line bg-gray-50"
      )}
    >
      {kind === "translate" && <TranslateDemo ui={ui} on={on} deep={deep} />}
      {kind === "analyse" && <AnalyseDemo ui={ui} on={on} deep={deep} />}
      {kind === "connect" && <NodeGraph labels={ui.nodes} label={ui.graph} on={deep} />}
    </div>
  );
}

/* Step one — the word arrives, then comes apart into its grammar. */
function AnalyseDemo({ ui, on, deep }: { ui: UI; on: boolean; deep: boolean }) {
  return (
    <div className="flex w-full flex-col items-center gap-5">
      <span
        dir="ltr"
        className={cn(
          "rounded-[12px] border bg-white px-4 py-2 font-greek text-[26px] leading-none transition-all duration-500 ease-out motion-reduce:transform-none",
          /* The chip keeps its white face either way, so the Greek in it is
             ink on white and never sits on a fill. At rest it is grey and a
             few pixels low; going live colours it and settles it. */
          on
            ? "translate-y-0 border-orange-700 text-title"
            : "translate-y-1 border-line text-muted-2"
        )}
      >
        {ui.word}
      </span>
      <MorphTags tags={ui.tags} on={deep} />
    </div>
  );
}

/* Step two — the source, then the reading it is given. */
function TranslateDemo({ ui, on, deep }: { ui: UI; on: boolean; deep: boolean }) {
  return (
    <div className="flex w-full flex-col gap-4">
      <div
        className={cn(
          "flex flex-col gap-1.5 transition-all duration-500 ease-out motion-reduce:transform-none",
          on ? "translate-y-0" : "translate-y-1"
        )}
      >
        {/* The two language names are read, not decoration, so neither state
            uses the faint token — muted-2 clears AA on the grey card and
            primary-800 clears it several times over on the orange. */}
        <span
          dir="auto"
          className={cn(
            "text-[10px] uppercase leading-[1.4] tracking-[0.1em] transition-colors duration-500",
            on ? "text-primary-800" : "text-muted-2"
          )}
        >
          {ui.source}
        </span>
        <span
          dir="ltr"
          className={cn(
            "font-greek text-[18px] leading-snug transition-colors duration-500",
            on ? "text-primary-900" : "text-muted-2"
          )}
        >
          {ui.sourceLine}
        </span>
      </div>

      <span
        className={cn(
          "h-px w-full transition-colors duration-500",
          on ? "bg-orange-700/40" : "bg-line"
        )}
        aria-hidden
      />

      <div className="flex flex-col gap-1.5">
        <span
          dir="auto"
          className={cn(
            "text-[10px] uppercase leading-[1.4] tracking-[0.1em] transition-colors duration-500",
            on ? "text-primary-800" : "text-muted-2"
          )}
        >
          {ui.target}
        </span>
        <TranslationLine text={ui.targetLine} phase={deep ? "done" : on ? "working" : "idle"} />
      </div>
    </div>
  );
}

/* Morphology tags — animate into view when their beat lands. */
function MorphTags({ tags, on }: { tags: readonly string[]; on: boolean }) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      {tags.map((tag, i) => (
        <span
          key={tag}
          dir="auto"
          className={cn(
            "rounded-full border px-3 py-1 text-[12px] leading-[1.4] transition-all duration-300 ease-out motion-reduce:transform-none",
            /* White pills either way, for the same reason as the word chip.
               At rest they are grey-on-white and legible rather than the
               60%-opacity ghosts they were — a reader who never triggers the
               step still gets to read the grammar. */
            on
              ? "translate-y-0 border-orange-700 bg-white text-accent"
              : "translate-y-1 border-line bg-white text-muted-2"
          )}
          style={{ transitionDelay: `${on ? i * 90 : 0}ms` }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

/* The reading. At rest it is simply there, in grey — the card withholds
   nothing. The working beat is the only moment it steps aside, and only so
   the engine has something to hand back: the pills stand in for one beat,
   then the words are set again one at a time, in ink. */
function TranslationLine({ text, phase }: { text: string; phase: Phase }) {
  const words = text.split(" ");
  const working = phase === "working";
  const done = phase === "done";
  const live = phase !== "idle";

  return (
    <div className="relative min-h-[26px]">
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-[6px] flex items-center gap-2 transition-opacity duration-300",
          working ? "opacity-100" : "opacity-0"
        )}
      >
        {[38, 22, 26].map((w, i) => (
          /* Only ever seen on the orange, so it is toned for the orange. */
          <span
            key={w}
            className="h-[10px] animate-pulse rounded-full bg-orange-700/25 motion-reduce:animate-none"
            style={{ width: `${w}%`, animationDelay: `${i * 160}ms` }}
          />
        ))}
      </span>

      <p
        dir="auto"
        className={cn(
          "font-sans text-[17px] leading-snug transition-colors duration-500",
          live ? "text-primary-900" : "text-muted-2"
        )}
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className={cn(
              "inline-block me-[0.26em] transition-all duration-500 ease-out motion-reduce:transform-none",
              done ? "translate-y-0" : "translate-y-1",
              working ? "opacity-0" : "opacity-100"
            )}
            style={{ transitionDelay: `${done ? i * 90 : 0}ms` }}
          >
            {word}
          </span>
        ))}
      </p>
    </div>
  );
}

/* ===============================================================
   NODE GRAPH — four Fathers in a diamond, citations between them.
   Symmetric by construction, so text direction never affects it.
   =============================================================== */
/* Label offsets are in viewBox units, so they scale with the box. */
const NODES = [
  { cx: 150, cy: 22, dy: -14 },
  { cx: 44, cy: 76, dy: 23 },
  { cx: 256, cy: 76, dy: 23 },
  { cx: 150, cy: 122, dy: 23 },
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
}: {
  labels: readonly string[];
  label: string;
  on: boolean;
}) {
  return (
    /* The box is padded above and below the diamond: the outer labels sit
       outside the node geometry, and Arabic descenders drop well below their
       baseline — a viewBox that ends at the geometry clips them. */
    <svg
      viewBox="0 -4 300 162"
      role="img"
      aria-label={label}
      className={cn(
        "h-auto max-h-full w-full origin-center transition-transform duration-700 ease-out motion-reduce:transform-none",
        on ? "scale-100" : "scale-[0.94]"
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
            /* The resting edge steps up to line-strong: at rest the graph is
               the card's content, not a placeholder for it, so the citations
               have to be followable before anything lights up. */
            on ? "stroke-primary-700" : "stroke-line-strong"
          )}
          style={{ transitionDelay: `${on ? i * 60 : 0}ms` }}
        />
      ))}

      {NODES.map((n, i) => (
        <g key={labels[i]}>
          {/* The pulse only breathes while the step is live. Navy, like the
              nodes it comes off — on an orange card an orange pulse would be
              a status light, and nothing here reports status. */}
          {on && (
            <circle
              cx={n.cx}
              cy={n.cy}
              r="9"
              opacity="0.25"
              className="fill-primary-900 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          )}
          <circle
            cx={n.cx}
            cy={n.cy}
            r={on ? 5.5 : 4}
            className={cn(
              "transition-all duration-500 ease-out",
              on ? "fill-primary-900" : "fill-gray-400"
            )}
            style={{ transitionDelay: `${on ? i * 70 : 0}ms` }}
          />
          <text
            x={n.cx}
            y={n.cy + n.dy}
            textAnchor="middle"
            dominantBaseline="middle"
            className={cn(
              "text-[12px] transition-colors duration-500",
              /* Never the faint token: at 2.4:1 the Fathers were named in a
                 grey that could not be read. muted-2 clears AA at rest and
                 primary-900 is well past AAA once the step is live. */
              on ? "fill-primary-900" : "fill-muted-2"
            )}
          >
            {labels[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}
