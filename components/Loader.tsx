"use client";

import * as React from "react";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  LayoutGroup
} from "motion/react";
import { cn } from "@/lib/utils";
import { TextRotate } from "@/components/ui/text-rotate";

export default function Loader({ tagline }: { tagline?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = React.useState<"loading" | "reveal" | "done">("loading");
  
  // A simple counter to drive the duration before the reveal
  const count = useMotionValue(0);

  // Arc reveal progress
  const progress = useMotionValue(0);
  const arcPath = useTransform(progress, (p: number) => {
    const edge = 110 - p * 140;
    const control = edge + 25;
    return `M 0 ${edge} Q 50 ${control} 100 ${edge} L 100 110 L 0 110 Z`;
  });

  const countRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (prefersReducedMotion) {
      setPhase("done");
      return;
    }
    
    document.body.style.overflow = "hidden";

    // Wait for the text rotation sequence to finish before revealing
    // 5 words * 1800ms interval = 9000ms
    const t = setTimeout(() => {
      setPhase("reveal");
    }, 9000);

    return () => clearTimeout(t);
  }, [prefersReducedMotion]);

  React.useEffect(() => {
    if (phase !== "reveal") return;
    
    const controls = animate(progress, 1, {
      duration: 1.2,
      ease: [0.85, 0, 0.15, 1],
      onComplete: () => {
        document.body.style.overflow = "";
        setPhase("done");
        // Signal the page to start its GSAP entrance animation
        window.dispatchEvent(new CustomEvent("page-reveal"));
      },
    });
    return () => controls.stop();
  }, [phase, progress]);

  if (phase === "done") return null;

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="loader-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-x-0 top-0 z-[100] h-screen overflow-hidden bg-[#21386E] flex flex-col"
        >
          {phase === "loading" && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center w-full z-20"
            >
              <div className="w-full text-2xl sm:text-4xl md:text-5xl flex flex-row items-center justify-center text-white font-medium px-6" dir="rtl">
                <LayoutGroup>
                  <motion.div className="flex items-center gap-3" layout>
                    <motion.span
                      className="shrink-0"
                      layout
                      transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    >
                      نستكشف
                    </motion.span>
                    <TextRotate
                      texts={[
                        "النصوص الأصلية.",
                        "الترجمات.",
                        "المعرفة.",
                        "المعاني.",
                        "التراث",
                      ]}
                      mainClassName="text-[#EE8D43] px-6 sm:px-8 bg-white pt-2 pb-4 sm:pt-3 sm:pb-5 justify-center rounded-xl min-w-max"
                      splitBy="words"
                      staggerFrom={"last"}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: "-120%", opacity: 0 }}
                      staggerDuration={0.05}
                      splitLevelClassName="overflow-hidden pb-1"
                      transition={{ type: "spring", damping: 28, stiffness: 350 }}
                      rotationInterval={1800}
                      dir="rtl"
                    />
                  </motion.div>
                </LayoutGroup>
              </div>
            </motion.div>
          )}

          {/* Rising curved curtain */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full z-10"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            {/* The curtain path filling with white so it sweeps up seamlessly */}
            <motion.path d={arcPath} style={{ fill: "white" }} />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
