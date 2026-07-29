"use client";

import { useState } from "react";
import { Section, SectionHeading, Card, Button } from "../ui";
import { Icon } from "../icons";
import { cn } from "@/lib/utils";
import type { Dict } from "@/lib/i18n";

type Plan = {
  name: string;
  price: string;
  unit: string;
  desc: string;
  features: readonly string[];
  cta: string;
  featured: boolean;
};

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <Card as="article" className="flex flex-col gap-6 p-7" data-reveal-item>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-card-title text-ink">{plan.name}</h3>
        {plan.featured ? (
          <span className="dm-chip shrink-0 px-3 py-1.5 text-eyebrow text-muted">Popular</span>
        ) : null}
      </div>

      <p className="flex items-baseline gap-1">
        <span className="font-display text-[42px] leading-none tracking-[0.01em] text-ink">
          {plan.price}
        </span>
        {plan.unit ? <span className="text-eyebrow text-muted">{plan.unit}</span> : null}
      </p>

      <p className="text-body text-muted">{plan.desc}</p>

      <Button href="#" variant={plan.featured ? "primary" : "subtle"} className="w-full">
        {plan.cta}
      </Button>

      {/* Figma: a centred "Features" rule above the list */}
      <div className="flex items-center gap-3" aria-hidden>
        <span className="h-px flex-1 bg-line" />
        <span className="text-eyebrow text-muted">Features</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <ul className="flex flex-1 flex-col gap-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-body text-muted">
            <Icon name="check" className="mt-1 size-4 shrink-0 text-ink" />
            {f}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function Pricing({ dict }: { dict: Dict }) {
  const t = dict.pricing;
  const [group, setGroup] = useState<0 | 1>(0);
  const plans = group === 0 ? t.individuals : t.institutions;

  return (
    <Section id="pricing">
      <SectionHeading eyebrow={t.eyebrow} title={t.title} description={t.description} />

      {/* Audience switch — the comp's Monthly/Yearly toggle */}
      <div className="flex items-center gap-4" role="group" aria-label={t.eyebrow} data-reveal>
        <button
          type="button"
          aria-pressed={group === 0}
          onClick={() => setGroup(0)}
          className={cn("text-body transition-colors", group === 0 ? "text-ink" : "text-muted")}
        >
          {t.groups[0]}
        </button>
        <button
          type="button"
          role="switch"
          aria-checked={group === 1}
          aria-label={t.groups[1]}
          onClick={() => setGroup(group === 0 ? 1 : 0)}
          className={cn(
            "relative h-7 w-12 shrink-0 rounded-pill transition-colors duration-300",
            group === 1 ? "bg-ink" : "bg-line-strong"
          )}
        >
          <span
            aria-hidden
            className={cn(
              "absolute top-1 size-5 rounded-full bg-surface transition-all duration-300",
              group === 1 ? "start-6" : "start-1"
            )}
          />
        </button>
        <button
          type="button"
          aria-pressed={group === 1}
          onClick={() => setGroup(1)}
          className={cn("text-body transition-colors", group === 1 ? "text-ink" : "text-muted")}
        >
          {t.groups[1]}
        </button>
      </div>

      <div className="grid w-full gap-4 lg:grid-cols-3" data-reveal-group>
        {plans.map((plan) => (
          <PlanCard key={plan.name} plan={plan} />
        ))}
      </div>

      <p className="max-w-[680px] text-center text-body text-muted" data-reveal>
        {t.note}
      </p>
    </Section>
  );
}
