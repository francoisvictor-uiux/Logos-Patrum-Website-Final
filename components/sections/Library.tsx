"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Card, Eyebrow, TwoTone } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Dict, Locale } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Lib = Dict["library"];
type Ring = Lib["rings"][number];
type Item = Ring["items"][number];

/* ---------------------------------------------------------------
   Geometry and motion live here; every word lives in the dictionary.

   Three rings, ordered inside out. `r` names the radius token the
   stage sets per breakpoint, `phase` offsets the first capsule so
   the rings never line their items up on one spoke, and the
   direction alternates so neighbouring rings shear past each other
   rather than travelling as one wheel.
   --------------------------------------------------------------- */
const RINGS = [
  { r: "var(--r1)", dur: 18, dir: "cw", phase: 0, drift: 2 },
  { r: "var(--r2)", dur: 24, dir: "ccw", phase: 26, drift: -3 },
  { r: "var(--r3)", dur: 36, dir: "cw", phase: -13, drift: 4 },
] as const;

/* ---------------------------------------------------------------
   The size tokens the whole visualisation is built from: the three
   radii, the mark's diameter, and the capsule's height, padding and
   type size. Everything else is derived from these, so the
   composition rescales from one place.

   The radii are not a taste decision. A capsule near 3 or 9 o'clock
   extends along the radius, so two rings collide unless the gap
   between them exceeds the two widest half-capsules that can meet
   there. Each tier below is sized against the measured widths at
   that tier's type size — which is also why the type does not scale
   uniformly with the orbit: a 15px label reduced with the ring
   would land at 7px on a phone.
   --------------------------------------------------------------- */
const SIZES = cn(
  "[--r1:100px] [--r2:200px] [--r3:320px] [--core:88px] [--cap-h:30px] [--cap-px:12px] [--cap-t:12px]",
  "lg:[--r1:135px] lg:[--r2:265px] lg:[--r3:415px] lg:[--core:144px] lg:[--cap-h:36px] lg:[--cap-px:16px] lg:[--cap-t:13px]",
  "xl:[--r1:162px] xl:[--r2:295px] xl:[--r3:468px] xl:[--core:192px] xl:[--cap-h:44px] xl:[--cap-px:20px] xl:[--cap-t:15px]"
);

/**
 * Section 04 — the research library.
 *
 * The workspace above shows one reader working one passage. This shows what
 * that passage sits inside: an interconnected corpus, turning slowly around
 * its own centre. Three rings — the languages a text is written in, the kinds
 * of source it survives in, and the Fathers who wrote it — orbit the mark.
 *
 * Continuous rotation is CSS, so it costs nothing and survives a script that
 * never loads. GSAP owns the entrance only: the words, the centre, the three
 * rings drawing themselves in, and the counters underneath.
 *
 * Below 640px there is no orbit. Three concentric rings of capsules a reader
 * can actually read do not fit across a phone — not tightly, at all — so the
 * same three groups are stacked instead. It is the one arrangement of this
 * content that stays legible at that width, and it says the same thing.
 */
export default function Library({ dict, locale }: { dict: Dict; locale: Locale }) {
  const t = dict.library;
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const nf = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US");

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* Entrance — the ladder the section is read in: eyebrow, headline,
           sentence, then the centre, then the rings from the inside out, then
           the numbers. 0.8s each, 100ms apart. */
        gsap
          .timeline({
            defaults: { ease: "power3.out", duration: 0.8 },
            scrollTrigger: { trigger: root.current, start: "top 72%" },
          })
          .from(q("[data-l-eyebrow]"), { autoAlpha: 0, y: 32 })
          .from(q("[data-l-title]"), { autoAlpha: 0, y: 32 }, "<0.1")
          .from(q("[data-l-desc]"), { autoAlpha: 0, y: 32 }, "<0.1")
          .from(q("[data-l-center]"), { autoAlpha: 0, scale: 0.84 }, "<0.1")
          /* The rings arrive as a whole and draw themselves at the same
             moment — pathLength normalises every circle to 1, so one dash
             offset draws all three at the same rate. */
          .from(q("[data-l-ring]"), { autoAlpha: 0, scale: 0.94, stagger: 0.1 }, "<0.1")
          .from(q("[data-l-track]"), { strokeDashoffset: 1, duration: 1.2, stagger: 0.1 }, "<")
          .from(q("[data-l-group]"), { autoAlpha: 0, y: 24, stagger: 0.1 }, "<0.1")
          .from(q("[data-l-stat]"), { autoAlpha: 0, y: 24, stagger: 0.1 }, "<0.4");

        /* The counters. Their own trigger, not the timeline's: the cards sit a
           screen below the rings and should not have finished counting before
           the reader has reached them. */
        q("[data-count]").forEach((el) => {
          const target = Number((el as HTMLElement).dataset.count);
          const state = { value: 0 };
          gsap.to(state, {
            value: target,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => {
              el.textContent = nf.format(Math.round(state.value));
            },
          });
        });

        /* Mouse. The centre leans into the pointer by no more than 6px and
           each ring drifts a couple of pixels of its own, so the composition
           has depth without becoming a parallax toy. Fine pointers only —
           which is also the only place the orbit exists. */
        const el = stage.current;
        if (!el || window.matchMedia("(pointer: coarse)").matches) return;

        const ease = { duration: 0.9, ease: "power3.out" } as const;
        const core = el.querySelector("[data-l-center]");
        const rings = [...el.querySelectorAll("[data-l-ring]")];
        const coreX = gsap.quickTo(core, "x", ease);
        const coreY = gsap.quickTo(core, "y", ease);
        const ringX = rings.map((n) => gsap.quickTo(n, "x", ease));
        const ringY = rings.map((n) => gsap.quickTo(n, "y", ease));

        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const x = gsap.utils.clamp(-1, 1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2));
          const y = gsap.utils.clamp(-1, 1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2));
          coreX(x * 6);
          coreY(y * 6);
          ringX.forEach((to, i) => to(x * RINGS[i].drift));
          ringY.forEach((to, i) => to(y * RINGS[i].drift));
        };
        const onLeave = () => {
          coreX(0);
          coreY(0);
          ringX.forEach((to) => to(0));
          ringY.forEach((to) => to(0));
        };

        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
        };
      });
    },
    { scope: root }
  );

  return (
    <section
      id="library"
      ref={root}
      /* Pure white against the page's gray-50 — the library is the one lit
         room on this stretch of the page. overflow-x-clip lets the outermost
         capsules run into the gutter without opening a scrollbar. */
      className="relative isolate overflow-x-clip bg-surface px-5 py-[96px] md:py-[128px] lg:px-8 lg:py-[160px]"
    >
      {/* The spotlight. One soft radial wash behind the rings and nothing
          else — no gradient on the field, no glass, no colour. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(58% 42% at 50% 56%, color-mix(in srgb, var(--color-primary-500) 7%, transparent) 0%, transparent 72%)",
        }}
      />

      <div className={cn("mx-auto flex w-full max-w-[1280px] flex-col items-center", SIZES)}>
        <div data-l-eyebrow className="mb-[16px]">
          <Eyebrow>{t.eyebrow}</Eyebrow>
        </div>

        <h2
          data-l-title
          dir="auto"
          className="max-w-[760px] text-balance text-center font-display text-[32px] font-bold leading-[1.12] text-muted sm:text-[40px] lg:text-[48px]"
          style={{ fontFeatureSettings: '"swsh"' }}
        >
          <TwoTone text={t.title} />
        </h2>

        <p
          data-l-desc
          dir="auto"
          className="mt-[24px] mb-[56px] max-w-[720px] text-center text-[18px] font-normal leading-[1.7] text-muted sm:text-[20px] lg:mb-[96px]"
        >
          {t.description}
        </p>

        {/* The orbit. Tall enough for the outer ring plus the capsule that
            straddles its top and bottom points. */}
        <div
          ref={stage}
          className="relative hidden w-full md:block"
          style={{ height: "calc(var(--r3) * 2 + var(--cap-h))" }}
        >
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <CenterNode mark={t.center.mark} name={t.center.name} />
          </div>

          {t.rings.map((ring, i) => (
            <OrbitRing key={ring.label} ring={ring} geometry={RINGS[i]} />
          ))}
        </div>

        <LibraryStack center={t.center} rings={t.rings} />

        <ol className="mt-[56px] grid w-full max-w-[900px] grid-cols-2 gap-4 lg:mt-[96px] lg:grid-cols-4">
          {t.stats.map((s) => (
            <Card
              as="li"
              key={s.label}
              data-l-stat
              className="flex flex-col items-center gap-[6px] p-6 text-center"
            >
              <span className="font-display text-[34px] font-bold leading-none text-ink lg:text-[40px]">
                <span data-count={s.value}>{nf.format(s.value)}</span>
                <span className="text-muted-2">{s.suffix}</span>
              </span>
              <span dir="auto" className="text-eyebrow text-muted">
                {s.label}
              </span>
            </Card>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ===============================================================
   CENTER NODE — the mark the whole library turns around.
   =============================================================== */
function CenterNode({ mark, name }: { mark: string; name: string }) {
  return (
    <div
      data-l-center
      className="relative grid shrink-0 place-items-center rounded-full bg-primary-500 shadow-[0_24px_70px_color-mix(in_srgb,var(--color-primary-900)_28%,transparent)] ring-1 ring-inset ring-white/15"
      style={{ width: "var(--core)", height: "var(--core)" }}
    >
      {/* The glow. Held under 8% so it reads as light on white rather than as
          a second object. */}
      <span
        aria-hidden
        className="absolute -inset-1/3 -z-10 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--color-primary-500) 8%, transparent), transparent)",
        }}
      />
      <span
        aria-hidden
        className="font-display font-bold leading-none tracking-[0.04em] text-white"
        style={{ fontSize: "calc(var(--core) * 0.3)" }}
      >
        {mark}
      </span>
      <span className="sr-only">{name}</span>
    </div>
  );
}

/* ===============================================================
   ORBIT RING — one drawn circle, with its capsules spaced evenly
   around it.

   The ring is positioned off its own radius rather than with a
   translate utility: GSAP zeroes an element's `translate` property
   the moment it animates it, which would drop a centred ring into
   the corner of the stage.
   =============================================================== */
function OrbitRing({ ring, geometry }: { ring: Ring; geometry: (typeof RINGS)[number] }) {
  const { r, dur, dir, phase } = geometry;
  const step = 360 / ring.items.length;

  return (
    <div
      data-l-ring
      /* Transparent to the pointer, so hovering the ring's empty middle never
         stops it — only a capsule does. */
      className="lp-ring pointer-events-none absolute"
      style={{
        insetInlineStart: `calc(50% - ${r})`,
        top: `calc(50% - ${r})`,
        width: `calc(${r} * 2)`,
        height: `calc(${r} * 2)`,
      }}
    >
      {/* No viewBox: percentages resolve against the rendered box, so the
          hairline stays a hairline at every size. overflow-visible keeps the
          stroke from being clipped in half by its own circle. */}
      <svg aria-hidden className="absolute inset-0 h-full w-full overflow-visible">
        <circle
          data-l-track
          cx="50%"
          cy="50%"
          r="50%"
          fill="none"
          strokeWidth={1}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={0}
          className="origin-center -rotate-90 stroke-line"
        />
      </svg>

      <ul aria-label={ring.label} className="absolute inset-0">
        {ring.items.map((item, i) => (
          <OrbitCapsule key={item.title} item={item} angle={phase + i * step} dur={dur} dir={dir} />
        ))}
      </ul>
    </div>
  );
}

/* ===============================================================
   ORBIT CAPSULE — an arm from the ring's centre to its edge, with
   the capsule counter-rotating at the far end so the label stays
   upright the whole way round.
   =============================================================== */
function OrbitCapsule({
  item,
  angle,
  dur,
  dir,
}: {
  item: Item;
  angle: number;
  dur: number;
  dir: "cw" | "ccw";
}) {
  return (
    <li
      /* Zero width, so `items-center` centres the capsule on the arm without
         a translate that would have to know the writing direction. */
      className="lp-spin absolute top-0 left-1/2 flex h-1/2 w-0 origin-bottom flex-col items-center"
      style={
        {
          "--a": `${angle}deg`,
          "--dur": `${dur}s`,
          "--spin": `lp-orbit-${dir}`,
          transform: "rotate(var(--a))",
        } as React.CSSProperties
      }
    >
      <div
        /* Inherits --a and --dur from the arm and cancels its rotation. The
           negative margin lifts the capsule so its middle sits on the ring
           line rather than hanging off it. */
        className="lp-spin group/cap pointer-events-auto relative"
        style={
          {
            "--spin": `lp-counter-${dir}`,
            transform: "rotate(calc(-1 * var(--a)))",
            marginTop: "calc(var(--cap-h) / -2)",
          } as React.CSSProperties
        }
      >
        <Capsule item={item} orbiting />
        <TooltipCard item={item} />
      </div>
    </li>
  );
}

/* ===============================================================
   CAPSULE — the one object this section is made of. Same pill in
   the orbit and in the stack; only the hover belongs to the orbit,
   where there is a card behind it to open.
   =============================================================== */
function Capsule({ item, orbiting = false }: { item: Item; orbiting?: boolean }) {
  const shortened = item.short !== item.title;

  return (
    <span
      dir="auto"
      className={cn(
        "flex items-center justify-center whitespace-nowrap rounded-full",
        "border border-line bg-surface font-medium leading-none text-gray-800",
        "shadow-[0_1px_2px_color-mix(in_srgb,var(--color-primary-900)_5%,transparent)]",
        orbiting && [
          /* Individual transform properties, so the lift and the scale
             compose with the arm's rotation instead of fighting it. */
          "transition-[translate,scale,border-color,box-shadow] duration-[250ms] ease-out",
          "group-hover/cap:-translate-y-1 group-hover/cap:scale-[1.04]",
          "group-hover/cap:border-accent group-hover/cap:shadow-lift",
          "motion-reduce:transition-none",
        ]
      )}
      style={{
        height: "var(--cap-h)",
        paddingInline: "var(--cap-px)",
        fontSize: "var(--cap-t)",
      }}
    >
      {shortened && orbiting ? (
        <>
          {/* At the smallest orbit the ring is two thirds of its full radius,
              so the long names are shortened rather than shrunk. The full name
              is what assistive technology reads at every width. */}
          <span aria-hidden className="lg:hidden">
            {item.short}
          </span>
          <span className="hidden lg:inline">{item.title}</span>
          <span className="sr-only lg:hidden">{item.title}</span>
        </>
      ) : (
        item.title
      )}
    </span>
  );
}

/* ===============================================================
   TOOLTIP CARD — what the capsule stands for, on hover. Decoration
   for the eye only: it is hidden from assistive technology, whose
   reading of the ring is the list of names.
   =============================================================== */
function TooltipCard({ item }: { item: Item }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-full left-1/2 z-30 mt-3 w-[220px] -translate-x-1/2",
        "rounded-[20px] border border-line bg-surface p-4 text-start",
        "shadow-[0_24px_60px_color-mix(in_srgb,var(--color-primary-900)_16%,transparent)]",
        "opacity-0 transition-opacity duration-200 ease-out group-hover/cap:opacity-100"
      )}
    >
      <p dir="auto" className="text-[15px] font-semibold leading-[1.3] text-ink">
        {item.title}
      </p>
      <p dir="auto" className="mt-[2px] text-[12px] leading-[1.5] text-muted-2">
        {item.meta}
      </p>
      <dl className="mt-3 flex flex-col gap-[6px] border-t border-line pt-3">
        {item.stats.map((s) => (
          <div key={s.k} className="flex items-baseline justify-between gap-3">
            <dt dir="auto" className="text-[12px] leading-[1.5] text-muted-2">
              {s.k}
            </dt>
            <dd dir="auto" className="text-[13px] font-medium leading-[1.5] text-ink">
              {s.v}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ===============================================================
   THE STACK — the same library on a phone, where the orbit cannot
   go. The mark, then the three groups under their own names, each
   a wrapped row of the same capsules. Nothing turns; nothing needs
   to be hovered to be read.
   =============================================================== */
function LibraryStack({ center, rings }: { center: Lib["center"]; rings: Lib["rings"] }) {
  return (
    <div className="flex w-full flex-col items-center gap-[40px] [--cap-h:34px] [--cap-px:16px] [--cap-t:13px] [--core:96px] md:hidden">
      <CenterNode mark={center.mark} name={center.name} />

      {rings.map((ring) => (
        <section
          key={ring.label}
          data-l-group
          className="flex w-full flex-col items-center gap-[14px]"
        >
          <h3
            dir="auto"
            className="text-[11px] font-semibold uppercase leading-none tracking-[0.12em] text-muted-2"
          >
            {ring.label}
          </h3>
          <ul className="flex flex-wrap justify-center gap-[8px]">
            {ring.items.map((item) => (
              <li key={item.title}>
                <Capsule item={item} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
