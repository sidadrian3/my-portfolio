"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const FRAME_MS = 20;
const RESOLVE_PER_FRAME = 2;
const LETTERS = "abcdefghijklmnopqrstuvwxyz";

function frameText(text: string, resolved: number) {
  return Array.from(text, (char, index) =>
    index < resolved || char === " "
      ? char
      : LETTERS[Math.floor(Math.random() * LETTERS.length)],
  ).join("");
}

export function useScramble(text: string) {
  const [display, setDisplay] = useState(text);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearInterval(timer.current);
    },
    [],
  );

  const scramble = useCallback(() => {
    if (timer.current !== null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let resolved = 0;
    timer.current = window.setInterval(() => {
      resolved += RESOLVE_PER_FRAME;
      if (resolved >= text.length) {
        window.clearInterval(timer.current!);
        timer.current = null;
        setDisplay(text);
        return;
      }
      setDisplay(frameText(text, resolved));
    }, FRAME_MS);
  }, [text]);

  return { display, scramble };
}
