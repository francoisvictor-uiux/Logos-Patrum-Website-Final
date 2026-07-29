import DottedBackground from "@/components/ui/DottedBackground";
import { CaretCircle, DuotoneIcon, type DuotoneName } from "@/components/icons";
import { heroShaderColors, surface } from "@/lib/tokens";
import type { Dict } from "@/lib/i18n";

export default function Hero({ dict }: { dict: Dict }) {
  const t = dict.hero;
  return (
    /* data-hero* hooks are the reveal targets driven by components/Preloader. */
    <section id="top" className="relative isolate overflow-clip">

      {/* Dot Matrix Background */}
      <div
        data-hero-shader
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
        style={{
          maskImage: "radial-gradient(ellipse at center, transparent 8%, black 45%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, transparent 8%, black 45%)"
        }}
      >
        <DottedBackground
          bgColor={surface}
          frequency={1.5}
          speed={2}
          cellSize={6}
          gamma={7}
          paletteBias={-5}
          colors={heroShaderColors}
        />
      </div>

      {/* Bottom blend — eased fade to the surface white so the dot matrix
          dissolves into the next section instead of ending on a hard edge.
          Same -z-10 as the shader, later in DOM order, so it paints over the
          dots but stays behind the content. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[160px] sm:h-[200px]"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--color-surface) 0%, transparent) 0%, color-mix(in srgb, var(--color-surface) 40%, transparent) 55%, color-mix(in srgb, var(--color-surface) 85%, transparent) 82%, var(--color-surface) 100%)",
        }}
      />

      {/* pt clears the floating navbar (24 + 72) — it no longer takes up flow.
          pb-80 = the spacing system's highlights → next-section step. */}
      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-[1280px] flex-col justify-center px-5 pb-[80px] pt-[112px] lg:px-8">

        {/* Figma Layout */}
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto">

          {/* Spacing-system ladder: eyebrow —24 (spec says 16; 24 was chosen
              deliberately)— headline —24— description —48— CTAs —48—
              feature highlights —80— next section. */}
          <div className="flex flex-col gap-[48px] items-center justify-center relative shrink-0 w-full">

            <div className="flex flex-col gap-[24px] items-center justify-center relative shrink-0 w-full">

              <div className="flex flex-col gap-[24px] items-center justify-center relative shrink-0 w-full">
                <div className="bg-chip border border-line-strong min-h-[36px] flex gap-[8px] items-center px-[17px] py-[4px] relative rounded-[100px]" data-hero-eyebrow>
                  <div className="relative flex size-[10px] shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-live-halo opacity-75"></span>
                    <span className="relative inline-flex size-[10px] rounded-full bg-live"></span>
                  </div>
                  <p className="font-sans font-semibold text-[16px] leading-[24px] tracking-[0.08em] text-muted-2 text-center text-balance" dir="auto" style={{ fontFeatureSettings: '"swsh"' }}>
                    {t.eyebrow}
                  </p>
                </div>

                {/* Arabic holds one line from lg up (rule in globals.css) —
                    text-balance would otherwise split a near-fit into two even
                    lines. Phones still wrap naturally. */}
                <h1 className="font-display font-bold text-balance leading-[1.08] tracking-[-0.03em] max-w-[900px] text-[40px] sm:text-[52px] lg:text-[64px] text-title text-center" dir="auto" style={{ fontFeatureSettings: '"swsh"' }} data-hero-title>
                  {t.title}
                </h1>
              </div>

              <p className="font-sans font-normal text-[18px] sm:text-[22px] text-muted text-center w-full max-w-[720px] leading-[1.7]" dir="auto" data-hero-desc>
                {t.description}
              </p>

            </div>

            <div className="flex flex-col gap-[48px] items-center justify-center relative shrink-0 w-full">

              {/* Buttons — 52px tall, 16px / 600, 16px apart. */}
              <div className="flex flex-wrap gap-[16px] items-center justify-center relative shrink-0 w-full">
                <a data-hero-cta href="#pricing" className="bg-accent flex gap-[12px] items-center justify-center ps-[24px] pe-[16px] h-[52px] rounded-[12px] transition-colors hover:bg-accent-hover">
                  <span className="font-sans font-semibold text-on-accent text-[16px] whitespace-nowrap" style={{ fontFeatureSettings: '"swsh"' }}>
                    {t.primaryCta}
                  </span>
                  <CaretCircle className="size-7 shrink-0 text-on-accent" />
                </a>
                <a data-hero-cta href="#features" className="border border-accent bg-white/30 backdrop-blur-[2px] flex h-[52px] items-center justify-center px-[24px] rounded-[12px] transition-colors duration-200 hover:bg-chip">
                  <span className="font-sans font-semibold text-[16px] text-accent whitespace-nowrap" style={{ fontFeatureSettings: '"swsh"' }}>
                    {t.secondaryCta}
                  </span>
                </a>
              </div>

              {/* Feature highlights — 16px / 500, 32px between items (16px on
                  each side of the hairline divider). Container-less on purpose:
                  a quiet extension of the hero copy. */}
              <ul className="flex flex-wrap items-center justify-center gap-x-[16px] gap-y-[12px] relative shrink-0 w-full">
                {t.capabilities.map((cap, i) => (
                  <li key={cap.label} data-hero-feature className="flex items-center gap-x-[16px]">
                    {i > 0 && (
                      <span className="hidden h-[14px] w-px shrink-0 bg-line sm:block" aria-hidden="true" />
                    )}
                    <span className="group flex items-center gap-[8px] opacity-80 transition-opacity duration-200 ease-out hover:opacity-100">
                      <DuotoneIcon
                        name={cap.icon as DuotoneName}
                        className="size-4 shrink-0 text-accent transition-transform duration-200 ease-out group-hover:-translate-y-[2px]"
                      />
                      <span
                        className="font-sans font-medium text-[16px] leading-none text-gray-700 whitespace-nowrap transition-colors duration-200 ease-out group-hover:text-accent"
                        style={{ fontFeatureSettings: '"swsh"' }}
                      >
                        {cap.label}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

            </div>

          </div>

        </div>


      </div>
    </section>
  );
}
