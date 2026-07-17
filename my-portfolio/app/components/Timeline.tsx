"use client";
import React from "react";
import { motion } from "framer-motion";
import { timelineData } from "./timeline-data";
import { SectionLabel } from "./SectionLabel";


export function Timeline() {
  return (
    <div>
      <section>
        <SectionLabel>Chronicle</SectionLabel>

        <div className="flex flex-col">
          {timelineData.map((item, index) => (
            <motion.div key={index}
              className="relative pl-6 pb-12 group last:pb-0"
              whileHover="hover"
              initial="initial">
              {/* Vertical Line */}
              {index !== timelineData.length - 1 && (
                <div className="absolute left-[5px] top-6 bottom-0 w-[1px] bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
              )}

              {/* Circle Marker */}
              <motion.div className="absolute left-0 top-1.5 h-3 w-3 rounded-full border border-neutral-600 bg-black"
                variants={{
                  initial: { scale: 1, backgroundColor: "#000" },
                  hover: {
                    scale: 1.3,
                    backgroundColor: item.color || "#fff",
                    borderColor: item.color || "#fff",
                    boxShadow: `0 0 10px ${item.color || "#fff"}80`
                  }
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }} />

              {/* Content */}
              <motion.div className="flex flex-col gap-1"
                variants={{
                  initial: { x: 0 },
                  hover: { x: 4 }
                }}>
                <span className="font-mono text-xs text-white/30 tracking-wide">
                  {item.year} <span className="uppercase opacity-70">[{item.tag}]</span>
                </span>
                <h3 className="text-xl font-medium text-white/90 mt-1 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed max-w-xl">
                  {item.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
