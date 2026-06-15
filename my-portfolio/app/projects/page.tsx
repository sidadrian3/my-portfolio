"use client";

import React, { useState } from "react";
import Link from "next/link";
import { projects } from "./project-data";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

export default function Projects() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section>
      <h2 className="font-mono text-sm uppercase text-neutral-400 tracking-widest mb-8">
        [01] Projects
      </h2>

      <div className="flex flex-col border-t border-neutral-800">
        {projects.map((project, index) => {
          const isHovered = hoveredIndex === index;
          const displayIndex = String(index + 1).padStart(2, "0");

          return (
            <div
              key={index}
              className="group border-b border-neutral-800 py-6"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Header Row */}
              <div className="flex items-start justify-between cursor-default">
                <div className="flex gap-6 sm:gap-8">
                  <span className="font-mono text-sm text-neutral-500 mt-0.5">
                    {displayIndex}
                  </span>
                  <h3
                    className={`text-base sm:text-lg font-medium transition-colors duration-300 ${
                      isHovered ? "text-white" : "text-neutral-400"
                    }`}
                  >
                    {project.title}
                  </h3>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="font-mono text-sm text-neutral-500">
                    {project.year}
                  </span>
                  <div className="px-1 border border-neutral-800 rounded font-mono text-[10px] sm:text-xs text-neutral-500 uppercase">
                    [{project.category}]
                  </div>
                </div>
              </div>

              {/* Expandable Content */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: isHovered ? "auto" : 0,
                  opacity: isHovered ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pl-10 sm:pl-12 pr-4 pt-4 pb-2">
                  <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 border border-neutral-800 rounded font-mono text-[11px] text-neutral-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {project.links && project.links.length > 0 && (
                    <div className="flex flex-wrap gap-4 mt-6">
                      {project.links.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors duration-200"
                        >
                          {link.label}
                          <FiArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
