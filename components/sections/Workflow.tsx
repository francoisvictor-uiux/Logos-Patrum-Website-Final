import { Section, SectionHeading, Card, CardText } from "../ui";
import type { Dict } from "@/lib/i18n";

/* Figma "How It Works": a media well over a title/description pair,
   framed by the card's 12px inset. */
export default function Workflow({ dict }: { dict: Dict }) {
  const t = dict.workflow;
  return (
    <Section id="workflow">
      <SectionHeading eyebrow={t.eyebrow} title={t.title} description={t.description} />

      <ol className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3" data-reveal-group>
        {t.steps.map((step, i) => (
          <Card
            key={step.title}
            as="li"
            className="flex flex-col gap-6 px-3 pb-6 pt-3"
            data-reveal-item
          >
            <div className="dm-media grid h-[168px] place-items-center bg-navy-950">
              <span
                aria-hidden
                className="font-display text-[64px] leading-none text-white/25"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <CardText title={step.title} desc={step.desc} className="px-3" />
          </Card>
        ))}
      </ol>
    </Section>
  );
}
