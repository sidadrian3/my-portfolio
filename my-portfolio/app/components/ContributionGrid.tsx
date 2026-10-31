"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ContributionCalendar } from "app/lib/github";
import { formatNumber } from "app/lib/format";
import { clamp } from "app/lib/math";

const CELL = 10;
const GAP = 3;
const STEP = CELL + GAP;
const DAYS_IN_WEEK = 7;
const GRAPH_HEIGHT = DAYS_IN_WEEK * STEP - GAP;
const LENS_RADIUS = 4;
const LENS_SCALE = [1.7, 1.3, 1.1, 1, 1];
const LENS_GAP = 1.6;
const WAVE_STEP_MS = 12;
const TOOLTIP_HALF_WIDTH = 100;

// Magnified cells are laid out outward from the centre with a small gap, so they push
// their neighbours apart instead of overlapping them. Index = distance from the active cell.
const LENS_PUSH = (() => {
  const push = [0];
  let edge = (CELL * LENS_SCALE[0]) / 2;
  for (let ring = 1; ring <= LENS_RADIUS; ring++) {
    const size = CELL * LENS_SCALE[ring];
    const centre = edge + LENS_GAP + size / 2;
    push.push(centre - STEP * ring);
    edge = centre + size / 2;
  }
  return push;
})();

const LENS_VARS = ["--lx", "--ly", "--ls"] as const;

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

type Cell = { w: number; d: number };
type WavePhase = "idle" | "play" | "done";
type Tip = { x: number; y: number; count: string; date: string };

const cellKey = (w: number, d: number) => `${w}:${d}`;

function describeDay(count: number, date: string) {
  const noun = count === 1 ? "contribution" : "contributions";
  return {
    count: `${formatNumber(count)} ${noun}`,
    date: dateFormat.format(new Date(`${date}T00:00:00Z`)),
  };
}

export function ContributionGrid({ calendar }: { calendar: ContributionCalendar }) {
  const { weeks } = calendar;
  const width = weeks.length * STEP - GAP;
  const total = formatNumber(calendar.total);

  const frame = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const cells = useRef(new Map<string, SVGRectElement>());
  const lensed = useRef<SVGRectElement[]>([]);
  const fromKeyboard = useRef(false);

  const [wave, setWave] = useState<WavePhase>("idle");
  const [active, setActive] = useState<Cell | null>(null);
  const [tip, setTip] = useState<Tip | null>(null);

  // Play the wave once, the first time the graph is mostly on screen.
  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setWave("done");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setWave("play");
        observer.disconnect();
      },
      { threshold: 0.3 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Touch has no hover, so a tap elsewhere is what dismisses the tooltip.
  useEffect(() => {
    if (!active) return;
    const dismiss = (event: PointerEvent) => {
      if (!frame.current?.contains(event.target as Node)) setActive(null);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [active]);

  // Apply the lens to the active cell's neighbours and place the tooltip.
  useLayoutEffect(() => {
    for (const element of lensed.current) {
      element.removeAttribute("data-lens");
      element.removeAttribute("data-active");
      for (const name of LENS_VARS) element.style.removeProperty(name);
    }
    lensed.current = [];

    const target = active ? cells.current.get(cellKey(active.w, active.d)) : null;
    const frameElement = frame.current;
    const svgElement = svg.current;
    if (!active || !target || !frameElement || !svgElement) return;

    for (let dw = -LENS_RADIUS; dw <= LENS_RADIUS; dw++) {
      for (let dd = -LENS_RADIUS; dd <= LENS_RADIUS; dd++) {
        const neighbour = cells.current.get(cellKey(active.w + dw, active.d + dd));
        if (!neighbour) continue;
        const ring = Math.max(Math.abs(dw), Math.abs(dd));
        neighbour.dataset.lens = String(ring);
        neighbour.style.setProperty("--lx", String(Math.sign(dw) * LENS_PUSH[Math.abs(dw)]));
        neighbour.style.setProperty("--ly", String(Math.sign(dd) * LENS_PUSH[Math.abs(dd)]));
        neighbour.style.setProperty("--ls", String(LENS_SCALE[ring]));
        lensed.current.push(neighbour);
      }
    }
    target.dataset.active = "true";

    if (fromKeyboard.current) {
      fromKeyboard.current = false;
      target.scrollIntoView({ block: "nearest", inline: "nearest" });
    }

    const svgBox = svgElement.getBoundingClientRect();
    const frameBox = frameElement.getBoundingClientRect();
    const scale = svgBox.width / width;
    const day = weeks[active.w].days[active.d];
    setTip({
      x: clamp(
        svgBox.left - frameBox.left + (active.w * STEP + CELL / 2) * scale,
        TOOLTIP_HALF_WIDTH,
        frameBox.width - TOOLTIP_HALF_WIDTH,
      ),
      y: svgBox.top - frameBox.top + active.d * STEP * scale,
      ...describeDay(day.count, day.date),
    });
  }, [active, weeks, width]);

  const cellAt = useCallback(
    (clientX: number, clientY: number): Cell | null => {
      const element = svg.current;
      if (!element) return null;
      const box = element.getBoundingClientRect();
      const scale = box.width / width;
      const w = Math.floor((clientX - box.left) / scale / STEP);
      const d = Math.floor((clientY - box.top) / scale / STEP);
      if (w < 0 || d < 0 || w >= weeks.length || d >= weeks[w].days.length) return null;
      return { w, d };
    },
    [weeks, width],
  );

  const select = useCallback((next: Cell | null) => {
    setActive((current) =>
      current && next && current.w === next.w && current.d === next.d ? current : next,
    );
  }, []);

  const lastCell = useCallback((): Cell => {
    const w = weeks.length - 1;
    return { w, d: weeks[w].days.length - 1 };
  }, [weeks]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const steps: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };

    if (event.key === "Escape") {
      select(null);
      return;
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      fromKeyboard.current = true;
      select(event.key === "Home" ? { w: 0, d: 0 } : lastCell());
      return;
    }
    const step = steps[event.key];
    if (!step) return;

    event.preventDefault();
    fromKeyboard.current = true;
    const from = active ?? lastCell();
    const w = clamp(from.w + step[0], 0, weeks.length - 1);
    select({ w, d: clamp(from.d + step[1], 0, weeks[w].days.length - 1) });
  };

  return (
    <div ref={frame} className="relative">
      <div
        role="group"
        tabIndex={0}
        dir="rtl"
        aria-label={`Contribution graph, ${total} contributions in the last year. Use the arrow keys to explore days.`}
        data-wave={wave}
        className="contrib-grid overflow-x-auto pb-1"
        onPointerMove={(event) => select(cellAt(event.clientX, event.clientY))}
        onPointerDown={(event) => {
          if (event.pointerType === "touch") select(cellAt(event.clientX, event.clientY));
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== "touch") select(null);
        }}
        onKeyDown={onKeyDown}
        onFocus={(event) => {
          if (!active && event.currentTarget.matches(":focus-visible")) select(lastCell());
        }}
        onBlur={() => select(null)}
      >
        <div dir="ltr" className="w-full min-w-[560px]">
          <svg
            ref={svg}
            aria-hidden="true"
            viewBox={`0 0 ${width} ${GRAPH_HEIGHT}`}
            className="block h-auto w-full"
          >
            {weeks.map((week, w) =>
              week.days.map((day, d) => (
                <rect
                  key={day.date}
                  ref={(node) => {
                    if (node) cells.current.set(cellKey(w, d), node);
                    else cells.current.delete(cellKey(w, d));
                  }}
                  className="contrib-cell"
                  x={w * STEP}
                  y={d * STEP}
                  width={CELL}
                  height={CELL}
                  rx={2}
                  fill={`rgb(var(--contrib-${day.level}))`}
                  style={{ animationDelay: `${w * WAVE_STEP_MS}ms` }}
                />
              )),
            )}
          </svg>
        </div>
      </div>

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-0 z-20 whitespace-nowrap rounded-[4px] border border-line bg-bg px-2.5 py-1.5 text-[13px] leading-tight shadow-lg transition-opacity duration-100 ease-out ${
          active && tip ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transform: `translate3d(${tip?.x ?? 0}px, ${tip?.y ?? 0}px, 0) translate(-50%, calc(-100% - 12px))`,
        }}
      >
        <span className="font-medium text-ink">{tip?.count}</span>
        <span className="text-faint"> · {tip?.date}</span>
      </div>

      <p className="sr-only" aria-live="polite">
        {active && tip ? `${tip.count}, ${tip.date}` : ""}
      </p>
    </div>
  );
}
