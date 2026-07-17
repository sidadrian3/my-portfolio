"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

interface ImageGridProps {
  images: {
    src: string;
    alt: string;
    href?: string;
  }[];
  columns?: 2 | 3 | 4; // Accepts 2, 3, or 4 columns
  viewMoreHref?: string;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  columns = 3,
  viewMoreHref,
}) => {
  const gridClass = {
    2: "grid-cols-2 sm:grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  }[columns];

  return (
    <section className="my-8">
      <div className="flex items-center gap-4 w-full">
        <div className={`grid ${gridClass} gap-4 flex-1`}>
          {images.map((image, index) => (
            <motion.div 
              key={index} 
              className="relative aspect-square overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.05]"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {image.href ? (
                <Link
                  target={image.href.startsWith("http") ? "_blank" : undefined}
                  rel={image.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  href={image.href}
                  className="block w-full h-full relative group"
                >
                  <Image
                    alt={image.alt}
                    src={image.src}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    priority
                    className="object-cover transition-all duration-500 group-hover:brightness-110 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              ) : (
                <div className="w-full h-full relative group">
                  <Image
                    alt={image.alt}
                    src={image.src}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    priority
                    className="object-cover transition-all duration-500 group-hover:brightness-110 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
        {viewMoreHref && (
          <motion.div
            className="flex items-center justify-start h-full pl-2 shrink-0"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Link
              href={viewMoreHref}
              className="group flex flex-col items-center gap-3 px-4 py-3 rounded-2xl border border-white/10 hover:bg-white/[0.03] hover:border-white/20 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <FiArrowRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
              </div>
              <span className="text-[10px] uppercase tracking-wider text-white/40 group-hover:text-white/80 transition-colors font-medium">
                 View More
              </span>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};
