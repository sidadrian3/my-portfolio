export interface Project {
  title: string;
  year: number;
  description: string;
  url: string;
}

export const projects: Project[] = [
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
    description: "Designed and developed a food ordering and inventory management system for 'Lyla’s Cakes, Pastries, and Breads' as part of System Analysis and Design II. Developed using React Native, Supabase, and PostgreSQL",
    url: "https://github.com/JamesManon-og/FoodOrdering",
  },
  {
    title: "Project Management System",
    year: 2024,
    description: "Collaborated on a project management system for an enterprise client (under NDA),  I worked mostly back-end development, using Next.js and Nest.js",
    url: "https://github.com",
  },
];
