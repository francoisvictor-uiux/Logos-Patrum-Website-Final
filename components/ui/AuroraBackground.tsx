"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        style={{ colorScheme: "light" }}
        className={cn(
          "relative flex flex-col h-[100vh] items-center justify-center bg-white text-slate-950 transition-bg",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={cn(
              // Dark-blue-only palette drawn from the brand primary scale:
              // primary-950 → primary-800 → primary-600 → primary-400 → primary-200
              // The invert trick turns these darks into luminous blue glows on the white bg.
              `[--white:#ffffff]
              [--transparent:transparent]
              [--blue-950:#050914]
              [--blue-900:#0B1327]
              [--blue-800:#121F3D]
              [--blue-700:#17294F]
              [--blue-600:#1C315F]
              [--blue-500:#21386E]
              [--blue-400:#6F8FDD]
              [--blue-300:#A4BAEC]
              [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
              [--aurora:repeating-linear-gradient(100deg,var(--blue-950)_0%,var(--blue-800)_10%,var(--blue-600)_20%,var(--blue-400)_30%,var(--blue-300)_40%,var(--blue-500)_50%,var(--blue-700)_60%,var(--blue-900)_70%,var(--blue-950)_80%)]
              [background-image:var(--white-gradient),var(--aurora)]
              [background-size:300%,_200%]
              [background-position:50%_50%,50%_50%]
              filter blur-[10px] invert
              after:content-[''] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)]
              after:[background-size:200%,_100%]
              after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
              pointer-events-none
              absolute -inset-[10px] opacity-50 will-change-transform`,

              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
            )}
          ></div>
        </div>
        {children}
      </div>
    </main>
  );
};
