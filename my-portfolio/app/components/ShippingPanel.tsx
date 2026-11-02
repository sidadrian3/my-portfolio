"use client";

import { useRef, useState } from "react";
import type { ContributionCalendar } from "app/lib/github";
import type { ContributionSummary } from "app/lib/contributions";
import { ContributionGrid } from "./ContributionGrid";
import { ShippingStats, type StatKey } from "./ShippingStats";
import { useRevealOnce } from "./useRevealOnce";

type ShippingPanelProps = { calendar: ContributionCalendar; summary: ContributionSummary };

export function ShippingPanel({ calendar, summary }: ShippingPanelProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const phase = useRevealOnce(wrapper);
  const [preview, setPreview] = useState<StatKey | null>(null);
  const [pinned, setPinned] = useState<StatKey | null>(null);

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
      <ContributionGrid calendar={calendar} wave={phase} />
    </div>
  );
}
