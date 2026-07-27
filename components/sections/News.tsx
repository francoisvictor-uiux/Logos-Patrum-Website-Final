import { Section, SectionHeading, Card, CardText, Button } from "../ui";
import type { Dict } from "@/lib/i18n";

export default function News({ dict }: { dict: Dict }) {
  const t = dict.news;
  return (
    <Section id="news">
      <SectionHeading eyebrow={t.eyebrow} title={t.title} />

      <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4" data-reveal-group>
        {t.items.map((item) => (
          <Card key={item.title} as="article" className="flex flex-col gap-5 p-6" data-reveal-item>
            <div className="flex items-center justify-between gap-2">
              <span className="dm-chip px-3 py-1.5 text-eyebrow text-muted">{item.tag}</span>
              <time className="text-eyebrow text-muted-2">{item.date}</time>
            </div>
            <CardText title={item.title} desc={item.desc} />
          </Card>
        ))}
      </div>

      <Button href="#" variant="subtle" data-reveal>
        {t.viewAll}
      </Button>
    </Section>
  );
}
