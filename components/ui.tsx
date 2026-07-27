import type { ReactNode } from "react";

/* ---------------------------------------------------------------
   cn — tiny class joiner
   --------------------------------------------------------------- */
type ClassArg = string | false | null | undefined | Record<string, boolean>;

export function cn(...args: ClassArg[]) {
  const out: string[] = [];
  for (const a of args) {
    if (!a) continue;
    if (typeof a === "string") out.push(a);
    else for (const k in a) if (a[k]) out.push(k);
  }
  return out.join(" ");
}

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
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-pill px-4 py-2.5 text-body font-medium leading-none transition-colors duration-200",
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
    <section id={id} className={cn("px-6 py-16 sm:py-24", className)}>
      <div
        className={cn(
          "mx-auto flex w-full max-w-[1080px] flex-col items-center gap-10",
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
    <div
      data-reveal
      className={cn(
        "flex max-w-[680px] flex-col gap-3",
        centered ? "items-center text-center" : "items-start text-start"
      )}
    >
      {eyebrow ? <Chip>{eyebrow}</Chip> : null}
      <Tag className="text-balance font-display text-[2rem] leading-[1.12] tracking-[0.01em] text-muted sm:text-heading">
        <TwoTone text={title} />
      </Tag>
      {description ? (
        <p className="max-w-[560px] text-body text-muted">{description}</p>
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
      <h3 className="text-card-title text-ink">{title}</h3>
      {desc ? <p className="text-body text-muted">{desc}</p> : null}
    </div>
  );
}
