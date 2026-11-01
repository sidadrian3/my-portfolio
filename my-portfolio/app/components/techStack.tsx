import { SectionLabel } from "./SectionLabel";
import { SpotlightCard } from "./SpotlightCard";

export default function TechStack() {
  const techStack = [
    { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Tailwind", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
    { name: "Supabase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg" },
    { name: "Nest.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg" },
    { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
    { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" },
  ];

  return (
    <div className="gap-6 mt-8">
      <SectionLabel className="text-center">Tech Stack</SectionLabel>
      <div className="glass-card p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {techStack.map((tech) => (
            <SpotlightCard key={tech.name} className="rounded-xl">
              <div className="flex flex-col items-center justify-center p-6 h-32 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 group">
                <img
                  alt={tech.name}
                  loading="lazy"
                  width="48"
                  height="48"
                  decoding="async"
                  className="mb-3 transition-transform duration-300 group-hover:scale-110"
                  src={tech.icon}
                />
                <span className="text-xs font-medium text-white/50 group-hover:text-white transition-colors">{tech.name}</span>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </div>
  );
}
