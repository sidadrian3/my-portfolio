"use client";

import { useEffect, useState } from "react";

const DELAY_MS = 200;
const DURATION_MS = 1000;

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

// Counts 0 -> target once `play` turns true; otherwise (and under reduced motion) the final value.
export function useCountUp(target: number, play: boolean): number {
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    if (!play) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let frame = 0;
    const start = performance.now() + DELAY_MS;
    const tick = (now: number) => {
      const progress = Math.min(Math.max((now - start) / DURATION_MS, 0), 1);
      setValue(Math.round(target * easeOutCubic(progress)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    setValue(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [play, target]);

  if (!play) return target;
  return value ?? 0;
}
