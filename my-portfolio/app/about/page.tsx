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
    <section className="flex flex-col h-full gap-16">
      <div className="pt-8">
        <h3 className="mb-6 text-5xl font-thin tracking-tight text-white">About Me</h3>
        <p className="text-white/60 text-lg leading-loose max-w-2xl">
          An aspiring developer always eager to learn and build things that matter.
          This is all about me.
        </p>
        <div className="py-8">
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
