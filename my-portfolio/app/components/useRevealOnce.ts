"use client";

import { useEffect, useState } from "react";

export type RevealPhase = "idle" | "play" | "done";

// Play once, the first time the element is mostly on screen.
export function useRevealOnce(ref: React.RefObject<Element | null>, threshold = 0.3): RevealPhase {
  const [phase, setPhase] = useState<RevealPhase>("idle");

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setPhase("done");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setPhase("play");
        observer.disconnect();
      },
      { threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return phase;
}
