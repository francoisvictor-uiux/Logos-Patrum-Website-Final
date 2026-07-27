"use client";

import { useRef } from "react";
import { Section, SectionHeading, Card } from "../ui";
import { Icon } from "../icons";
import type { Dict } from "@/lib/i18n";

/* Figma testimonials: a row of quote cards with a divider above the
   attribution and an "n/total" counter, plus round prev/next controls. */
export default function Testimonials({ dict }: { dict: Dict }) {
  const t = dict.testimonials;
  const rail = useRef<HTMLUListElement>(null);

  function scrollBy(direction: 1 | -1) {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.clientWidth + 16 : el.clientWidth;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  return (
    <Section id="testimonials">
      <SectionHeading eyebrow={t.eyebrow} title={t.title} />

      <ul
        ref={rail}
        className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        data-reveal-group
      >
        {t.items.map((item, i) => (
          <Card
            key={item.name}
            as="li"
            className="flex w-[85%] shrink-0 snap-start flex-col justify-between gap-8 p-7 sm:w-[calc((100%-2rem)/3)]"
            data-reveal-item
          >
            <p className="text-card-title leading-[1.4] text-ink">{item.quote}</p>
            <div className="flex items-end justify-between gap-4 border-t border-line pt-5">
              <div className="flex flex-col gap-0.5">
                <p className="text-body text-ink">{item.name}</p>
                <p className="text-eyebrow text-muted">
                  {item.role} · {item.org}
                </p>
              </div>
              <span className="shrink-0 text-eyebrow text-muted-2">
                {i + 1}/{t.items.length}
              </span>
            </div>
          </Card>
        ))}
      </ul>

      <div className="flex items-center gap-3" data-reveal>
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Previous"
          className="grid size-10 place-items-center rounded-pill bg-ink text-on-dark transition-colors hover:bg-ink/85"
        >
          <Icon name="arrow" className="size-4 rotate-180" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Next"
          className="grid size-10 place-items-center rounded-pill bg-ink text-on-dark transition-colors hover:bg-ink/85"
        >
          <Icon name="arrow" className="size-4" />
        </button>
      </div>
    </Section>
  );
}
