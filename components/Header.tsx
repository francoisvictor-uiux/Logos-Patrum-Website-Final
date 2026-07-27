"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "./ui";
import { useScroll } from "./use-scroll";
import type { Dict, Locale } from "@/lib/i18n";

function MenuToggleIcon({ open, className }: { open: boolean; className?: string }) {
  const bar =
    "absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 rounded-full bg-current transition-all duration-300 ease-out";
  return (
    <span className={cn("relative block h-4 w-5", className)} aria-hidden>
      <span className={cn(bar, open ? "rotate-45" : "-translate-y-[5px]")} />
      <span className={cn(bar, open ? "opacity-0" : "opacity-100")} />
      <span className={cn(bar, open ? "-rotate-45" : "translate-y-[5px]")} />
    </span>
  );
}

export default function Header({ dict, locale }: { dict: Dict; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const scrolled = useScroll(10);
  const otherLocale: Locale = locale === "ar" ? "en" : "ar";

  const links = [
    { label: "المنصة", href: "#features" },
    { label: "المميزات", href: "#story" },
    { label: "الأسعار", href: "#pricing" },
    { label: "المصادر", href: "#news" },
    { label: "عن المشروع", href: "#faq" },
  ];

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      data-reveal-nav
      className={cn(
        "sticky top-0 z-50 mx-auto w-full max-w-[1080px] border-b border-transparent md:rounded-b-2xl md:border md:transition-all md:ease-out",
        {
          "bg-page/95 supports-[backdrop-filter]:bg-page/50 border-line backdrop-blur-lg md:top-4 md:shadow-sm":
            scrolled && !open,
          "bg-page/90": open,
        }
      )}
    >
      <nav
        className={cn(
          "flex h-20 w-full items-center justify-between px-6 md:h-20 md:transition-all md:ease-out",
          {
            "md:px-6": scrolled,
          }
        )}
      >
        <a href="#top" className="flex shrink-0 items-center gap-2 text-ink">
          <Image src="/images/logo-navy.svg" alt="Logos Patrum Icon" width={68} height={40} style={{ width: 'auto', height: '40px' }} />
        </a>
        
        <div className="hidden items-center gap-4 md:flex">
          {links.map((link, i) => (
            <a
              key={i}
              className="text-body font-medium text-nav-link transition-colors hover:text-ink px-2"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-3 ms-4">
            <Link
              href={`/${otherLocale}`}
              aria-label={dict.footer.langSwitch}
              className="rounded-pill px-3 py-2 text-body font-medium text-nav-link transition-colors hover:bg-chip hover:text-ink"
            >
              {dict.footer.langSwitch}
            </Link>
            <a href="#login" className="border-2 border-[#21386E] flex h-[44px] items-center justify-center px-[20px] rounded-[12px] transition-colors hover:bg-[#21386E]/5">
              <span className="font-sans font-medium text-[16px] text-[#21386E] whitespace-nowrap" style={{ fontFeatureSettings: '"swsh"' }}>
                تسجيل الدخول
              </span>
            </a>
            <a href="#pricing" className="bg-[#21386E] flex gap-[12px] items-center justify-center pl-[16px] pr-[20px] h-[44px] rounded-[12px] transition-colors hover:bg-[#17294f]">
              <span className="font-sans font-medium text-[#fefefe] text-[16px] whitespace-nowrap" style={{ fontFeatureSettings: '"swsh"' }}>
                ابدأ مجانًا
              </span>
              <Image src="/images/primary-btn-icon.png" alt="Icon" width={24} height={24} />
            </a>
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:hidden">
            <Link
              href={`/${otherLocale}`}
              aria-label={dict.footer.langSwitch}
              className="rounded-pill px-3 py-2 text-body font-medium text-nav-link transition-colors hover:bg-chip hover:text-ink"
            >
              {dict.footer.langSwitch}
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="grid size-9 place-items-center rounded-pill text-ink transition-colors hover:bg-chip"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <MenuToggleIcon open={open} className="size-5" />
            </button>
        </div>
      </nav>

      <div
        className={cn(
          "bg-page/95 backdrop-blur-xl fixed top-[81px] right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-y border-line md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <div
          data-slot={open ? "open" : "closed"}
          className={cn(
            "data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out",
            "flex h-full w-full flex-col justify-between p-6"
          )}
        >
          <div className="flex flex-col">
            {links.map((link) => (
              <a
                key={link.label}
                className="border-b border-line py-4 font-display text-[28px] leading-none text-ink"
                href={link.href}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <a href="#login" onClick={() => setOpen(false)} className="border-2 border-[#21386E] flex h-[56px] w-full items-center justify-center px-[24px] rounded-[12px] transition-colors hover:bg-[#21386E]/5">
              <span className="font-sans font-medium text-[20px] text-[#21386E] whitespace-nowrap" style={{ fontFeatureSettings: '"swsh"' }}>
                تسجيل الدخول
              </span>
            </a>
            <a href="#pricing" onClick={() => setOpen(false)} className="bg-[#21386E] flex gap-[12px] w-full items-center justify-center pl-[16px] pr-[24px] h-[56px] rounded-[12px] transition-colors hover:bg-[#17294f]">
              <span className="font-sans font-medium text-[#fefefe] text-[20px] whitespace-nowrap" style={{ fontFeatureSettings: '"swsh"' }}>
                ابدأ مجانًا
              </span>
              <Image src="/images/primary-btn-icon.png" alt="Icon" width={32} height={32} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
