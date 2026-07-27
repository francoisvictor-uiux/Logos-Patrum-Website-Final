import { Section, SectionHeading, Card, CardText } from "../ui";
import { Icon, type IconName } from "../icons";
import type { Dict } from "@/lib/i18n";

export default function Security({ dict }: { dict: Dict }) {
  const t = dict.security;
  return (
    <Section id="security">
      <SectionHeading eyebrow={t.eyebrow} title={t.title} description={t.description} />

      <div className="grid w-full gap-4 sm:grid-cols-2" data-reveal-group>
        {t.items.map((item) => (
          <Card key={item.title} as="article" className="flex gap-4 p-6" data-reveal-item>
            <span className="grid size-10 shrink-0 place-items-center rounded-pill bg-chip text-ink">
              <Icon name={item.icon as IconName} className="size-5" />
            </span>
            <CardText title={item.title} desc={item.desc} />
          </Card>
        ))}
      </div>

      <p
        className="text-center font-display text-[28px] leading-tight tracking-[0.01em] text-ink sm:text-[34px]"
        data-reveal
      >
        {t.tagline}
      </p>
    </Section>
  );
}
