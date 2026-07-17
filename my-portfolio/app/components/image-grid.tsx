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
              className="relative aspect-square"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {image.href ? (
                <Link
                  target={image.href.startsWith("http") ? "_blank" : undefined}
                  rel={image.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  href={image.href}
                  className="block w-full h-full relative"
                >
                  <Image
                    alt={image.alt}
                    src={image.src}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    priority
                    className="rounded-lg object-cover"
                  />
                </Link>
              ) : (
                <Image
                  alt={image.alt}
                  src={image.src}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  priority
                  className="rounded-lg object-cover"
                />
              )}
            </motion.div>
          ))}
        </div>
        {viewMoreHref && (
          <motion.div
            className="flex items-center justify-start h-full pl-2 shrink-0"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              href={viewMoreHref}
              className="group"
            >
              <span className="text-neutral-500 font-medium tracking-wide flex flex-col items-center gap-2 group-hover:text-white transition-colors duration-300">
                 <FiArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                 View More
              </span>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};
