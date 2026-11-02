"use client";

import type { ContributionSummary, Streak } from "app/lib/contributions";
import { formatNumber } from "app/lib/format";
import type { RevealPhase } from "./useRevealOnce";
import { useCountUp } from "./useCountUp";

export type StatKey = "total" | "current" | "longest" | "best";

type Stat = { key: StatKey; value: number; label: string; unit: string; sub: string };

const dayFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const monthDay = (iso: string) => dayFormat.format(new Date(`${iso}T00:00:00Z`)).toLowerCase();

function streakRange(streak: Streak) {
  if (!streak.from || !streak.to) return "—";
  return streak.from === streak.to
    ? monthDay(streak.from)
    : `${monthDay(streak.from)} – ${monthDay(streak.to)}`;
}

function buildStats({ total, current, longest, best }: ContributionSummary): Stat[] {
  return [
    { key: "total", value: total, label: "contributions", unit: "", sub: "last 12 months" },
    {
      key: "current",
      value: current.length,
      label: "day streak",
      unit: current.length === 1 ? " day" : " days",
      sub: current.from ? `since ${monthDay(current.from)}` : "—",
    },
    {
      key: "longest",
      value: longest.length,
      label: "longest streak",
      unit: longest.length === 1 ? " day" : " days",
      sub: streakRange(longest),
    },
    {
      key: "best",
      value: best?.count ?? 0,
      label: "best day",
      unit: best?.count === 1 ? " contribution" : " contributions",
      sub: best ? monthDay(best.date) : "—",
    },
  ];
}

type StatButtonProps = {
  stat: Stat;
  index: number;
  phase: RevealPhase;
  active: StatKey | null;
  pressed: boolean;
  onPreview: (key: StatKey | null) => void;
  onToggle: (key: StatKey) => void;
  onEscape: () => void;
};

function StatButton({ stat, index, phase, active, pressed, onPreview, onToggle, onEscape }: StatButtonProps) {
  const shown = useCountUp(stat.value, phase === "play");
  const dimmed = active !== null && active !== stat.key;

  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={`${stat.label}, ${formatNumber(stat.value)}${stat.unit}, highlight on graph`}
      style={{ "--i": index } as React.CSSProperties}
      className={`ship-stat min-h-10 rounded-[4px] py-1 text-left outline-none transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
        dimmed ? "opacity-45" : ""
      }`}
      onPointerEnter={() => onPreview(stat.key)}
      onPointerLeave={() => onPreview(null)}
      onFocus={() => onPreview(stat.key)}
      onBlur={() => onPreview(null)}
      onClick={() => onToggle(stat.key)}
      onKeyDown={(event) => {
        if (event.key === "Escape") onEscape();
      }}
    >
      <span className="block text-[28px] font-[650] leading-tight tracking-[-0.03em] tabular-nums text-ink">
        {formatNumber(shown)}
      </span>
      <span className="block text-[13px] text-mute">{stat.label}</span>
      <span className="block text-[13px] text-faint">{stat.sub}</span>
    </button>
  );
}

type ShippingStatsProps = {
  summary: ContributionSummary;
  phase: RevealPhase;
  active: StatKey | null;
  pinned?: StatKey | null;
  onPreview: (key: StatKey | null) => void;
  onToggle: (key: StatKey) => void;
};

export function ShippingStats({ summary, phase, active, pinned = null, onPreview, onToggle }: ShippingStatsProps) {
  return (
    <div data-reveal={phase} className="mb-6 grid grid-cols-2 gap-5 sm:grid-cols-4">
      {buildStats(summary).map((stat, index) => (
        <StatButton
          key={stat.key}
          stat={stat}
          index={index}
          phase={phase}
          active={active}
          pressed={pinned === stat.key}
          onPreview={onPreview}
          onToggle={onToggle}
          onEscape={() => pinned && onToggle(pinned)}
        />
      ))}
    </div>
  );
}
