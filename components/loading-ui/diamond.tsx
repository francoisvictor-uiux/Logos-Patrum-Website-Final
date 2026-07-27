import { cn } from "@/lib/utils";
import * as React from "react";
import { motion } from "motion/react";

export function Diamond({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.5, rotate: 45 }}
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5], rotate: 45 }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay 
      }}
      className={cn("bg-[#21386E] rounded-[2px]", className)} 
    />
  );
}
