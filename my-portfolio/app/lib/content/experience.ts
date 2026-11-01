export type TimelineEntry = {
  org: string;
  role: string;
  start: string;
  end?: string;
  line: string;
  current?: boolean;
};

export const experience: TimelineEntry[] = [
  {
    org: "BANSAG",
    role: "[role]",
    start: "2026",
    line: "a startup we're planning as a group of fresh grads, building systems for our community.",
    current: true,
  },
  {
    org: "SAMAHAN Systems and Development",
    role: "Back-end developer",
    start: "2025",
    line: "one of the developers behind ADTO.",
  },
  {
    org: "Orange & Bronze",
    role: "Software engineering intern",
    start: "2025",
    line: "internship at a Makati-based software company.",
  },
];

export const education: TimelineEntry[] = [
  {
    org: "Ateneo de Davao University",
    role: "BS Computer Science",
    start: "2022",
    end: "[end]",
    line: "",
  },
  {
    org: "Brokenshire College of Toril",
    role: "Senior high, STEM strand",
    start: "2020",
    end: "[end]",
    line: "",
  },
];
