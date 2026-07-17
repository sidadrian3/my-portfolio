import React from "react";
import { Timeline } from "../components/Timeline";
import { Projects as ProjectsComponent } from "../components/Projects";
import { ImageGrid } from "app/components/image-grid";

export const metadata = {
  title: "About | Portfolio",
  description: "Learn more about me, my experience, and my projects.",
};

export default function About() {
  return (
    <section className="bg-black rounded-md p-4 sm:p-8 flex flex-col h-full gap-8">
      <div>
        <h3 className="mb-8 text-5xl font-extrabold">About Me</h3>
        <p className="text-neutral-400 text-xl leading-relaxed mb-2">
          An aspiring developer always eager to learn and build things that matter.
          This is all about me.
        </p>
        <div className="p-4">
          <ImageGrid
            columns={3}
            images={[
              { src: "/photos/photo1.jpg", alt: "Roman columns" },
              { src: "/photos/photo2.jpg", alt: "Big Ben" },
              { src: "/photos/photo3.jpg", alt: "Sacré-Cœur Basilica" },
            ]}
            viewMoreHref="/photos"
          />
        </div>

        {/* Timeline Section */}
        <Timeline />
      </div>

      <div>
        {/* Projects Section */}
        <ProjectsComponent />
      </div>
    </section>
  );
}
