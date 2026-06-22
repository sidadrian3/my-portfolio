"use client";

import React, { useState } from "react";
import Link from "next/link";
import { projects } from "./project-data";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

export function Projects() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}>
      <section>
        <h2 className="font-mono text-2xl uppercase text-neutral-400 tracking-widest mb-8">
          [02] Projects
        </h2>

        <div className="flex flex-col">
          {projects.map((project, index) => {
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={index}
                className="relative pl-8 pb-12 group last:pb-0"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Vertical Line */}
                {index !== projects.length - 1 && (
                  <div className="absolute left-[5px] top-6 bottom-0 w-[1px] bg-neutral-800" />
                )}

                {/* Circle Marker */}
                <motion.div
                  className="absolute left-0 top-1.5 h-3 w-3 rounded-full border border-neutral-600 bg-black"
                  animate={{
                    scale: isHovered ? 1.3 : 1,
                    backgroundColor: isHovered ? "#fff" : "#000",
                    borderColor: isHovered ? "#fff" : "#525252",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                />

                {/* Content Container */}
                <motion.div
                  className="flex flex-col"
                  animate={{ x: isHovered ? 8 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  {/* Header Row */}
                  <div className="flex items-start justify-between cursor-default">
                    <h3
                      className={`text-xl font-medium mt-1 mb-1 transition-colors duration-300 ${isHovered ? "text-white" : "text-neutral-100"
                        }`}
                    >
                      {project.title}
                    </h3>

                    <div className="flex flex-col items-end gap-1 shrink-0 ml-4">
                      <span className="font-mono text-base text-neutral-500">
                        {project.year}
                      </span>
                      <div className="px-1 border border-neutral-800 rounded font-mono text-[10px] sm:text-xs text-neutral-500 uppercase">
                        [{project.category}]
                      </div>
                    </div>
                  </div>

                  {/* Expandable Accordion Content */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: isHovered ? "auto" : 0,
                      opacity: isHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2 pb-2">
                      <p className="text-base text-neutral-400 max-w-2xl leading-relaxed">
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
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
}
