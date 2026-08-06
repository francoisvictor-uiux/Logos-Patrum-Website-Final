"use client";

import { Fragment, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { Dict } from "@/lib/i18n";
import { useGraphDraw } from "./use-journey";
import { COMPARE, CONTEXT, INTERPRET, PARSE, TRACE, TRANSLATE } from "./states";

type UI = Dict["journey"]["ui"];

/* ===============================================================
   THE SURFACE — a floating application, not a mockup of one.

   Section 03 lays the product out as a workbench: four regions, all
   of them live at once. This one is composed as an answer. The text
   stays put on the reading side for the whole journey — it is the
   thing being asked about, and it never leaves — and a single panel
   on the other side changes to answer whichever question is up.
   One question, one answer, one surface.

   The one exception is the graph, which is not a panel: when the
   reader asks how the reading travels between two Fathers, it rises
   over the text itself, because that is the only answer whose
   subject is the whole corpus rather than the verse.
   =============================================================== */
export default function WorkspaceDemo({
  ref,
  ui,
  step,
  rest,
  format,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
  ui: UI;
  step: number;
  rest: boolean;
  format: (n: number) => string;
}) {
  /* Hovering a cross-reference lights the word back in the passage, so
     the two halves of the surface are visibly about the same thing. */
  const [hot, setHot] = useState(false);

  /* At rest every panel is open; under the scroll exactly one is. */
  const at = (s: number) => rest || step === s;

  return (
    <div
      ref={ref}
      aria-label={ui.label}
      className={cn(
        "relative flex w-full flex-col overflow-hidden rounded-[24px] border border-line bg-surface shadow-workspace",
        /* Fixed while the scroll drives it, so no state change moves the
           furniture; at rest it grows to hold every panel at once. At lg
           it takes the height the pinned block has left, up to a ceiling
           its contents can actually fill. */
        !rest && "h-[520px] max-w-[1120px] sm:h-[560px] lg:h-full lg:max-h-[540px]"
      )}
    >
      <TitleBar />
      <Toolbar ui={ui} format={format} />

      {/* min-h-0 all the way down, or a flex child refuses to shrink below
          its content and the fixed frame height stops meaning anything. */}
      <div
        className={cn(
          "flex flex-col gap-3 p-3 lg:flex-row lg:gap-4 lg:p-4",
          !rest && "min-h-0 flex-1"
        )}
      >
        {/* The reading stage. The passage holds it for the whole journey;
            the graph is the only thing allowed to cover it. */}
        <div
          className={cn(
            "relative flex flex-col",
            rest ? "min-h-[320px] flex-1" : "min-h-[200px] shrink-0 lg:min-h-0 lg:flex-1"
          )}
        >
          <Reading ui={ui} rest={rest} wide={at(TRACE) || hot} />
          <Graph ui={ui} rest={rest} on={at(COMPARE)} />
        </div>

        {/* The answer. One column, one panel at a time. */}
        <div
          className={cn(
            "shrink-0 lg:w-[340px]",
            rest ? "flex flex-col gap-3" : "relative min-h-0 flex-1 lg:flex-none"
          )}
        >
          <Translation ui={ui} rest={rest} on={at(TRANSLATE)} />
          <CrossReferences ui={ui} rest={rest} on={at(TRACE)} onHot={setHot} />
          <Fathers
            ui={ui}
            rest={rest}
            on={at(INTERPRET) || at(COMPARE)}
            lit={rest ? -1 : step === COMPARE ? 1 : 0}
          />
          <Morphology ui={ui} rest={rest} on={at(PARSE)} />
          <Notes ui={ui} rest={rest} on={at(CONTEXT)} />
        </div>
      </div>
    </div>
  );
}

/* The window itself, above anything the application does. */
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

/* The toolbar. The query is already typed — this section opens after the
   search, on the question the search raised — so the caret simply sits
   at the end of the word and blinks. */
function Toolbar({ ui, format }: { ui: UI; format: (n: number) => string }) {
  return (
    <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 lg:px-5">
      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[10px] border border-accent-line bg-surface px-3 py-2">
        <Icon name="search" className="size-4 shrink-0 text-faint" />
        <span className="flex min-w-0 flex-1 items-center">
          <span dir="ltr" className="truncate font-greek text-[15px] leading-[1.7] text-title">
            {ui.query}
          </span>
          <span data-j-caret aria-hidden className="ms-[2px] block h-[16px] w-px bg-accent" />
        </span>
      </div>

      <span
        dir="auto"
        className="hidden shrink-0 items-center gap-1.5 text-[12px] leading-[1.4] text-muted-2 sm:flex"
      >
        {/* Ships with the final figure formatted, so the number is right
            whether or not the count-up ever runs. */}
        <span data-j-count={ui.count} className="font-semibold text-title">
          {format(ui.count)}
        </span>
        {ui.countLabel}
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------
   THE PASSAGE — the one thing that never changes.
   --------------------------------------------------------------- */
function Reading({ ui, rest, wide }: { ui: UI; rest: boolean; wide: boolean }) {
  /* Split on the word rather than searched for: the verse says it twice,
     and the second occurrence is exactly what "where else does it
     appear" is about. */
  const parts = ui.passage.split(ui.word);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-[16px] border border-gray-100 bg-gray-50/60 p-4 lg:p-5",
        rest ? "flex-1" : "min-h-0 flex-1"
      )}
    >
      <div className="flex shrink-0 items-baseline gap-2">
        <span dir="auto" className="text-[13px] font-medium leading-[1.5] text-gray-700">
          {ui.readingLabel}
        </span>
        <span dir="auto" className="text-[11px] leading-[1.5] text-faint">
          {ui.readingMeta}
        </span>
      </div>

      {/* The verse is one line of Greek in a pane built to hold a graph, so
          it is set large and carried to the optical centre rather than
          left sitting under the label with the rest of the pane empty
          beneath it. This is the only thing on screen for the whole
          journey; it can afford the room. */}
      <div className={cn("flex", rest ? "py-4" : "min-h-0 flex-1 items-center")}>
        <p
          dir="ltr"
          className="font-greek text-[20px] leading-[1.9] text-gray-700 sm:text-[24px] lg:text-[30px]"
        >
          {parts.map((part, i) => (
            <Fragment key={i}>
              {part}
              {i < parts.length - 1 ? (
                <mark
                  className={cn(
                    "relative rounded-[6px] px-1 transition-colors duration-[700ms] ease-out",
                    /* The first occurrence is the subject of every panel,
                       so it is lit for the whole journey. The rest light
                       only when the question widens to the whole corpus. */
                    i === 0 || wide
                      ? "bg-accent-soft text-title"
                      : "bg-transparent text-gray-700"
                  )}
                >
                  {i === 0 ? (
                    <span
                      data-j-glow
                      aria-hidden
                      className="absolute inset-0 -z-10 rounded-[8px] bg-accent-soft"
                    />
                  ) : null}
                  {ui.word}
                </mark>
              ) : null}
            </Fragment>
          ))}
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   A PANEL. Under the scroll the five are stacked on one another and
   exactly one is up; at rest they follow each other down the column.
   --------------------------------------------------------------- */
function Panel({
  title,
  caption,
  on,
  rest,
  children,
}: {
  title: string;
  caption?: string;
  on: boolean;
  rest: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-hidden={!on}
      className={cn(
        "flex flex-col gap-3 rounded-[16px] border border-line bg-surface p-4 transition-all duration-[800ms] ease-out motion-reduce:transform-none",
        rest ? "" : "absolute inset-0 overflow-hidden",
        on ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <div className="flex shrink-0 flex-col gap-0.5">
        <h3
          dir="auto"
          className="text-[11px] font-medium uppercase leading-[1.4] tracking-[0.1em] text-accent"
        >
          {title}
        </h3>
        {caption ? (
          <p dir="auto" className="text-[11px] leading-[1.5] text-faint">
            {caption}
          </p>
        ) : null}
      </div>

      {/* The label stays at the top corner where a panel's label belongs;
          the body sits in the optical centre of what is left. The five
          panels answer very different questions and run to very different
          lengths — three translation lines against three Fathers with a
          paragraph each — and pinning them all to the top would leave the
          short ones looking like a panel that failed to load. */}
      <div
        className={cn(
          "flex flex-col gap-3",
          rest ? "" : "min-h-0 flex-1 justify-center"
        )}
      >
        {children}
      </div>
    </section>
  );
}

/* Rows inside a panel come up a beat behind the panel itself, in order.
   A shared delay so every panel breathes at the same rate. */
const stagger = (on: boolean, i: number, base = 140, gap = 70) =>
  ({ transitionDelay: `${on ? base + i * gap : 0}ms` }) as const;

/* State 1 — the readings. The English line is the one being asked for. */
function Translation({ ui, rest, on }: { ui: UI; rest: boolean; on: boolean }) {
  return (
    <Panel title={ui.translateLabel} on={on} rest={rest}>
      <div className="flex flex-col gap-2.5">
        {ui.translations.map((line, i) => (
          <div
            key={line.lang}
            className={cn(
              "flex flex-col gap-1 rounded-[10px] px-2.5 py-2 transition-all duration-[700ms] ease-out motion-reduce:transform-none",
              i === 1 ? "bg-accent-soft" : "bg-transparent",
              on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            )}
            style={stagger(on, i, 120, 110)}
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
                  ? "font-greek text-[16px] text-gray-700"
                  : cn("font-sans text-[14px]", i === 1 ? "font-medium text-accent" : "text-title")
              )}
            >
              {line.text}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* State 2 — where else the word is written. Hovering a row lights the
   word back in the passage. */
function CrossReferences({
  ui,
  rest,
  on,
  onHot,
}: {
  ui: UI;
  rest: boolean;
  on: boolean;
  onHot: (v: boolean) => void;
}) {
  return (
    <Panel title={ui.crossLabel} caption={ui.crossCaption} on={on} rest={rest}>
      <ul className="flex flex-col gap-1.5" onMouseLeave={() => onHot(false)}>
        {ui.cross.map((row, i) => (
          <li
            key={row.ref}
            onMouseEnter={() => onHot(true)}
            className={cn(
              "flex cursor-default flex-col gap-0.5 rounded-[10px] border border-transparent px-2.5 py-2 transition-all duration-[700ms] ease-out hover:border-accent-line hover:bg-accent-soft motion-reduce:transform-none",
              on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            )}
            style={stagger(on, i, 120, 80)}
          >
            <span className="flex items-baseline justify-between gap-2">
              <span dir="auto" className="text-[12px] font-medium leading-[1.5] text-gray-700">
                {row.ref}
              </span>
              <span dir="auto" className="shrink-0 text-[10px] leading-[1.5] text-faint">
                {row.source}
              </span>
            </span>
            <span dir="ltr" className="truncate font-greek text-[13px] leading-[1.6] text-muted-2">
              {row.snippet}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* States 3 and 4 — the Fathers. The panel does not change between them;
   the highlight moves from one reader to the next, which is the whole
   point of showing them in the same list. */
function Fathers({ ui, rest, on, lit }: { ui: UI; rest: boolean; on: boolean; lit: number }) {
  return (
    <Panel title={ui.fathersLabel} caption={ui.fathersCaption} on={on} rest={rest}>
      <ul className="flex flex-col gap-1.5">
        {ui.fathers.map((f, i) => {
          const active = i === lit;
          return (
            <li
              key={f.name}
              className={cn(
                "flex flex-col gap-1 rounded-[12px] border px-3 py-2.5 transition-all duration-[800ms] ease-out motion-reduce:transform-none",
                active ? "border-accent-line bg-accent-soft" : "border-transparent",
                on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                /* The reader who is not being asked about steps back
                   rather than disappearing: the list has to stay legible
                   as a list, or the highlight means nothing. Last in the
                   list so it wins the merge over opacity-100 — and only
                   while the panel is up, so it can never override the
                   opacity-0 that hides it. */
                on && !active && lit >= 0 && "opacity-55"
              )}
              style={stagger(on, i, 140, 90)}
            >
              <span className="flex items-baseline justify-between gap-2">
                <span dir="auto" className="text-[13px] font-semibold leading-[1.4] text-title">
                  {f.name}
                </span>
                <span dir="auto" className="shrink-0 text-[10px] leading-[1.5] text-faint">
                  {f.era}
                </span>
              </span>
              <span dir="auto" className="text-[11px] font-medium leading-[1.5] text-accent">
                {f.work}
              </span>
              {/* Only the Father in question gets his paragraph — three at
                  once would not fit the panel and would not be read. */}
              <span
                dir="auto"
                className={cn(
                  "overflow-hidden text-[12px] leading-[1.6] text-muted transition-all duration-[800ms] ease-out",
                  active || lit < 0 ? "max-h-[120px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                {f.text}
              </span>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

/* State 5 — the word comes apart. */
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
              "flex items-baseline justify-between gap-3 border-b border-gray-100 py-2 transition-all duration-[700ms] ease-out last:border-0 motion-reduce:transform-none",
              on ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
            )}
            style={stagger(on, i, 140, 70)}
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

/* State 6 — what the word carries with it. */
function Notes({ ui, rest, on }: { ui: UI; rest: boolean; on: boolean }) {
  return (
    <Panel title={ui.notesLabel} on={on} rest={rest}>
      <p
        dir="auto"
        className={cn(
          "text-[12px] leading-[1.7] text-muted transition-all duration-[800ms] ease-out motion-reduce:transform-none",
          on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        )}
        style={stagger(on, 0, 120, 0)}
      >
        {ui.note}
      </p>

      <div className="flex flex-col gap-2 rounded-[12px] bg-accent-soft/70 p-3">
        <span
          dir="auto"
          className="text-[10px] uppercase leading-[1.4] tracking-[0.1em] text-accent"
        >
          {ui.conceptsLabel}
        </span>
        <span className="flex flex-wrap gap-1.5">
          {ui.concepts.map((c, i) => (
            <span
              key={c}
              dir="auto"
              className={cn(
                "rounded-full border border-accent-line bg-surface px-2.5 py-1 text-[11px] leading-[1.4] text-accent transition-all duration-[700ms] ease-out motion-reduce:transform-none",
                on ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
              )}
              style={stagger(on, i, 280, 90)}
            >
              {c}
            </span>
          ))}
        </span>
      </div>
    </Panel>
  );
}

/* ===============================================================
   STATE 4 — THE KNOWLEDGE GRAPH

   Lines are SVG so they can draw themselves; the nodes are HTML so
   the labels are real type in either script. Both are positioned in
   percentages off the same table, so they cannot drift apart.
   =============================================================== */
const GRAPH_NODES = [
  { x: 50, y: 50, kind: "concept" },
  { x: 16, y: 26, kind: "passage" },
  { x: 50, y: 13, kind: "concept" },
  { x: 85, y: 31, kind: "father" },
  { x: 17, y: 79, kind: "father" },
  { x: 80, y: 83, kind: "source" },
] as const;

const GRAPH_EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [2, 3],
  [3, 5],
  [4, 1],
];

function Graph({ ui, rest, on }: { ui: UI; rest: boolean; on: boolean }) {
  const scope = useRef<HTMLElement>(null);
  useGraphDraw(scope, on);

  return (
    <section
      ref={scope}
      aria-hidden={!on}
      className={cn(
        "flex flex-col gap-3 rounded-[16px] border border-line bg-surface p-4 transition-all duration-[900ms] ease-out",
        rest
          ? "mt-3 min-h-[340px]"
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
        {/* No viewBox: percentage coordinates resolve against the rendered
            box, so the lines stay hairlines at every size instead of
            scaling with a viewBox. pathLength normalises every edge to 1,
            so one dash offset draws them all at the same rate whatever
            their length. They ship drawn, and the script retracts them
            before it draws them again — a reader with no script gets the
            finished graph rather than an empty box. */}
        <svg aria-hidden className="absolute inset-0 h-full w-full overflow-visible">
          {GRAPH_EDGES.map(([a, b], i) => (
            <line
              key={i}
              data-j-edge
              x1={`${GRAPH_NODES[a].x}%`}
              y1={`${GRAPH_NODES[a].y}%`}
              x2={`${GRAPH_NODES[b].x}%`}
              y2={`${GRAPH_NODES[b].y}%`}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={0}
              strokeWidth={1}
              className="stroke-primary-300"
            />
          ))}
        </svg>

        {/* A zero-width anchor sits on the point and centres the chip over
            it. A -50% translate would have to know the writing direction;
            a flex centre does not, so the chips land on their nodes in
            both scripts. */}
        {GRAPH_NODES.map((n, i) => (
          <span
            key={ui.nodes[i]}
            className="absolute flex w-0 -translate-y-1/2 justify-center"
            style={{ insetInlineStart: `${n.x}%`, top: `${n.y}%` }}
          >
            <span
              dir="auto"
              className={cn(
                "flex cursor-default items-center gap-2 whitespace-nowrap rounded-full border bg-surface px-3 py-1.5 text-[12px] leading-[1.4] transition-all duration-[600ms] ease-out hover:shadow-lift motion-reduce:transform-none",
                n.kind === "concept"
                  ? "border-accent-line bg-accent-soft font-medium text-accent"
                  : "border-line text-gray-700",
                on ? "scale-100 opacity-100" : "scale-90 opacity-0"
              )}
              style={stagger(on, i, 100, 70)}
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
