export interface TimelineItem {
    year: string;
    tag: string;
    title: string;
    description: string;
    color: string;
}

export const timelineData: TimelineItem[] = [
    {
        year: "2020",
        tag: "EDU",
        title: "Brokenshire College of Toril",
        description:
            "STEM strand — foundation in mathematics, sciences, and logical thinking.",
        color: "#3b82f6", // blue-500
    },
    {
        year: "2022",
        tag: "EDU",
        title: "BS Computer Science — Ateneo de Davao University",
        description:
            "Undergraduate journey: algorithms, data structures, and software engineering.",
        color: "#8b5cf6", // violet-500
    },
    {
        year: "2024",
        tag: "EXP",
        title: "FoodOrdering and Inventory Management System",
        description:
            "Built a FoodOrdering Inventory Management System for Lyla's cakes, pastries, and breads",
        color: "#10b981", // emerald-500
    },
    {
        year: "2025",
        tag: "EXP",
        title: "Internship at Orange & Bronze",
        description:
            "Became an intern at Orange & Bronze, a software company based in Makati, Metro Manila.",
        color: "#f59e0b", // amber-500
    },
    {
        year: "2025",
        tag: "EXP",
        title: "Back-end developer for SAMAHAN Systems and Development",
        description:
            "Became the back-end developer for SAMAHAN Systems and Development, and one of the developers for ADTO website.",
        color: "#ef4444", // red-500
    },
    {
        year: "2026",
        tag: "EXP",
        title: "BANSAG",
        description:
            "Start-up led by fresh graduates, seeking to build systems for the community.",
        color: "#ec4899", // pink-500
    },
];
