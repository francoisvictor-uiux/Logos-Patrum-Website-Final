"use client";

import React, { useState, useEffect } from "react";
import SmokyText from "./SmokyText";

export default function RotatingAncientText() {
  const texts = [
    {
      content: "Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν, καὶ θεὸς ἦν ὁ λόγος. οὗτος ἦν ἐν ἀρχῇ πρὸς τὸν θεόν.",
      dir: "ltr",
      align: "left",
      font: "inherit"
    },
    {
      content: "ܒ݁ܪܺܫܺܝܬ݂ ܐܺܝܬ݂ܰܘܗ݈ܝ ܗ݈ܘܳܐ ܡܶܠܬ݂ܳܐ ܘܗܽܘ ܡܶܠܬ݂ܳܐ ܐܺܝܬ݂ܰܘܗ݈ܝ ܗ݈ܘܳܐ ܠܘܳܬ݂ ܐܰܠܳܗܳܐ ܘܰܐܠܳܗܳܐ ܐܺܝܬ݂ܰܘܗ݈ܝ ܗ݈ܘܳܐ ܗܽܘ ܡܶܠܬ݂ܳܐ܂ ܗܳܢܳܐ ܐܺܝܬ݂ܰܘܗ݈ܝ ܗ݈ܘܳܐ ܒ݁ܪܺܫܺܝܬ݂ ܠܘܳܬ݂ ܐܰܠܳܗܳܐ܂",
      dir: "rtl",
      align: "right",
      font: "var(--font-serto)"
    }
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Switch every 8 seconds to allow full animation cycle
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid w-full">
      {texts.map((item, i) => (
        <div
          key={i}
          className="col-start-1 row-start-1 w-full"
          dir={item.dir}
          style={{ pointerEvents: index === i ? "auto" : "none" }}
        >
          <SmokyText
            text={item.content}
            isActive={index === i}
            color="#D7DBE4"
            intensity={14}
            animationMode="inPlace"
            appearTrigger="default"
            appearTransition={{ type: "tween", ease: "easeOut", duration: 2, delay: 0 }}
            font={{
              fontFamily: item.dir === "rtl" ? "'SertoAntochBible_2020_Release', var(--font-serto), serif" : "inherit",
              fontSize: "inherit",
              fontWeight: "inherit",
              lineHeight: "inherit",
              letterSpacing: "inherit",
              textAlign: item.align
            }}
          />
        </div>
      ))}
    </div>
  );
}
