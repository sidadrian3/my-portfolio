"use client";

import { useRef } from "react";
import { useRevealOnce } from "./useRevealOnce";

export function RevealOnce({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const phase = useRevealOnce(frame);

  return (
    <div ref={frame} className={className} data-reveal={phase}>
      {children}
    </div>
  );
}
