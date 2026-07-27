import { Section, SectionHeading, Card, CardText } from "../ui";
import type { Dict } from "@/lib/i18n";

/* A static demonstration of the syntactic colouring the engine produces. */
const DEMO_TOKENS: { t: string; c: string }[] = [
  { t: "Αὐτὸς", c: "text-bronze-300" },
  { t: "γὰρ", c: "text-navy-300" },
  { t: "ἐνηνθρώπησεν", c: "text-teal-300" },
  { t: ",", c: "text-navy-400" },
  { t: "ἵνα", c: "text-navy-300" },
  { t: "ἡμεῖς", c: "text-bronze-300" },
  { t: "θεοποιηθῶμεν", c: "text-teal-300" },
];

const LEGEND = [
  { label: "Subject", dot: "bg-bronze-400" },
  { label: "Verb", dot: "bg-teal-300" },
  { label: "Particle", dot: "bg-navy-300" },
];

export default function Filters({ dict }: { dict: Dict }) {
  const t = dict.filters;
  return (
    <Section id="filters">
      <SectionHeading eyebrow={t.eyebrow} title={t.title} description={t.description} />

      {/* Media well — the comp opens each feature block with a visual */}
      <Card className="w-full overflow-clip p-3" data-reveal>
        <div className="dm-media flex flex-col gap-5 bg-navy-950 p-7 sm:p-9" dir="ltr">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-2 font-greek text-2xl leading-relaxed sm:text-[28px]">
            {DEMO_TOKENS.map((tok, i) => (
              <span key={i} className={tok.c} lang="grc">
                {tok.t}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-4 text-eyebrow text-white/60">
            {LEGEND.map((l) => (
              <span key={l.label} className="flex items-center gap-1.5">
                <span className={`size-2 rounded-full ${l.dot}`} aria-hidden />
                {l.label}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Eight filter tiles */}
      <ol className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3" data-reveal-group>
        {t.items.map((item, i) => (
          <Card key={item.title} as="li" className="flex flex-col gap-4 p-6" data-reveal-item>
            <span
              aria-hidden
              className="font-display text-[15px] leading-none text-muted-2"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <CardText title={item.title} desc={item.desc} />
          </Card>
        ))}
      </ol>

      <p className="max-w-[680px] text-center text-body text-muted" data-reveal>
        {t.more}
      </p>
    </Section>
  );
}
