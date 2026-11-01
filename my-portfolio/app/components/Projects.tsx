"use client";

import React, { useState } from "react";
import Link from "next/link";
import { projects } from "./project-data";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowUpRight, FiChevronDown } from "react-icons/fi";
import { SectionLabel } from "./SectionLabel";

function ProjectCard({ project }: { project: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="glass-card p-5 cursor-pointer transition-colors hover:bg-white/[0.05]"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-medium text-white/90 mb-1">{project.title}</h3>
          <p className="text-sm text-white/50">{project.year}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 bg-white/[0.06] border border-white/[0.08] text-white/40 text-[10px] tracking-wide rounded-full uppercase">
            {project.category}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-white/40"
          >
            <FiChevronDown />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-white/[0.06] mt-4">
              <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                {project.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white/[0.03] border border-white/[0.05] rounded-md font-mono text-[11px] text-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {project.links && project.links.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-6">
                  {project.links.map((link: any, index: number) => (
                    <Link
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-mono text-white/50 hover:text-white transition-colors duration-200"
                      onClick={(e) => e.stopPropagation()} // Prevent card closing when clicking link
                    >
                      {link.label}
                      <FiArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Projects() {
  return (
    <section>
      <SectionLabel>Projects</SectionLabel>

      <div className="flex flex-col gap-4">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </section>
  );
}
