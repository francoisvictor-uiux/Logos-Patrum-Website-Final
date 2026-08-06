import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------
   TwoTone — the comp's signature heading treatment.

   In Figma a heading runs in muted grey with one clause lifted to
   full contrast ("From *prompt to finished* visual in three steps").
   Which clause is emphasised differs per heading and per language,
   so it is authored in the dictionary with *asterisks* rather than
   guessed from the string.

   A title with no markers renders entirely in ink.
   --------------------------------------------------------------- */
export function TwoTone({ text }: { text: string }) {
  const parts = text.split("*");
  if (parts.length < 3) return <>{text}</>;
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="text-ink">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

/* ---------------------------------------------------------------
   Chip — eyebrow pill: 8px dot + 14px muted label
   Figma: rounded-40, bg rgba(255,255,255,.05), px-16 py-8, gap-8
   --------------------------------------------------------------- */
export function Chip({ children, dot = true }: { children: ReactNode; dot?: boolean }) {
  return (
    <span className="dm-chip inline-flex items-center gap-2 px-4 py-2 text-eyebrow text-muted">
      {dot ? (
        <span aria-hidden className="size-2 rounded-full bg-navy-500/70" />
      ) : null}
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------
   LiveDot — the hero's orange point with a soft ping halo. The one
   piece of colour every section is allowed: it marks what is alive.
   --------------------------------------------------------------- */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex size-[8px] shrink-0", className)} aria-hidden>
      <span className="absolute inline-flex h-full w-full animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-live-halo opacity-75" />
      <span className="relative inline-flex size-[8px] rounded-full bg-live" />
    </span>
  );
}

/* ---------------------------------------------------------------
   SectionBadge — THE section label. Use this at the top of every
   section from here on; it is the hero's badge carried forward
   whole, so the page opens on one object rather than a new pill
   per section.

   Geometry (do not re-derive it per section): 36px tall pill,
   1px hairline, 100px radius, 17/4 padding, 8px gap, 10px live
   point, label 16px / 600 / 0.08em. Arabic zeroes the tracking
   via the tracking-* rule in globals.css.

   tone="light"  on white or grey — grey chip on a grey hairline
   tone="dark"   on a primary-blue section — the same pill glazed
                 into the field: a white wash at 10%, a 25% white
                 hairline, primary-100 type (11.9:1 on primary-500).
                 The live point stays orange in both; it is the one
                 fixed signal on the page.
   --------------------------------------------------------------- */
export function SectionBadge({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "flex min-h-[36px] items-center gap-[8px] rounded-[100px] border px-[17px] py-[4px]",
        tone === "dark"
          ? "border-white/25 bg-white/10 backdrop-blur-[2px]"
          : "border-line-strong bg-chip"
      )}
    >
      <LiveDot className="size-[10px] [&>span]:size-[10px]" />
      <p
        dir="auto"
        className={cn(
          "text-balance text-center font-sans text-[16px] font-semibold leading-[24px] tracking-[0.08em]",
          tone === "dark" ? "text-primary-100" : "text-muted-2"
        )}
        style={{ fontFeatureSettings: '"swsh"' }}
      >
        {children}
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------
   Eyebrow — design-guide label: 14px / 600 / 0.12em / primary-500,
   led by the live dot. The bare-label variant, for sections that
   already carry a badge elsewhere; SectionBadge is the default.
   --------------------------------------------------------------- */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      dir="auto"
      className="flex items-center gap-[10px] text-[14px] font-semibold uppercase leading-none tracking-[0.12em] text-navy-500"
    >
      <LiveDot />
      {children}
    </p>
  );
}

/* ---------------------------------------------------------------
   Button — Figma pill, 16px medium, px-16 py-10, radius 100
   primary : inverted (dark on light) — the comp's white-on-dark
   subtle  : chip fill
   outline : hairline border
   --------------------------------------------------------------- */
const BUTTON_VARIANTS = {
  primary: "bg-ink text-on-dark hover:bg-ink/85",
  subtle: "bg-chip text-ink hover:bg-chip-hover",
  outline: "border border-line-strong text-ink hover:bg-chip",
} as const;

export function Button({
  href,
  children,
  variant = "primary",
  className,
  type,
  ...rest
}: {
  href?: string;
  children: ReactNode;
  variant?: keyof typeof BUTTON_VARIANTS;
  className?: string;
  type?: "button" | "submit";
} & React.HTMLAttributes<HTMLElement>) {
  /* Typography system: buttons 52px tall, 24px padding, radius 12,
     16px / 600. Height comes before any className override. */
  const classes = cn(
    "inline-flex h-[52px] items-center justify-center gap-2 rounded-[12px] px-[24px] text-[16px] font-semibold leading-none transition-colors duration-200",
    BUTTON_VARIANTS[variant],
    className
  );
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type={type ?? "button"} className={classes} {...rest}>
      {children}
    </button>
  );
}

/* ---------------------------------------------------------------
   Section — Figma section shell: py-96, px-24, gap-40, 1080 content
   --------------------------------------------------------------- */
export function Section({
  id,
  children,
  className,
  contentClassName,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    /* Spacing system: section padding 96 → 128 → 160, container padding
       20 mobile / 32 desktop, heading-to-content 96 on desktop. */
    <section
      id={id}
      className={cn("px-5 py-[96px] md:py-[128px] lg:px-8 lg:py-[160px]", className)}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-[1080px] flex-col items-center gap-[56px] lg:gap-[96px]",
          contentClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------
   SectionHeading — chip + two-tone serif h2, centred
   Figma: heading block gap-12, h2 42px/1.1, tracking +0.01em
   (max width widened from the comp's 420px: Logos Patrum headings
   run longer than the template's, and 420px broke them to 5 lines)
   --------------------------------------------------------------- */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "start";
  as?: "h1" | "h2";
}) {
  const centered = align === "center";
  return (
    /* Design-guide ladder: eyebrow —16px— heading —24px— description. */
    <div
      data-reveal
      className={cn(
        "flex max-w-[760px] flex-col gap-[16px]",
        centered ? "items-center text-center" : "items-start text-start"
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Tag
        className="text-balance font-display text-[32px] font-bold leading-[1.12] text-muted sm:text-[40px] lg:text-[48px]"
        style={{ fontFeatureSettings: '"swsh"' }}
      >
        <TwoTone text={title} />
      </Tag>
      {description ? (
        <p className="mt-[8px] max-w-[720px] text-[18px] font-normal leading-[1.7] text-muted sm:text-[20px]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

/* ---------------------------------------------------------------
   Card — Figma: radius 40, 1px hairline, faint fill
   --------------------------------------------------------------- */
export function Card({
  children,
  className,
  as: Tag = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag className={cn("dm-card", className)} {...rest}>
      {children}
    </Tag>
  );
}

/* ---------------------------------------------------------------
   CardText — the comp's 20px title / 16px muted body pairing
   --------------------------------------------------------------- */
export function CardText({
  title,
  desc,
  className,
}: {
  title: string;
  desc?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {/* Typography system: card title 24/600 (24px via the token). */}
      <h3 className="text-card-title font-semibold text-ink">{title}</h3>
      {desc ? <p className="text-body text-muted">{desc}</p> : null}
    </div>
  );
}
