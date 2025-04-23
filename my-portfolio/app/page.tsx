import Image from "next/image";
import { socialLinks } from "./config";
import { useState } from "react";

export default function Page() {
  // const [src, setSrc] = useState("/myprofile.jpg"); // Default to the main image

  return (
    <section>
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
      <h1 className="mb-8 text-2xl font-medium">
        Hello there, I'm Sid Adrian B. Digamon
      </h1>
      <div className="prose prose-neutral dark:prose-invert">
        <p>
        I'm a Computer Science student based in Davao City, currently studying at Ateneo de Davao University.
        </p>
        <p>
         I'm passionate about web development and actively polishing my skills in both front-end and back-end technologies.
        </p>
        <p>
          
        </p>
        <p>
         
        </p>
        <p>
        
        </p>
      </div>
    </section>
  );
}
