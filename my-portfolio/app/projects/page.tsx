"use client";

import Link from "next/link";
import { projects } from "./project-data";
import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export default function Projects() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-medium">Projects</h1>

      <motion.div
        className="flex flex-col gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {projects.map((project, index) => (
          <motion.div key={index} variants={item}>
            {/* If project has multiple links, render as a non-clickable card with link buttons */}
            {project.links && project.links.length > 0 ? (
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 transition-all duration-300 hover:border-neutral-600 hover:bg-neutral-800/60">
                {/* Top row: title + year */}
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h2 className="text-[15px] font-medium text-white">
                    {project.title}
                  </h2>
                  <span className="text-xs font-medium text-neutral-500 bg-neutral-800 rounded-full px-2.5 py-0.5 shrink-0">
                    {project.year}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-neutral-400 mb-3">
                  {project.description}
                </p>

                {/* Link buttons */}
                <div className="flex flex-wrap gap-2">
                  {project.links.map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-800/80 text-neutral-300 hover:text-white hover:border-neutral-500 hover:bg-neutral-700/80 transition-all duration-200"
                    >
                      {link.label}
                      <FiExternalLink className="w-3 h-3" />
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              /* Single-link project: entire card is clickable */
              <Link
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 transition-all duration-300 hover:border-neutral-600 hover:bg-neutral-800/60"
              >
                {/* Top row: title + year */}
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h2 className="text-[15px] font-medium text-white group-hover:text-blue-400 transition-colors duration-300">
                    {project.title}
                  </h2>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-medium text-neutral-500 bg-neutral-800 rounded-full px-2.5 py-0.5">
                      {project.year}
                    </span>
                    <FiExternalLink className="w-3.5 h-3.5 text-neutral-600 group-hover:text-neutral-400 transition-colors duration-300" />
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300">
                  {project.description}
                </p>
              </Link>
            )}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
