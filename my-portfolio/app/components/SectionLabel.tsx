import React from "react";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <h3
      className={`font-mono text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-8 ${className}`}
    >
      {children}
    </h3>
  );
}
