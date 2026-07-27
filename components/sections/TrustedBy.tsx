import type { Dict } from "@/lib/i18n";

/* The comp's hero foot: one muted caption over a single drifting row
   of partner names. Rendered inside <Hero />, not as a standalone band. */
export default function TrustedBy({ dict }: { dict: Dict }) {
  const t = dict.trustedBy;
  const row = [...t.logos, ...t.logos];
  return (
    <div className="flex flex-col gap-6" aria-label={t.label} data-reveal>
      <p className="text-center text-eyebrow text-muted-2">{t.label}</p>
      <div className="dm-fade-x relative overflow-hidden" dir="ltr">
        <div className="animate-marquee flex w-max items-center gap-12">
          {row.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="whitespace-nowrap font-display text-[20px] leading-none text-muted"
              aria-hidden={i >= t.logos.length}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
