import { Section, SectionHeading, Card } from "../ui";
import type { Dict } from "@/lib/i18n";

export default function Partners({ dict }: { dict: Dict }) {
  const t = dict.partners;
  const blocks = [t.partners, t.sponsors];
  return (
    <Section id="partners">
      <SectionHeading eyebrow={t.eyebrow} title={t.title} />

      <div className="grid w-full gap-4 lg:grid-cols-2" data-reveal-group>
        {blocks.map((block) => (
          <Card key={block.title} className="flex flex-col gap-6 p-7" data-reveal-item>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-card-title text-ink">{block.title}</h3>
              <p className="text-body text-muted">{block.desc}</p>
            </div>
            <ul className="flex flex-col">
              {block.items.map((name) => (
                <li
                  key={name}
                  className="border-b border-line py-3 font-display text-[20px] leading-tight text-muted transition-colors last:border-b-0 hover:text-ink"
                >
                  {name}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </Section>
  );
}
