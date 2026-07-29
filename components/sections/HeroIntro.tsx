"use client";

import * as React from "react";
import { LayoutGroup, motion } from "motion/react";
import { TextRotate } from "@/components/ui/text-rotate";
import type { Dict } from "@/lib/i18n";

/**
 * HeroIntro — a compact banner section that sits directly below the Hero,
 * pairing a fixed prefix with a rotating noun on a navy background.
 */
export default function HeroIntro({ dict }: { dict: Dict }) {
  const t = dict.heroIntro;
  return (
    <section className="relative w-full bg-accent py-16 sm:py-20 flex items-center justify-center overflow-hidden">
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 120% at 50% 50%, color-mix(in srgb, var(--color-live) 10%, transparent) 0%, transparent 70%)",
        }}
      />

      {/* Rotating text */}
      <div className="relative z-10 flex items-center justify-center px-6 text-2xl sm:text-4xl md:text-5xl font-medium text-white">
        <LayoutGroup>
          <motion.div className="flex items-center gap-3 sm:gap-4" layout>
            <motion.span
              className="shrink-0"
              layout
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
            >
              {t.prefix}
            </motion.span>

            <TextRotate
              key={t.prefix}
              texts={[...t.words]}
              mainClassName="text-live px-6 sm:px-8 bg-white pt-2 pb-4 sm:pt-3 sm:pb-5 justify-center rounded-xl min-w-max"
              splitBy="words"
              staggerFrom="last"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-120%", opacity: 0 }}
              staggerDuration={0.05}
              splitLevelClassName="overflow-hidden pb-1"
              transition={{ type: "spring", damping: 28, stiffness: 350 }}
              rotationInterval={1800}
            />
          </motion.div>
        </LayoutGroup>
      </div>
    </section>
  );
}
