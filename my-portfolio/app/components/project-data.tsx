export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  title: string;
  year: number;
  description: string;
  url?: string;
  category: string;
  tags: string[];
  links?: ProjectLink[];
  color: string;
}

export const projects: Project[] = [
  {
    title: "ADTO",
    year: 2025,
    category: "WEB",
    description:
      "A centralized platform for discovering and joining Ateneo de Davao University events, built under SAMAHAN Systems Development. Contributed as a back-end developer on the Admin team.",
    tags: ["React", "NestJS", "PostgreSQL"],
    links: [
      { label: "Website", url: "https://samahan.addu.edu.ph/adto/home" },
      {
        label: "Facebook",
        url: "https://www.facebook.com/SAMAHANSysDev/posts/pfbid0jgTfXinNpboBdi5GRC2oGFjcGzEur75wXVnfCoZHpVYxrGTai7n1HZ49KKnvFM7vl",
      },
    ],
    color: "#3b82f6", // blue-500
  },
  {
    title: "Food Ordering Inventory Management System",
    year: 2024,
    category: "MOBILE",
    description:
      "Designed and developed a food ordering and inventory management system for 'Lyla's Cakes, Pastries, and Breads' as part of System Analysis and Design II.",
    tags: ["React Native", "Supabase", "PostgreSQL"],
    links: [
      { label: "GitHub", url: "https://github.com/JamesManon-og/FoodOrdering" }
    ],
    color: "#8b5cf6", // violet-500
  },
  {
    title: "Project Management System",
    year: 2024,
    category: "WEB",
    description:
      "Collaborated on a project management system for an enterprise client (under NDA), I worked mostly back-end development.",
    tags: ["Next.js", "Nest.js"],
    links: [
      { label: "GitHub", url: "https://github.com" }
    ],
    color: "#10b981", // emerald-500
  },
];
