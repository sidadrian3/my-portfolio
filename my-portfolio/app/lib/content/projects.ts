export type ProjectLink = { label: string; url: string };

export type Project = {
  slug: string;
  title: string;
  year: number;
  kind: "web" | "mobile";
  summary: string;
  description: string;
  stack: string[];
  links?: ProjectLink[];
  image?: string;
  tint?: string;
  nda?: boolean;
};

export const projects: Project[] = [
  {
    slug: "adto",
    title: "ADTO",
    year: 2025,
    kind: "web",
    summary: "every Ateneo event in one place. back-end, admin team.",
    description:
      "A centralized platform for discovering and joining Ateneo de Davao University events, built under SAMAHAN Systems Development. I worked on the Admin team's back-end.",
    stack: ["React", "NestJS", "PostgreSQL"],
    links: [
      { label: "Website", url: "https://samahan.addu.edu.ph/adto/home" },
      {
        label: "Facebook",
        url: "https://www.facebook.com/SAMAHANSysDev/posts/pfbid0jgTfXinNpboBdi5GRC2oGFjcGzEur75wXVnfCoZHpVYxrGTai7n1HZ49KKnvFM7vl",
      },
    ],
    tint: "#1d3b6e",
  },
  {
    slug: "lylas",
    title: "Lyla's Food Ordering & Inventory",
    year: 2024,
    kind: "mobile",
    summary: "orders and stock for a real bakery, built for SAD II.",
    description:
      "A food ordering and inventory management app for Lyla's Cakes, Pastries and Breads, built for System Analysis and Design II.",
    stack: ["React Native", "Supabase", "PostgreSQL"],
    links: [
      { label: "GitHub", url: "https://github.com/JamesManon-og/FoodOrdering" },
    ],
    tint: "#5a3a1a",
  },
  {
    slug: "pms",
    title: "Project Management System",
    year: 2024,
    kind: "web",
    summary: "for an enterprise client. under NDA, so no screenshots, sorry.",
    description:
      "A project management system for an enterprise client. I worked mostly on the back-end.",
    stack: ["Next.js", "Nest.js"],
    nda: true,
  },
];
