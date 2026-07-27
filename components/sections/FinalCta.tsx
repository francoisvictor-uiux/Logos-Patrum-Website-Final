import type { Dict } from "@/lib/i18n";

const GREEK_LINE = "ΛΟΓΟΣ · ΣΟΦΙΑ · ΑΛΗΘΕΙΑ · ΠΑΡΑΔΟΣΙΣ · ";

/* Figma final CTA: a full-width rounded card, copy pinned to the reading
   edge, artwork bleeding off the other side. */
export default function FinalCta({ dict }: { dict: Dict }) {
  const t = dict.finalCta;
  return (
    <section className="px-6 py-16 sm:py-24">
      <div
        className="relative mx-auto w-full max-w-[1080px] overflow-clip rounded-card bg-navy-950 px-8 py-14 sm:px-14 sm:py-20"
        data-reveal
      >
        {/* Atmosphere */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(70% 90% at 85% 30%, rgba(111,143,221,0.28), transparent 65%), radial-gradient(50% 70% at 15% 100%, rgba(180,83,9,0.22), transparent 65%)",
          }}
        />
        <p
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-6 select-none whitespace-nowrap text-center font-display text-[80px] leading-none text-white/[0.04]"
        >
          {GREEK_LINE.repeat(4)}
        </p>

        <div className="relative flex max-w-[520px] flex-col gap-5">
          <h2 className="font-display text-[2.25rem] leading-[1.1] tracking-[0.01em] text-on-dark sm:text-[2.75rem]">
            {t.title}
          </h2>
          <p className="text-body text-white/70">{t.description}</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <a
              href="#pricing"
              className="inline-flex items-center justify-center rounded-pill bg-surface px-5 py-2.5 text-body font-medium leading-none text-ink transition-colors hover:bg-white/90"
            >
              {t.primary}
            </a>
            <a
              href="#footer"
              className="inline-flex items-center justify-center rounded-pill border border-white/25 px-5 py-2.5 text-body font-medium leading-none text-on-dark transition-colors hover:bg-white/10"
            >
              {t.secondary}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
