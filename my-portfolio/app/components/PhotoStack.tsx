"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Photo } from "app/lib/content/photos";

const STACK_SIZE = 3;
const SLOTS = [
  { rotate: -6, x: 0, y: 0 },
  { rotate: 3, x: 26, y: -6 },
  { rotate: -2, x: 52, y: 4 },
];
const FLIP_SPRING = { type: "spring", duration: 0.5, bounce: 0.15 } as const;
const CYCLE_SPRING = { type: "spring", duration: 0.45, bounce: 0.1 } as const;

// Hover or focus flips to the caption; click, Enter or Space advances.
export function PhotoStack({ photos }: { photos: Photo[] }) {
  const stack = photos.slice(0, STACK_SIZE);
  const [top, setTop] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const buttons = useRef(new Map<number, HTMLButtonElement>());
  const pointerType = useRef("mouse");
  const hoverLocked = useRef(false);
  const refocus = useRef(false);

  useEffect(() => {
    if (!refocus.current) return;
    buttons.current.get(top)?.focus({ preventScroll: true });
  }, [top]);

  const cycle = (viaKeyboard: boolean) => {
    refocus.current = viaKeyboard;
    hoverLocked.current = !viaKeyboard;
    setFlipped(false);
    setTop((current) => (current + 1) % stack.length);
  };

  const onClick = (event: React.MouseEvent) => {
    const viaKeyboard = event.detail === 0;
    const viaTouch = !viaKeyboard && pointerType.current === "touch";
    if (viaTouch && !flipped) {
      setFlipped(true);
      return;
    }
    cycle(viaKeyboard);
  };

  return (
    <div>
      <div
        className="relative my-4 h-[220px] w-[272px] sm:h-[260px] sm:w-[312px]"
        onPointerLeave={() => {
          hoverLocked.current = false;
        }}
      >
        {stack.map((photo, index) => {
          const slot = (index - top + stack.length) % stack.length;
          const isTop = slot === 0;
          const { rotate, x, y } = SLOTS[slot];
          const showCaption = isTop && flipped;

          return (
            <motion.div
              key={photo.src}
              className={`absolute left-0 top-0 size-[220px] sm:size-[260px] ${
                isTop ? "" : "pointer-events-none"
              }`}
              style={{ zIndex: STACK_SIZE - slot }}
              initial={false}
              animate={{ rotate, x, y }}
              transition={CYCLE_SPRING}
            >
              <button
                type="button"
                ref={(node) => {
                  if (node) buttons.current.set(index, node);
                  else buttons.current.delete(index);
                }}
                tabIndex={isTop ? 0 : -1}
                aria-hidden={isTop ? undefined : true}
                aria-pressed={isTop ? flipped : undefined}
                aria-label={
                  isTop
                    ? `${photo.alt}. ${photo.caption}. Press for the next photo.`
                    : undefined
                }
                data-flipped={showCaption}
                className="group block size-full cursor-pointer rounded-[4px] [perspective:900px]"
                onPointerDown={(event) => {
                  pointerType.current = event.pointerType;
                }}
                onPointerEnter={(event) => {
                  pointerType.current = event.pointerType;
                  if (!isTop || event.pointerType === "touch" || hoverLocked.current) return;
                  setFlipped(true);
                }}
                onPointerLeave={(event) => {
                  if (!isTop || event.pointerType === "touch") return;
                  setFlipped(false);
                }}
                onFocus={(event) => {
                  if (refocus.current) {
                    refocus.current = false;
                    return;
                  }
                  if (event.currentTarget.matches(":focus-visible")) setFlipped(true);
                }}
                onBlur={() => setFlipped(false)}
                onClick={onClick}
              >
                <motion.span
                  className="relative block size-full [transform-style:preserve-3d] motion-reduce:!transform-none"
                  initial={false}
                  animate={{ rotateY: showCaption ? 180 : 0 }}
                  transition={FLIP_SPRING}
                >
                  <span className="absolute inset-0 block overflow-hidden rounded-[4px] bg-hi [backface-visibility:hidden] motion-reduce:transition-opacity motion-reduce:duration-150 motion-reduce:group-data-[flipped=true]:opacity-0">
                    <Image
                      priority={index === 0}
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 640px) 260px, 220px"
                      className="object-cover"
                    />
                  </span>
                  <span
                    className="absolute inset-0 flex items-end rounded-[4px] bg-hi p-4 ring-1 ring-inset ring-line text-left text-[15px] text-ink [backface-visibility:hidden] [transform:rotateY(180deg)] motion-reduce:opacity-0 motion-reduce:transition-opacity motion-reduce:duration-150 motion-reduce:[transform:none] motion-reduce:group-data-[flipped=true]:opacity-100"
                    aria-hidden="true"
                  >
                    {photo.caption}
                  </span>
                </motion.span>
              </button>
            </motion.div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
        <p className="text-[13px] text-faint">
          <span className="[@media(hover:hover)_and_(pointer:fine)]:hidden">
            tap to flip · tap again for next
          </span>
          <span className="hidden [@media(hover:hover)_and_(pointer:fine)]:inline">
            hover to flip · click for next
          </span>
        </p>
        <Link href="/photos" className="press text-[15px] text-ink">
          more photos →
        </Link>
      </div>
    </div>
  );
}
