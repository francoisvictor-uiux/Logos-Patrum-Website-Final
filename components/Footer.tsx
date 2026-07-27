import Link from "next/link";
import type { Dict, Locale } from "@/lib/i18n";

/* Figma footer: brand block on the reading edge, link columns opposite,
   separated from the page by a single hairline. */
export default function Footer({ dict, locale }: { dict: Dict; locale: Locale }) {
  const t = dict.footer;
  const otherLocale = locale === "ar" ? "en" : "ar";
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="border-t border-line px-6 py-16">
      <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-14">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="grid size-6 place-items-center rounded-full bg-navy-500 font-display text-[13px] leading-none text-on-dark"
              >
                Λ
              </span>
              <span className="font-display text-[22px] leading-none tracking-[0.01em] text-ink">
                Logos Patrum
              </span>
            </div>
            <p className="max-w-[280px] text-body text-muted">{t.tagline}</p>
            <span aria-hidden className="meander w-20 opacity-50" />
            <address className="flex flex-col gap-1 text-body not-italic text-muted">
              <a href={`mailto:${t.contact.email}`} className="transition-colors hover:text-ink">
                {t.contact.email}
              </a>
              <span dir="ltr" className="text-start">
                {t.contact.phone}
              </span>
              <span>{t.contact.address}</span>
            </address>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {t.social.map((name) => (
                <li key={name}>
                  <a href="#" className="text-eyebrow text-muted transition-colors hover:text-ink">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          <nav className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3" aria-label="Footer">
            {t.columns.map((col) => (
              <div key={col.title} className="flex flex-col gap-4">
                <h3 className="text-body text-ink">{col.title}</h3>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-body text-muted transition-colors hover:text-ink">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-line pt-8 sm:flex-row">
          <p className="text-eyebrow text-muted-2">
            © {year} {t.rights} <span className="ms-2">{t.version}</span>
          </p>
          <div className="flex items-center gap-1">
            <Link
              href={`/${otherLocale}`}
              className="rounded-pill px-3 py-2 text-eyebrow text-muted transition-colors hover:bg-chip hover:text-ink"
            >
              {t.langSwitch}
            </Link>
            <a
              href="#top"
              className="rounded-pill px-3 py-2 text-eyebrow text-muted transition-colors hover:bg-chip hover:text-ink"
            >
              {t.backToTop}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
