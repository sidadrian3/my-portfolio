export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  title: string;
  year: number;
  description: string;
  url: string;
  links?: ProjectLink[];
}

export const projects: Project[] = [
  {
    title: "ADTO",
    year: 2025,
    description:
      "A centralized platform for discovering and joining Ateneo de Davao University events, built under SAMAHAN Systems Development. Contributed as a back-end developer on the Admin team",
    url: "https://samahan.addu.edu.ph/adto/home",
    links: [
      { label: "Website", url: "https://samahan.addu.edu.ph/adto/home" },
      {
        label: "Facebook",
        url: "https://www.facebook.com/SAMAHANSysDev/posts/pfbid0jgTfXinNpboBdi5GRC2oGFjcGzEur75wXVnfCoZHpVYxrGTai7n1HZ49KKnvFM7vl",
      },
    ],
  },
  // {
  //   title: "Mithril AI",
  //   year: 2024,
  //   description: "Open science AI resarch lab",
  //   url: "https://github.com/mithrilai",
  // },
  // {
  //   title: "OpenDeepLearning",
  //   year: 2023,
  //   description: "Open source AI education resources",
  //   url: "https://opendeeplearning.xyz/",
  // },
  {
    title: "Food Ordering Inventory Management System",
    year: 2024,
    description: "Designed and developed a food ordering and inventory management system for 'Lyla's Cakes, Pastries, and Breads' as part of System Analysis and Design II. Developed using React Native, Supabase, and PostgreSQL",
    url: "https://github.com/JamesManon-og/FoodOrdering",
  },
  {
    title: "Project Management System",
    year: 2024,
    description: "Collaborated on a project management system for an enterprise client (under NDA),  I worked mostly back-end development, using Next.js and Nest.js",
    url: "https://github.com",
  },
];
