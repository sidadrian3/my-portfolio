"use client";
import Image from "next/image";
import { socialLinks } from "./config";
import { useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { NowPlaying } from "./components/NowPlaying";
import { SpotifyTopTracks } from "./components/SpotifyTopTracks";

export default function Page() {
  // const [src, setSrc] = useState("/myprofile.jpg"); // Default to the main image

  return (
    <section className=" bg-black rounded-md p-4 flex flex-col h-full">
      <div className="flex-1">
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
        <h1 className="mb-8 text-3xl font-medium text-center sm:text-left">
          <TypeAnimation
            sequence={[
              "Hello there,",
              1000,
              "Hello there, I'm Sid Adrian B. Digamon",
              1000,
            ]}
            wrapper="span"
            speed={50}
            repeat={0}
            className="text-white"
          />
        </h1>
        <div className="prose prose-neutral prose-invert !text-white">
          <p>
            I'm a graduate of Ateneo de Davao University with a degree in Computer
            Science. Living life, finding purpose. May opportunities come, or
            I'll find it, whichever come first.
          </p>
        </div>
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Music</h2>
            <NowPlaying />
            <SpotifyTopTracks />
          </div>
      </div>
    </section>
  );
}
