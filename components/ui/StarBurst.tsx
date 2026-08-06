"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/**
 * StarBurst — a radial explosion of light from a focal point on the canvas.
 *
 * `starCount` evenly-spaced angular spokes radiate outward; along each spoke a
 * column of small bright pulses travels from the centre outward, twinkling as
 * it goes. A soft radial bloom sits at the focal point, layered behind the
 * pulses for a glowing core.
 *
 * Each frame paints back to front:
 *   1. the opaque base colour
 *   2. (additive) the centre bloom
 *   3. (additive) the per-spoke pulses, drawn as thin streaks oriented along
 *      their spoke with a motion-blur gradient (transparent trailing → bright
 *      leading) so overlapping streaks read as continuous rays
 *
 * Spawn phases are seeded (Mulberry32, seed 0xBADF00D) so the burst pattern is
 * identical on every reload; motion is rAF-driven and time-based.
 *
 * Adapted from the Originkit Framer component. Two changes carry over into
 * this codebase: the base colour is a prop rather than hard black, so the
 * canvas can sit on a brand ground instead of replacing it; and a reader who
 * has asked for reduced motion gets a single warmed-up still instead of the
 * loop.
 */

/* Parsed once per colour change, never per frame. */
function parseColor(input: string): [number, number, number] {
  if (!input) return [255, 255, 255];
  const s = input.trim();
  if (s.startsWith("#")) {
    let hex = s.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    const num = parseInt(hex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }
  const m = s.match(/rgba?\(([^)]+)\)/i);
  if (m) {
    const parts = m[1].split(",").map((p) => parseFloat(p.trim()));
    return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
  }
  return [255, 255, 255];
}

/* A fixed seed makes the per-spoke phase offsets identical across reloads. */
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type StarBurstProps = {
  /* Authored as whole-number sliders; divided back to working ranges below. */
  speed?: number;
  starCount?: number;
  color?: string;
  centerX?: number;
  centerY?: number;
  starSize?: number;
  opacity?: number;
  flowerIntensity?: number;
  twinkleSpeed?: number;
  /* The opaque ground the burst is painted on. */
  background?: string;
  className?: string;
  style?: CSSProperties;
};

export default function StarBurst({
  speed = 10,
  starCount = 100,
  color = "#FFFFFF",
  centerX = 50,
  centerY = 100,
  starSize = 12,
  opacity = 50,
  flowerIntensity = 10,
  twinkleSpeed = 4,
  background = "#000000",
  className,
  style,
}: StarBurstProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cStar = parseColor(color);
    const cBase = parseColor(background);

    /* Mapping factors: ÷20 for the 0.05-step knobs, ÷100 for the 0.01-step
       (0..1) knobs, ÷10 for the 0.1-step knobs. */
    const safeSpeed = Math.max(0, speed / 10);
    const safeCenterX = Math.max(0, Math.min(1, centerX / 100));
    const safeCenterY = Math.max(0, Math.min(1, centerY / 100));
    const safeStarSize = Math.max(0.01, starSize / 20);
    const safeOpacity = Math.max(0, Math.min(1, opacity / 100));
    const safeFlowerIntensity = Math.max(0, flowerIntensity / 20);
    const safeTwinkleSpeed = Math.max(0, twinkleSpeed / 20);

    const rng = makeRng(0xbadf00d);

    /* Total particles are capped for safety; spoke count wins over pulses per
       spoke, since the spoke count is the shape of the burst. */
    const pulsesPerSpoke = 15;
    const MAX_TOTAL = 5000;
    const nSpokes = Math.max(0, Math.floor(starCount));
    let perSpoke = pulsesPerSpoke;
    if (nSpokes * perSpoke > MAX_TOTAL) {
      perSpoke = Math.max(1, Math.floor(MAX_TOTAL / Math.max(1, nSpokes)));
    }
    const particleCount = nSpokes * perSpoke;

    /* Spoke angles, with a little jitter so spokes never twinkle in lockstep. */
    const spokeCos = new Float32Array(nSpokes);
    const spokeSin = new Float32Array(nSpokes);
    for (let i = 0; i < nSpokes; i++) {
      const angle = (i / Math.max(1, nSpokes)) * Math.PI * 2 + (rng() - 0.5) * 0.02;
      spokeCos[i] = Math.cos(angle);
      spokeSin[i] = Math.sin(angle);
    }

    /* Structure-of-arrays keeps the per-frame loop cache-friendly. */
    const pSpokeIdx = new Uint16Array(particleCount);
    const pT = new Float32Array(particleCount);
    const pSpeed = new Float32Array(particleCount);
    const pSize = new Float32Array(particleCount);
    const pPhase = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      pSpokeIdx[i] = i % nSpokes;
      /* Spread across the whole spoke so the first frame is already a full
         burst rather than a knot of points at the centre. */
      pT[i] = -0.05 + rng() * 1.1;
      pSpeed[i] = (0.5 + rng() * 1.0) * 0.25;
      pSize[i] = 0.7 + rng() * 0.8;
      pPhase[i] = rng() * Math.PI * 2;
    }

    /* The streak gradient is baked once into a tiny offscreen canvas and
       blitted per particle. Building it per particle instead means thousands
       of short-lived gradients and rgba() strings every frame, and the GC
       churn from that is what makes this kind of effect stutter. */
    const SPRITE_LEN = 64;
    const streak = document.createElement("canvas");
    streak.width = SPRITE_LEN;
    streak.height = 2;
    const sctx = streak.getContext("2d");
    if (sctx) {
      const g = sctx.createLinearGradient(0, 0, SPRITE_LEN, 0);
      g.addColorStop(0, `rgba(${cStar[0]},${cStar[1]},${cStar[2]},0)`);
      g.addColorStop(0.7, `rgba(${cStar[0]},${cStar[1]},${cStar[2]},0.6)`);
      g.addColorStop(1, `rgba(${cStar[0]},${cStar[1]},${cStar[2]},1)`);
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, SPRITE_LEN, 2);
    }

    const resize = (entry?: ResizeObserverEntry) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cr = entry?.contentRect;
      const rectW = cr?.width || container.clientWidth || container.getBoundingClientRect().width;
      const rectH = cr?.height || container.clientHeight || container.getBoundingClientRect().height;
      const w = Math.max(1, Math.floor(rectW) || 800);
      const h = Math.max(1, Math.floor(rectH) || 600);
      sizeRef.current = { w, h, dpr };
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver((entries) => resize(entries[0]));
    ro.observe(container);

    /* Accumulated separately from the clamped dt, so twinkles stay smooth
       across a dropped frame. */
    let timeSec = 0;

    const drawFrame = (deltaSec: number) => {
      const { w, h, dpr } = sizeRef.current;
      const dt = Math.max(0.001, Math.min(0.05, deltaSec));
      timeSec += dt;
      if (w < 2 || h < 2) return;

      const cx = safeCenterX * w;
      const cy = safeCenterY * h;
      /* The diagonal, so spokes still reach the far corner when the focal
         point sits in one of them. */
      const R = Math.sqrt(w * w + h * h);

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `rgb(${cBase[0]},${cBase[1]},${cBase[2]})`;
      ctx.fillRect(0, 0, w, h);

      /* Everything from here is additive. */
      ctx.globalCompositeOperation = "lighter";

      /* The bloom, behind the pulses so the spokes appear to leave it. */
      const bloomAlpha = safeFlowerIntensity * safeOpacity;
      if (bloomAlpha > 0.001) {
        const minDim = Math.min(w, h);
        const bloomR = Math.max(
          8,
          minDim * 0.18 * (safeFlowerIntensity * 0.5 + 0.5) * (0.6 + safeStarSize * 0.4)
        );
        const a = Math.min(1, bloomAlpha);
        const fGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, bloomR);
        fGrad.addColorStop(0, `rgba(${cStar[0]},${cStar[1]},${cStar[2]},${a})`);
        fGrad.addColorStop(0.3, `rgba(${cStar[0]},${cStar[1]},${cStar[2]},${a * 0.5})`);
        fGrad.addColorStop(0.7, `rgba(${cStar[0]},${cStar[1]},${cStar[2]},${a * 0.15})`);
        fGrad.addColorStop(1, `rgba(${cStar[0]},${cStar[1]},${cStar[2]},0)`);
        ctx.fillStyle = fGrad;
        ctx.fillRect(cx - bloomR, cy - bloomR, bloomR * 2, bloomR * 2);
      }

      for (let i = 0; i < particleCount; i++) {
        /* Past the outer edge a pulse respawns just behind the centre, so the
           emission never visibly restarts. */
        pT[i] += pSpeed[i] * safeSpeed * dt;
        if (pT[i] > 1.1) {
          pT[i] = -0.05 - rng() * 0.05;
          pSize[i] = 0.7 + rng() * 0.8;
          pPhase[i] = rng() * Math.PI * 2;
        }

        const t = pT[i];
        if (t < 0 || t >= 1.0) continue;

        /* Never below 70%, so a pulse dims rather than disappears. */
        const twinkle = 0.7 + 0.3 * Math.sin(timeSec * safeTwinkleSpeed * 6 + pPhase[i]);

        /* Quick fade in, full brightness across the body, fast fade at the
           very end — so the rays stay vivid almost to the edge. */
        let fade: number;
        if (t < 0.06) fade = t / 0.06;
        else if (t < 0.85) fade = 1;
        else fade = 1 - (t - 0.85) / 0.15;

        const a = Math.min(1, twinkle * fade * (1 + 0.5 * t) * safeOpacity);
        if (a < 0.005) continue;

        const dist = t * R;
        const sIdx = pSpokeIdx[i];
        const cosA = spokeCos[sIdx];
        const sinA = spokeSin[sIdx];

        const px = cx + cosA * dist;
        const py = cy + sinA * dist;
        const speedFactor = pSpeed[i] / 0.25;
        const lineLen = (8 + 12 * speedFactor) * (0.7 + 0.6 * pSize[i] * safeStarSize);

        /* Orient the baked sprite along the spoke with one transform — no
           save/restore, no per-particle gradient. */
        ctx.setTransform(dpr * cosA, dpr * sinA, -dpr * sinA, dpr * cosA, dpr * px, dpr * py);
        ctx.globalAlpha = a;
        ctx.drawImage(streak, -lineLen, -0.5, lineLen, 1);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;
    };

    /* Reduced motion gets the picture, not the loop: warm it up so the still
       shows pulses mid-flight rather than a knot of new ones at the centre. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (let i = 0; i < 60; i++) drawFrame(1 / 60);
      return () => ro.disconnect();
    }

    let lastT = performance.now();
    const loop = (t: number) => {
      const deltaSec = (t - lastT) / 1000;
      lastT = t;
      drawFrame(deltaSec);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [
    speed,
    starCount,
    color,
    centerX,
    centerY,
    starSize,
    opacity,
    flowerIntensity,
    twinkleSpeed,
    background,
  ]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
