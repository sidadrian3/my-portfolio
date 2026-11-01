"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { Project } from "app/lib/content/projects";
import { clamp } from "app/lib/math";
import { ProjectPoster } from "./ProjectPoster";

const WIDTH = 220;
const HEIGHT = 136;
const EDGE = 12;
const ANCHOR_RISE = HEIGHT * 1.15;
const SPRING = { stiffness: 300, damping: 30 };
const ENTER = { duration: 0.15, ease: [0.23, 1, 0.32, 1] as const };
const EXIT = { duration: 0.1, ease: [0.23, 1, 0.32, 1] as const };

// The anchor is the point the poster's bottom-centre sits on (translate -50% -115%).
function anchorFromCursor(clientX: number, clientY: number) {
  return {
    x: clamp(clientX, WIDTH / 2 + EDGE, window.innerWidth - WIDTH / 2 - EDGE),
    y: clamp(clientY, ANCHOR_RISE + EDGE, window.innerHeight - EDGE),
  };
}

function anchorBesideRow(row: Element) {
  const rect = row.getBoundingClientRect();
  const fitsRight = rect.right + EDGE + WIDTH + EDGE <= window.innerWidth;
  const left = fitsRight ? rect.right + EDGE : rect.left - EDGE - WIDTH;
  const top = rect.top + rect.height / 2 - HEIGHT / 2;
  return {
    x: clamp(left, EDGE, window.innerWidth - WIDTH - EDGE) + WIDTH / 2,
    y: clamp(top, EDGE, window.innerHeight - HEIGHT - EDGE) + ANCHOR_RISE,
  };
}

export function ProjectPeek({ project }: { project: Project | null }) {
  const reduceMotion = useReducedMotion() ?? false;
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);
  const placed = useRef(false);
  const lastRow = useRef<Element | null>(null);
  const tilt = reduceMotion ? "rotate(0deg)" : "rotate(-2deg)";
  const transform = useMotionTemplate`translate3d(${x}px, ${y}px, 0) translate(-50%, -115%) ${tilt}`;

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      if (reduceMotion) {
        const row = (event.target as Element | null)?.closest?.("[data-peek-row]");
        if (!row || row === lastRow.current) return;
        lastRow.current = row;
        const anchor = anchorBesideRow(row);
        x.jump(anchor.x);
        y.jump(anchor.y);
        return;
      }

      const anchor = anchorFromCursor(event.clientX, event.clientY);
      if (!placed.current) {
        placed.current = true;
        x.jump(anchor.x);
        y.jump(anchor.y);
        return;
      }
      x.set(anchor.x);
      y.set(anchor.y);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduceMotion, x, y]);

  useEffect(() => {
    if (!project) lastRow.current = null;
  }, [project]);

  return createPortal(
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 h-[136px] w-[220px]"
      style={{ transform }}
    >
      <AnimatePresence>
        {project && (
          <motion.div
            key="peek"
            className="h-full w-full origin-bottom shadow-[0_10px_28px_rgba(0,0,0,0.4)]"
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.95, transition: EXIT }}
            transition={ENTER}
          >
            <ProjectPoster project={project} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>,
    document.body,
  );
}
