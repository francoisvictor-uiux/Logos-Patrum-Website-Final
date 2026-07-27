import { Section, SectionHeading, Card, Button } from "../ui";
import type { Dict } from "@/lib/i18n";

export default function Preview({ dict }: { dict: Dict }) {
  const t = dict.preview;
  return (
    <Section id="preview">
      <SectionHeading eyebrow={t.eyebrow} title={t.title} description={t.description} />

      {/* Figma media card: 12px frame around a 30px-radius well */}
      <Card className="w-full overflow-clip p-3" data-reveal>
        <div className="dm-media bg-navy-950">
          {/* Reader chrome */}
          <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
            <span className="size-2 rounded-full bg-white/20" aria-hidden />
            <span className="size-2 rounded-full bg-white/20" aria-hidden />
            <span className="size-2 rounded-full bg-white/20" aria-hidden />
            <span className="ms-3 truncate text-eyebrow text-white/50">
              {t.translationTitle} · {t.translationAuthor}
            </span>
          </div>

          <div className="grid lg:grid-cols-2">
            {/* Original */}
            <div className="border-b border-white/10 p-7 sm:p-9 lg:border-b-0 lg:border-e" dir="ltr">
              <p className="text-eyebrow text-bronze-400">{t.greekLabel}</p>
              <h3 lang="grc" className="mt-3 font-greek text-[27px] leading-none text-on-dark">
                {t.greekTitle}
              </h3>
              <p lang="grc" className="mt-2 font-greek text-[17px] text-white/50">
                {t.greekAuthor}
              </p>
              <div className="mt-6 flex flex-col gap-4">
                {t.greekText.map((line, i) => (
                  <p
                    key={i}
                    lang="grc"
                    className={
                      i === 0
                        ? "rounded-xl bg-white/[0.07] px-4 py-3 font-greek text-[20px] leading-relaxed text-bronze-300"
                        : "px-4 font-greek text-[20px] leading-relaxed text-white/75"
                    }
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Translation */}
            <div className="p-7 sm:p-9">
              <p className="text-eyebrow text-white/50">{t.translationLabel}</p>
              <h3 className="mt-3 font-display text-[26px] leading-none text-on-dark">
                {t.translationTitle}
              </h3>
              <p className="mt-2 text-body text-white/50">{t.translationAuthor}</p>
              <div className="mt-6 flex flex-col gap-4">
                {t.translationText.map((line, i) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? "rounded-xl bg-white/[0.07] px-4 py-3 text-body text-on-dark"
                        : "px-4 text-body text-white/75"
                    }
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Research connections */}
          <dl className="grid gap-4 border-t border-white/10 px-7 py-6 sm:grid-cols-3 sm:px-9">
            {t.connections.map((c) => (
              <div key={c.k}>
                <dt className="text-eyebrow text-white/40">{c.k}</dt>
                <dd className="mt-1 text-body text-white/75">{c.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Card>

      <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row" data-reveal>
        <p className="text-body text-muted">{t.note}</p>
        <Button href="#pricing" variant="subtle">
          {t.cta}
        </Button>
      </div>
    </Section>
  );
}
