"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Card, TwoTone, Eyebrow } from "../ui";
import type { Dict, Locale } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Stats({ dict, locale }: { dict: Dict; locale: Locale }) {
  const t = dict.stats;
  const scope = useRef<HTMLElement>(null);
  const nf = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const target = Number(el.dataset.count);
          const state = { value: 0 };
          gsap.to(state, {
            value: target,
            duration: 1.8,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
            onUpdate: () => {
              el.textContent = nf.format(Math.round(state.value));
            },
          });
        });
      });
    },
    { scope }
  );

  return (
    <section ref={scope} className="px-5 py-[96px] md:py-[128px] lg:px-8 lg:py-[160px]">
      <div className="mx-auto flex w-full max-w-[1080px] flex-col items-center gap-[56px] lg:gap-[80px]">
        <div className="flex flex-col items-center gap-[16px] text-center" data-reveal>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2
            className="text-balance font-display text-[32px] font-bold leading-[1.12] text-muted sm:text-[40px] lg:text-[48px]"
            style={{ fontFeatureSettings: '"swsh"' }}
          >
            <TwoTone text={t.title} />
          </h2>
        </div>

        <Card className="w-full p-8 sm:p-10">
          <dl
            className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6"
            data-reveal-group
          >
            {t.items.map((item) => (
              <div key={item.label} data-reveal-item className="flex flex-col gap-1 text-center">
                <dd className="font-display text-[38px] leading-none text-ink">
                  <span data-count={item.value}>{nf.format(item.value)}</span>
                  <span className="text-muted-2">{item.suffix}</span>
                </dd>
                <dt className="text-eyebrow text-muted">{item.label}</dt>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </section>
  );
}
