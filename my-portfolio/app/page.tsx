import Image from "next/image";
import { socialLinks } from "./config";
import { useState } from "react";



export default function Page() {
  // const [src, setSrc] = useState("/myprofile.jpg"); // Default to the main image

  return (
    <section className = " bg-cyan-100 rounded-md p-4">
      <a href={socialLinks.twitter} target="_blank">
        <Image
          src="/myprofile.jpg"
          alt="Profile photo"
          className="rounded-full bg-gray-100 block lg:mt-5 mt-0 lg:mb-5 mb-10 mx-auto sm:float-right sm:ml-5 sm:mb-5 grayscale hover:grayscale-0"
          unoptimized
          width={160}
          height={160}
          priority
        />
      </a>
      <h1 className="mb-8 text-2xl font-bold text-center sm:text-left">
        Hello there, I'm Sid Adrian B. Digamon
      </h1>
      <div className="prose prose-neutral ">
        <p>
        I'm a Computer Science student based in Davao City, currently studying at Ateneo de Davao University.
        </p>
        <p>
        I’m passionate about leveraging technology to solve real-world problems. 
        Through both major and minor academic projects,
         I’ve deepened my understanding of core concepts and development practices. 
        </p>
        <p>
        I quickly adapt to new tools and environments, 
        and I’m dedicated to continuous learning, innovation, and excellence—qualities 
        that make me a strong candidate for internship opportunities.
        </p>
       
      </div>
      <div className="gap-10 mt-10 mb-10">
      <h3 className="text-2xl text-center font-bold tracking-tight mb-4">Tech Stack</h3>
        <div className = "grid grid-cols-2 gap-4">
          <div className="transition-transform transform hover:scale-105 flex flex-col items-center justify-center p-3 rounded-lg bg-[#aadbe2] h-24">
            <img
              alt="Java"
              loading="lazy"
              width="36"
              height="36"
              decoding="async"
              className="mb-2"
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg"
            />
            <span className="text-xs text-center font-bold">Java</span>
          </div>
          <div className=" transition-transform transform hover:scale-105 flex flex-col items-center justify-center p-3 rounded-lg bg-[#aadbe2] h-24">
            <img
              alt="JavaScript"
              loading="lazy"
              width="36"
              height="36"
              decoding="async"
              className="mb-2"
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
            />
            <span className="text-xs text-center font-bold">JavaScript</span>
          </div>
          <div className="transition-transform transform hover:scale-105 flex flex-col items-center justify-center p-3 rounded-lg bg-[#aadbe2] h-24">
            <img
              alt="React"
              loading="lazy"
              width="36"
              height="36"
              decoding="async"
              className="mb-2"
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
            />
            <span className="text-xs text-center font-bold">React</span>
          </div>
          <div className="transition-transform transform hover:scale-105 flex flex-col items-center justify-center p-3 rounded-lg bg-[#aadbe2] h-24">
            <img
              alt="Tailwind"
              loading="lazy"
              width="36"
              height="36"
              decoding="async"
              className="mb-2"
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg"
            />
            <span className="text-xs text-center font-bold">Tailwind</span>
          </div>
          <div className="transition-transform transform hover:scale-105 flex flex-col items-center justify-center p-3 rounded-lg bg-[#aadbe2] h-24">
            <img
              alt="Supabase"
              loading="lazy"
              width="36"
              height="36"
              decoding="async"
              className="mb-2"
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg"
            />
            <span className="text-xs text-center font-bold">Supabase</span>
          </div>
        </div>
      </div>
    </section>
  );
}
