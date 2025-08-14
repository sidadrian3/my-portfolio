export default function TechStack() {
  return (
    <div className="gap-6 mt-8">
      <h3 className="text-2xl text-center font-bold tracking-tight mb-6">
        Tech Stack
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-black p-2 rounded-lg">
        <div className="transition-transform transform hover:scale-150 flex flex-col items-center justify-center p-10 h-26">
          <img
            alt="Java"
            loading="lazy"
            width="52"
            height="52"
            decoding="async"
            className="mb-2"
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg"
          />
          <span className="text-xs text-center font-bold ">Java</span>
        </div>
        <div className="transition-transform transform hover:scale-150 flex flex-col items-center justify-center p-10 h-36">
          <img
            alt="JavaScript"
            loading="lazy"
            width="52"
            height="52"
            decoding="async"
            className="mb-2"
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
          />
          <span className="text-xs text-center font-bold">JavaScript</span>
        </div>
        <div className="transition-transform transform hover:scale-150 flex flex-col items-center justify-center p-10 h-36">
          <img
            alt="React"
            loading="lazy"
            width="52"
            height="52"
            decoding="async"
            className="mb-2"
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
          />
          <span className="text-xs text-center font-bold">React</span>
        </div>
        <div className="transition-transform transform hover:scale-150 flex flex-col items-center justify-center p-10 h-36">
          <img
            alt="Tailwind"
            loading="lazy"
            width="52"
            height="52"
            decoding="async"
            className="mb-2"
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg"
          />
          <span className="text-xs text-center font-bold">Tailwind</span>
        </div>
        <div className="transition-transform transform hover:scale-150 flex flex-col items-center justify-center p-10 h-36">
          <img
            alt="Supabase"
            loading="lazy"
            width="52"
            height="52"
            decoding="async"
            className="mb-2"
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg"
          />
          <span className="text-xs text-center font-bold">Supabase</span>
        </div>
        <div className="transition-transform transform hover:scale-150 flex flex-col items-center justify-center p-10 h-36">
          <img
            alt="NestJS"
            loading="lazy"
            width="52"
            height="52"
            decoding="async"
            className="mb-2"
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg"
          />
          <span className="text-xs text-center font-bold">Nest.js</span>
        </div>
        <div className="transition-transform transform hover:scale-150 flex flex-col items-center justify-center p-10 h-36">
          <img
            alt="PostgreSQL"
            loading="lazy"
            width="52"
            height="52"
            decoding="async"
            className="mb-2"
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg"
          />
          <span className="text-xs text-center font-bold">PostgreSQL</span>
        </div>
        <div className="transition-transform transform hover:scale-150 flex flex-col items-center justify-center p-10 h-36">
          <img
            alt="Next.js"
            loading="lazy"
            width="52"
            height="52"
            decoding="async"
            className="mb-2"
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg"
          />
          <span className="text-xs text-center font-bold">Next.js</span>
        </div>
      </div>
    </div>
  );
}
