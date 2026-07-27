import { Section, SectionHeading, Card, Button } from "../ui";
import type { Dict } from "@/lib/i18n";

const STATUS_STYLE = [
  "bg-success/10 text-success",
  "bg-success/10 text-success",
  "bg-bronze-500/15 text-bronze-800",
  "bg-chip text-muted",
];

export default function Story({ dict }: { dict: Dict }) {
  const t = dict.story;
  return (
    <Section id="story">
      <SectionHeading eyebrow={t.eyebrow} title={t.title} />

      {/* Figma split card: copy on one side, a full-bleed panel on the other */}
      <Card className="grid w-full overflow-clip lg:grid-cols-[0.9fr_1fr]">
        {/* Manuscript panel */}
        <figure className="relative flex flex-col justify-center gap-6 bg-navy-950 px-8 py-12">
          <span aria-hidden className="meander w-24 opacity-60" />
          <p lang="hy" dir="ltr" className="font-greek text-[27px] leading-[1.6] text-white/90">
            Ի սկզբանէ էր Բանն, եւ Բանն էր առ Աստուած, եւ Աստուած էր Բանն։
          </p>
          <figcaption dir="ltr" className="text-eyebrow text-white/45">
            Ⲡⲁⲗⲁⲛϫⲓⲁⲛ · Armenian codex, fol. 3r
          </figcaption>
          <span className="absolute end-8 top-8 rounded-pill bg-white/10 px-3 py-1 text-eyebrow text-bronze-300">
            27
          </span>
        </figure>

        {/* Copy */}
        <div className="flex flex-col gap-6 px-8 py-10" data-reveal>
          <div className="flex flex-col gap-3">
            {t.body.map((p, i) => (
              <p key={i} className="text-body text-muted">
                {p}
              </p>
            ))}
          </div>

          <ul className="flex flex-col">
            {t.traditions.map((tr, i) => (
              <li
                key={tr.name}
                className="flex items-center justify-between gap-3 border-b border-line py-3 last:border-b-0"
              >
                <span className="text-body text-ink">{tr.name}</span>
                <span
                  className={`shrink-0 rounded-pill px-2.5 py-1 text-eyebrow ${
                    STATUS_STYLE[i] ?? STATUS_STYLE[3]
                  }`}
                >
                  {tr.status}
                </span>
              </li>
            ))}
          </ul>

          <Button href="#features" className="self-start">
            {t.cta}
          </Button>
        </div>
      </Card>
    </Section>
  );
}
