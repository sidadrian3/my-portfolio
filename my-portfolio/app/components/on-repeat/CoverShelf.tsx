"use client";

import { useRef, useState } from "react";
import type { SpotifyTrack } from "app/lib/spotify";
import { AlbumArt } from "./AlbumArt";
import { sampleDominantColor } from "./coverColor";

export const SHELF_COUNT = 5;

// Edge labels hug their side so they never spill past the content column
const LABEL_ALIGN = {
  start: "left-0",
  center: "left-1/2 -translate-x-1/2",
  end: "right-0",
} as const;

type Align = keyof typeof LABEL_ALIGN;

const ROW = "-mr-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pr-4 sm:mr-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:pr-0";
const ITEM = "w-[132px] shrink-0 snap-start sm:w-auto";

function alignFor(index: number, total: number): Align {
  if (index === 0) return "start";
  if (index === total - 1) return "end";
  return "center";
}

function ShelfCover({ track, align }: { track: SpotifyTrack; align: Align }) {
  const [glow, setGlow] = useState<string | null>(null);
  const requested = useRef(false);

  // Sampled lazily on first hover or focus so five covers don't all decode on mount
  const sampleGlow = () => {
    if (requested.current || !track.albumImageUrl) return;
    requested.current = true;
    sampleDominantColor(track.albumImageUrl)
      .then(setGlow)
      .catch(() => {});
  };

  return (
    <li className={ITEM} onPointerEnter={sampleGlow} onFocus={sampleGlow}>
      <a
        href={track.songUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shelf-link relative block"
      >
        <span
          className={`pointer-events-none absolute bottom-full z-10 mb-2 hidden sm:block ${LABEL_ALIGN[align]}`}
        >
          <span
            aria-hidden="true"
            className="shelf-label block w-max max-w-[220px] rounded-md border border-line bg-bg px-2.5 py-2"
          >
            <span className="block truncate text-[13px] text-ink">{track.title}</span>
            <span className="block truncate text-[12px] text-mute">{track.artist}</span>
          </span>
        </span>
        <span
          className="shelf-art block rounded-md"
          style={glow ? ({ "--glow": glow } as React.CSSProperties) : undefined}
        >
          <AlbumArt track={track} sizes="(min-width: 640px) 100px, 132px" className="rounded-md" />
        </span>
        <span className="mt-2 block truncate text-[12px] text-ink sm:text-mute">{track.title}</span>
        <span className="block truncate text-[12px] text-mute sm:sr-only">{track.artist}</span>
      </a>
    </li>
  );
}

export function CoverShelf({ tracks }: { tracks: SpotifyTrack[] }) {
  return (
    <ol className={ROW}>
      {tracks.map((track, i) => (
        <ShelfCover
          key={`${track.songUrl}-${i}`}
          track={track}
          align={alignFor(i, tracks.length)}
        />
      ))}
    </ol>
  );
}

export function CoverShelfSkeleton() {
  return (
    <ol className={ROW} aria-hidden="true">
      {Array.from({ length: SHELF_COUNT }, (_, i) => (
        <li key={i} className={ITEM}>
          <div className="aspect-square rounded-md bg-hi motion-safe:animate-pulse" />
          <div className="mt-2 h-3 w-3/4 rounded-[4px] bg-hi motion-safe:animate-pulse" />
          <div className="mt-1.5 h-3 w-1/2 rounded-[4px] bg-hi motion-safe:animate-pulse sm:hidden" />
        </li>
      ))}
    </ol>
  );
}
