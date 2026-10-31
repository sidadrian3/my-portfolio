"use client";
import Image from "next/image";
import { socialLinks } from "./config";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import { Section } from "./components/Section";
import { OnRepeat } from "./components/OnRepeat";

export default function Page() {
  return (
    <div className="flex flex-col w-full h-full">
      {/* Cinematic Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[70vh] pt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute -z-10 w-full max-w-2xl aspect-square rounded-full bg-apple-accent/5 blur-[100px]"
        />
        
        <Image
          src="/myprofile.jpg"
          alt="Sid Adrian Digamon"
          className="mb-8 rounded-full ring-1 ring-white/10 shadow-2xl"
          unoptimized
          width={120}
          height={120}
          priority
        />

        <h1 className="mb-6 text-5xl sm:text-6xl md:text-7xl font-thin tracking-[-0.02em] text-center text-white">
          <TypeAnimation
            sequence={[
              "Hello there.",
              1000,
              "I'm Sid Adrian.",
              2000,
            ]}
            wrapper="span"
            speed={40}
            repeat={Infinity}
          />
        </h1>
        
        <div className="max-w-2xl text-center">
          <p className="text-lg sm:text-xl text-white/60 leading-relaxed font-light">
            I'm a Computer Science graduate from Ateneo de Davao University. 
            Living life, finding purpose. May opportunities come, or I'll find them, whichever comes first.
          </p>
        </div>
      </section>

      <Section label="On repeat">
        <OnRepeat />
      </Section>
    </div>
  );
}
