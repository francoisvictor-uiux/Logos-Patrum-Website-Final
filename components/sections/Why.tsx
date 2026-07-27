import { Section, SectionHeading, Card } from "../ui";
import type { Dict } from "@/lib/i18n";

/* Figma "Use cases": one card split into a divided list (left) and a
   full-bleed panel (right). The panel carries the patristic quotation. */
export default function Why({ dict }: { dict: Dict }) {
  const t = dict.why;
  return (
    <Section id="why">
      <SectionHeading eyebrow={t.eyebrow} title={t.title} description={t.description} />

      <Card className="grid w-full overflow-clip lg:grid-cols-[1fr_0.9fr]">
        {/* Divided list */}
        <ul className="flex flex-col" data-reveal-group>
          {t.points.map((point) => (
            <li
              key={point.title}
              data-reveal-item
              className="flex flex-col gap-1.5 border-b border-line px-7 py-6 transition-colors last:border-b-0 hover:bg-chip"
            >
              <h3 className="text-card-title text-ink">{point.title}</h3>
              <p className="text-body text-muted">{point.desc}</p>
            </li>
          ))}
        </ul>

        {/* Quotation panel — the comp's image well */}
        <figure className="relative flex flex-col justify-center gap-5 bg-navy-900 px-8 py-12">
          <span aria-hidden className="meander w-20 opacity-60" />
          <blockquote className="flex flex-col gap-4">
            <p lang="grc" dir="ltr" className="font-greek text-[27px] leading-[1.35] text-bronze-300">
              {t.quote.greek}
            </p>
            <p className="text-body text-white/75">{t.quote.text}</p>
          </blockquote>
          <figcaption className="text-eyebrow text-white/50">{t.quote.source}</figcaption>
        </figure>
      </Card>
    </Section>
  );
}
