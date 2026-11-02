"use client";

import { useRef, useState } from "react";
import type { ContributionCalendar } from "app/lib/github";
import type { ContributionSummary } from "app/lib/contributions";
import { ContributionGrid, type GraphHighlight } from "./ContributionGrid";
import { ShippingStats, type StatKey } from "./ShippingStats";
import { useRevealOnce } from "./useRevealOnce";

type ShippingPanelProps = { calendar: ContributionCalendar; summary: ContributionSummary };

function highlightFor(key: StatKey | null, summary: ContributionSummary): GraphHighlight | null {
  switch (key) {
    case "total":
      return { kind: key };
    case "current":
    case "longest": {
      const { from, to } = summary[key];
      return from && to ? { kind: key, from, to } : null;
    }
    case "best":
      return summary.best ? { kind: key, date: summary.best.date } : null;
    default:
      return null;
  }
}

export function ShippingPanel({ calendar, summary }: ShippingPanelProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const phase = useRevealOnce(wrapper);
  const [preview, setPreview] = useState<StatKey | null>(null);
  const [pinned, setPinned] = useState<StatKey | null>(null);

  const shown = pinned ?? preview;
  const highlight = highlightFor(shown, summary);

  const clearHighlight = () => {
    setPreview(null);
    setPinned(null);
  };

  return (
    <div ref={wrapper}>
      <ShippingStats
        summary={summary}
        phase={phase}
        active={pinned ?? preview}
        pinned={pinned}
        onPreview={setPreview}
        onToggle={(key) => setPinned((current) => (current === key ? null : key))}
      />
      <ContributionGrid
        calendar={calendar}
        wave={phase}
        highlight={highlight}
        onPointerEnterGraph={clearHighlight}
      />
    </div>
  );
}
