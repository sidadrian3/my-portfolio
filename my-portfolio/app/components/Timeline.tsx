"use client";
import React from "react";
import { motion } from "framer-motion";

export const timelineData = [
  {
    year: "2020",
    tag: "EDU",
    title: "Brokenshire College of Toril",
    description:
      "STEM strand — foundation in mathematics, sciences, and logical thinking.",
  },
  {
    year: "2022",
    tag: "EDU",
    title: "BS Computer Science — Ateneo de Davao University",
    description:
      "Undergraduate journey: algorithms, data structures, and software engineering.",
  },
  {
    year: "2024",
    tag: "EXP",
    title: "FoodOrdering and Inventory Management System",
    description:
      "Built a FoodOrdering Inventory Management System for Lyla's cakes, pastries, and breads",
  },
  {
    year: "2025",
    tag: "EXP",
    title: "Internship at Orange & Bronze",
    description:
      "Became an intern at Orange & Bronze, a software company based in Makati, Metro Manila.",
  },
  {
    year: "2025",
    tag: "EXP",
    title: "Back-end developer for SAMAHAN Systems and Development",
    description:
      "Became the back-end developer for SAMAHAN Systems and Development, and one of the developers for ADTO website.",
  },
  {
    year: "2026",
    tag: "EXP",
    title: "BANSAG",
    description:
      "Start-up led by fresh graduates, seeking to build systems for the community.",
  },
];

export function Timeline() {
  return (
    <motion.div whileHover={{
      scale: 1.03
    }}>
      <section>
        <h3 className="font-mono text-2xl uppercase text-neutral-400 tracking-widest mb-4">
          [01] Chronicle
        </h3>

        <div className="flex flex-col">
          {timelineData.map((item, index) => (
            <motion.div key={index}
              className="relative pl-6 pb-12 group last:pb-0"
              whileHover="hover"
              initial="initial">
              {/* Vertical Line */}
              {index !== timelineData.length - 1 && (
                <div className="absolute left-[5px] top-6 bottom-0 w-[1px] bg-neutral-800" />
              )}

              {/* Circle Marker */}
              <motion.div className="absolute left-0 top-1.5 h-3 w-3 rounded-full border border-neutral-600 bg-black"
                variants={{
                  initial: { scale: 1, backgroundColor: "#000" },
                  hover: { scale: 1.3, backgroundColor: "#fff", borderColor: "#fff" }
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }} />

              {/* Content */}
              <motion.div className="flex flex-col gap-1"
                variants={{
                  initial: { x: 0 },
                  hover: { x: 8 }
                }}>
                <span className="font-mono text-base text-neutral-500">
                  {item.year} [{item.tag}]
                </span>
                <h3 className="text-xl font-medium text-neutral-100 mt-1 mb-1">
                  {item.title}
                </h3>
                <p className="text-base text-neutral-400 max-w-xl">
                  {item.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
