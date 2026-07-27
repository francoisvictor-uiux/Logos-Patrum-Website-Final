import { Section, SectionHeading, Card, CardText } from "../ui";
import { Icon, type IconName } from "../icons";
import type { Dict } from "@/lib/i18n";

/* Figma "Benefits": a plain three-column grid of hairline cards. */
export default function Features({ dict }: { dict: Dict }) {
  const t = dict.features;
  return (
    <Section id="features">
      <SectionHeading eyebrow={t.eyebrow} title={t.title} description={t.description} />

      <ul className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3" data-reveal-group>
        {t.items.map((item) => (
          <Card key={item.title} as="li" className="flex flex-col gap-4 p-6" data-reveal-item>
            <span className="grid size-9 place-items-center rounded-pill bg-chip text-ink">
              <Icon name={item.icon as IconName} className="size-[18px]" />
            </span>
            <CardText title={item.title} desc={item.desc} />
          </Card>
        ))}
      </ul>
    </Section>
  );
}
