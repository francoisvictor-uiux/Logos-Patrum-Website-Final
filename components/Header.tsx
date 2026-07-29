"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useActiveSection, useScroll } from "./use-scroll";
import type { Dict, Locale } from "@/lib/i18n";

/* Calm motion — one easing curve (the --ease-calm token), nothing over 350ms. */
const EASE = "var(--ease-calm)";
/* Arabic-first reading order: AR │ EN. */
const LANGS: readonly Locale[] = ["ar", "en"];
const CODES: Record<Locale, string> = { ar: "AR", en: "EN" };

function MenuToggleIcon({ open, className }: { open: boolean; className?: string }) {
  // The bars are centred with -translate-y-1/2 and offset with margin rather
  // than a second translate, so the open/closed classes never collide.
  const bar =
    "absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 rounded-full bg-current transition-all duration-300 ease-out";
  return (
    <span className={cn("relative block h-4 w-5", className)} aria-hidden>
      <span className={cn(bar, open ? "rotate-45" : "-mt-[5px]")} />
      <span className={cn(bar, open && "opacity-0")} />
      <span className={cn(bar, open ? "-rotate-45" : "mt-[5px]")} />
    </span>
  );
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export default function Header({ dict, locale }: { dict: Dict; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const links = dict.nav.links;
  const active = useActiveSection(links.map((l) => l.href));
  const router = useRouter();
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* Glass on past 40px and stays on, whichever way the user is travelling. */
  const solid = useScroll(40);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* Esc closes the drawer and hands focus back to the toggle. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  /* Arriving on a locale — including right after a switch — fades the page in. */
  useEffect(() => {
    const body = document.body;
    body.style.transition = `opacity 180ms ${EASE}`;
    body.style.opacity = "1";
  }, [locale]);

  const switchLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      const segments = pathname.split("/");
      segments[1] = next;
      const href = segments.join("/") || `/${next}`;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        router.push(href);
        return;
      }
      // Fade out, swap, fade back in on the other side (see the effect above).
      document.body.style.transition = "opacity 120ms ease-out";
      document.body.style.opacity = "0";
      window.setTimeout(() => router.push(href), 120);
    },
    [locale, pathname, router]
  );

  return (
    <header className="fixed inset-x-0 top-[16px] z-[9999] px-4 sm:px-6 md:top-[24px]">
      <nav
        data-nav-reveal
        aria-label={dict.common.mainNav}
        className={cn(
          "relative z-[2] mx-auto flex h-[64px] w-full max-w-[1280px] items-center justify-between rounded-[32px] px-[20px] md:h-[72px] md:px-[32px]",
          "transition-[background-color,backdrop-filter] duration-[350ms] motion-reduce:transition-none",
          /* At rest the bar is pure air — no fill, no stroke, no blur. Past the
             threshold the glass stays put in both scroll directions. The bar
             never moves or resizes: only the surface behind it changes. */
          solid ? "bg-white/[0.72] backdrop-blur-[28px]" : "bg-transparent backdrop-blur-none"
        )}
        style={{ transitionTimingFunction: EASE }}
      >
        {/* Logo — sits at the start of the line, i.e. right in RTL */}
        <a
          href="#top"
          aria-label="Logos Patrum"
          className={cn(
            "flex shrink-0 cursor-pointer items-center rounded-[8px] transition-transform duration-[180ms] ease-out hover:scale-[1.04] motion-reduce:transform-none",
            focusRing
          )}
        >
          <Image
            src="/images/logo-navy.svg"
            alt="Logos Patrum"
            width={73}
            height={43}
            style={{ width: "auto", height: "43.2px" }}
            priority
          />
        </a>

        {/* Primary navigation */}
        <div className="hidden items-center gap-[40px] md:flex">
          {links.map((link) => {
            const isActive = active === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group relative flex h-[44px] cursor-pointer items-center rounded-[8px] text-[16px] font-medium transition-colors duration-[220ms] ease-out",
                  isActive ? "text-accent" : "text-nav-link hover:text-accent",
                  focusRing
                )}
              >
                {/* The rule hangs off the label box, not the 44px hit area, so
                    the gap under the text is identical for every item. */}
                <span className="relative leading-none">
                  {link.label}
                  {/* Grows from the centre — 0% → 100% */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute inset-x-0 -bottom-[8px] h-[2px] origin-center rounded-full bg-accent",
                      "transition-transform duration-[220ms] ease-out motion-reduce:transition-none",
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </span>
              </a>
            );
          })}
        </div>

        {/* Actions */}
        <div className="hidden items-center gap-[16px] md:flex">
          <LangSwitch locale={locale} onSwitch={switchLocale} label={dict.footer.langSwitch} />

          {/* Both buttons mirror the hero pair exactly — same fill, same
              stroke, same hover. One button language across the page. */}
          <a
            href="#login"
            className={cn(
              "inline-flex h-[44px] cursor-pointer items-center justify-center rounded-[12px] border border-accent bg-white/30 px-[24px] text-[16px] font-semibold text-accent backdrop-blur-[2px]",
              "transition-colors duration-200 ease-out hover:bg-chip",
              focusRing
            )}
            style={{ fontFeatureSettings: '"swsh"' }}
          >
            {dict.nav.login}
          </a>

          <a
            href="#pricing"
            className={cn(
              "inline-flex h-[44px] cursor-pointer items-center justify-center rounded-[12px] bg-accent px-[24px] text-[16px] font-semibold text-on-accent",
              "transition-colors duration-200 ease-out hover:bg-accent-hover",
              focusRing
            )}
            style={{ fontFeatureSettings: '"swsh"' }}
          >
            {dict.nav.signup}
          </a>
        </div>

        {/* Compact bar */}
        <div className="flex items-center gap-[8px] md:hidden">
          <LangSwitch locale={locale} onSwitch={switchLocale} label={dict.footer.langSwitch} />
          <button
            ref={toggleRef}
            onClick={() => setOpen(!open)}
            className={cn(
              "grid size-[44px] cursor-pointer place-items-center rounded-[12px] text-accent transition-colors duration-200 ease-out hover:bg-chip",
              focusRing
            )}
            aria-label={open ? dict.common.closeMenu : dict.common.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <MenuToggleIcon open={open} className="size-5" />
          </button>
        </div>
      </nav>

      {/* Blur scrim */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-0 bg-primary-900/20 backdrop-blur-[12px] transition-opacity duration-[320ms] md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        style={{ transitionTimingFunction: EASE }}
      />

      {/* Drawer — slides in from the right */}
      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={dict.common.openMenu}
        className={cn(
          "fixed inset-y-0 right-0 z-[1] flex w-[320px] max-w-[85vw] flex-col bg-white px-6 pb-6 pt-[104px] md:hidden",
          "transition-[transform,opacity] duration-[320ms] motion-reduce:transition-none",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        style={{
          transform: open ? "translateX(0)" : "translateX(100%)",
          transitionTimingFunction: EASE,
        }}
      >
        <div className="flex flex-col gap-[16px]">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={active === link.href ? "page" : undefined}
              className={cn(
                "flex h-[56px] cursor-pointer items-center rounded-[12px] px-3 text-[16px] font-medium transition-colors duration-200 ease-out",
                active === link.href
                  ? "bg-chip text-accent"
                  : "text-nav-link hover:bg-chip hover:text-accent",
                focusRing
              )}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Anchored to the bottom of the panel */}
        <div className="mt-auto flex flex-col gap-[12px] pt-8">
          <a
            href="#login"
            onClick={() => setOpen(false)}
            className={cn(
              "inline-flex h-[52px] w-full cursor-pointer items-center justify-center rounded-[12px] border border-accent px-[24px] text-[16px] font-semibold text-accent",
              "transition-colors duration-200 ease-out hover:bg-chip",
              focusRing
            )}
            style={{ fontFeatureSettings: '"swsh"' }}
          >
            {dict.nav.login}
          </a>
          <a
            href="#pricing"
            onClick={() => setOpen(false)}
            className={cn(
              "inline-flex h-[52px] w-full cursor-pointer items-center justify-center rounded-[12px] bg-accent px-[24px] text-[16px] font-semibold text-on-accent",
              "transition-colors duration-200 ease-out hover:bg-accent-hover",
              focusRing
            )}
            style={{ fontFeatureSettings: '"swsh"' }}
          >
            {dict.nav.signup}
          </a>
        </div>
      </div>
    </header>
  );
}

/* AR │ EN — a plain text switch. No pill, no dropdown, no flag. */
function LangSwitch({
  locale,
  onSwitch,
  label,
}: {
  locale: Locale;
  onSwitch: (next: Locale) => void;
  label: string;
}) {
  return (
    <div className="flex h-[44px] items-center gap-[8px] text-[15px] font-medium">
      {LANGS.map((code, i) => {
        const isActive = code === locale;
        return (
          <React.Fragment key={code}>
            {i > 0 && (
              <span className="h-[14px] w-px bg-line" aria-hidden="true" />
            )}
            {isActive ? (
              <span aria-current="true" className="text-accent">
                {CODES[code]}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onSwitch(code)}
                aria-label={label}
                className={cn(
                  "cursor-pointer rounded-[6px] text-muted-2 transition-colors duration-[180ms] ease-out hover:text-accent",
                  focusRing
                )}
              >
                {CODES[code]}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
