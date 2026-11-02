export type ProjectLink = { label: string; url: string };

export type ProjectStatus = "live" | "in progress";

export type Project = {
  slug: string;
  title: string;
  year: number;
  kind: "web" | "mobile";
  status: ProjectStatus;
  summary: string;
  description: string;
  stack: string[];
  links?: ProjectLink[];
  image?: string;
  tint: string;
  accent: { dark: string; light: string };
};

export const projects: Project[] = [
  {
    slug: "finance-app",
    title: "Finance App",
    year: 2026,
    kind: "web",
    status: "live",
    summary:
      "a household budget that shows what's safe to spend after every bill and goal.",
    description:
      "A household finance app built around one loop: plan the month, see what's safe to spend after every expense and savings commitment, and track plan against actual as the month goes. Households have owners and members, and it installs as a PWA.",
    stack: ["Next.js", "Supabase", "Drizzle", "TanStack Query"],
    links: [
      { label: "Live", url: "https://finance-app-wluh-eight.vercel.app" },
    ],
    tint: "#2b4f6e",
    accent: { dark: "#8fae86", light: "#123351" },
  },
  {
    slug: "fitlevelup",
    title: "FitLevelUp",
    year: 2026,
    kind: "web",
    status: "live",
    summary: "workouts and runs, played like an RPG. xp, quests, streaks.",
    description:
      "A gamified fitness tracker. Log gym sessions and runs, earn XP, level up, clear daily and weekly quests, unlock achievements and keep a daily streak alive.",
    stack: ["Next.js", "MongoDB", "Better Auth", "TanStack Query"],
    links: [
      { label: "Live", url: "https://fit-level-up-black.vercel.app" },
      { label: "GitHub", url: "https://github.com/sidadrian3/fit_level_up" },
    ],
    tint: "#5d7400",
    accent: { dark: "#d1ff1a", light: "#5b6e00" },
  },
  {
    slug: "apartment-system",
    title: "Apartment System",
    year: 2026,
    kind: "web",
    status: "in progress",
    summary: "rent and metered water billing for a small rental property.",
    description:
      "A management system for a small rental property: billing cycles for rent and metered water, payments made outside the app and confirmed by staff, and email reminders, with admin, staff and tenant logins. Still in progress, so the code stays private.",
    stack: ["Next.js", "NestJS", "Supabase", "Resend"],
    tint: "#1e3a8a",
    accent: { dark: "#8fa4ec", light: "#1e3a8a" },
  },
];
