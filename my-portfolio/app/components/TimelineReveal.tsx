"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "play" | "done";

export function TimelineReveal({ children }: { children: React.ReactNode }) {
  const frame = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");

  // Same idea as the contribution wave: play once, the first time it is mostly on screen.
  useEffect(() => {
    const element = frame.current;
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
      { threshold: 0.3 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frame} data-reveal={phase}>
      {children}
    </div>
  );
}
