import { Section, SectionHeading, Card, CardText } from "../ui";
import type { Dict } from "@/lib/i18n";

const LETTERS = ["Α", "Β", "Γ"];

/* Figma "Introducing" bento: a 1/3 + 2/3 top row over a full-width tile. */
const SPANS = ["lg:col-span-1", "lg:col-span-2", "lg:col-span-3"];

export default function Pillars({ dict }: { dict: Dict }) {
  const t = dict.pillars;
  return (
    <Section id="pillars">
      <SectionHeading eyebrow={t.eyebrow} title={t.title} description={t.description} />

      <div className="grid w-full gap-4 lg:grid-cols-3" data-reveal-group>
        {t.cards.map((card, i) => (
          <Card
            key={card.title}
            as="article"
            className={`group relative flex flex-col justify-between gap-8 overflow-clip p-6 ${SPANS[i]}`}
          >
            <div data-reveal-item>
              <CardText title={card.title} desc={card.desc} />
            </div>
            <span
              aria-hidden
              className="pointer-events-none select-none self-end font-display text-[110px] leading-[0.7] text-ink/[0.06] transition-colors duration-500 group-hover:text-navy-500/15"
            >
              {LETTERS[i] ?? card.title.charAt(0)}
            </span>
          </Card>
        ))}
      </div>
    </Section>
  );
}
