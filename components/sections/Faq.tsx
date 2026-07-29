"use client";

import { useState } from "react";
import { Section, SectionHeading } from "../ui";
import { Icon } from "../icons";
import { cn } from "@/lib/utils";
import type { Dict } from "@/lib/i18n";

export default function Faq({ dict }: { dict: Dict }) {
  const t = dict.faq;
  const [category, setCategory] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(t.items[0]?.q ?? null);
  const visible = t.items.filter((item) => !category || item.cat === category);

  const chip =
    "rounded-pill px-4 py-2 text-eyebrow transition-colors duration-200";

  return (
    <Section id="faq">
      <SectionHeading eyebrow={t.eyebrow} title={t.title} description={t.description} />

      {/* Category chips */}
      <div className="flex flex-wrap justify-center gap-2" data-reveal>
        <button
          type="button"
          onClick={() => setCategory(null)}
          aria-pressed={category === null}
          className={cn(chip, category === null ? "bg-ink text-on-dark" : "bg-chip text-muted hover:text-ink")}
        >
          {t.all}
        </button>
        {t.categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            aria-pressed={category === cat}
            className={cn(chip, category === cat ? "bg-ink text-on-dark" : "bg-chip text-muted hover:text-ink")}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Figma FAQ: two columns of pill-shaped rows */}
      <ul className="grid w-full gap-3 md:grid-cols-2" data-reveal-group>
        {visible.map((item) => {
          const isOpen = open === item.q;
          return (
            <li
              key={item.q}
              data-reveal-item
              className="dm-card h-fit overflow-clip"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : item.q)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start"
              >
                <span className="text-body text-ink">{item.q}</span>
                <Icon
                  name="chevron"
                  className={cn(
                    "size-4 shrink-0 text-muted transition-transform duration-300",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-300 ease-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-body text-muted">{item.a}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
