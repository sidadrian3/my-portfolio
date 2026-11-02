import type { ContributionCalendar, ContributionDay } from "./github";

export type Streak = { length: number; from: string | null; to: string | null };
export type ContributionSummary = {
  total: number;
  current: Streak;
  longest: Streak;
  best: { date: string; count: number } | null;
};

const NO_STREAK: Streak = { length: 0, from: null, to: null };

function streakOf(days: ContributionDay[], start: number, end: number): Streak {
  return { length: end - start + 1, from: days[start].date, to: days[end].date };
}

function currentStreak(days: ContributionDay[]): Streak {
  let end = days.length - 1;
  // Today may not have happened yet, so a zero today doesn't break the streak.
  if (end >= 0 && days[end].count === 0) end--;
  let start = end;
  while (start >= 0 && days[start].count > 0) start--;
  return end > start ? streakOf(days, start + 1, end) : NO_STREAK;
}

function longestStreak(days: ContributionDay[]): Streak {
  let longest = NO_STREAK;
  let start = -1;
  for (let i = 0; i <= days.length; i++) {
    const active = i < days.length && days[i].count > 0;
    if (active && start < 0) start = i;
    if (!active && start >= 0) {
      if (i - start > longest.length) longest = streakOf(days, start, i - 1);
      start = -1;
    }
  }
  return longest;
}

function bestDay(days: ContributionDay[]): ContributionSummary["best"] {
  let best: ContributionSummary["best"] = null;
  for (const day of days) {
    if (day.count > (best?.count ?? 0)) best = { date: day.date, count: day.count };
  }
  return best;
}

export function summarizeCalendar(calendar: ContributionCalendar): ContributionSummary {
  const days = calendar.weeks.flatMap((week) => week.days);
  return {
    total: calendar.total,
    current: currentStreak(days),
    longest: longestStreak(days),
    best: bestDay(days),
  };
}
