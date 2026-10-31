"use client";
import Image from "next/image";
import { socialLinks } from "./config";
import { TypeAnimation } from "react-type-animation";
import { NowPlaying } from "./components/NowPlaying";
import { SpotifyTopTracks } from "./components/SpotifyTopTracks";
import { motion } from "framer-motion";
import { SectionLabel } from "./components/SectionLabel";

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
        
        <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="mb-8 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-apple-accent/20 to-white/10 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500" />
          <Image
            src="/myprofile.jpg"
            alt="Profile photo"
            className="rounded-full ring-1 ring-white/10 shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-500 relative"
            unoptimized
            width={120}
            height={120}
            priority
          />
        </a>

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

      {/* Music Section */}
      <section className="mt-12 flex flex-col items-center w-full">
        <div className="w-full max-w-3xl glass-card p-6 sm:p-8">
          <SectionLabel className="!mb-6 text-center">Music</SectionLabel>
          <div className="flex flex-col gap-8">
            <NowPlaying />
            <SpotifyTopTracks />
          </div>
        </div>
      </section>
    </div>
  );
}
