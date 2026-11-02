"use client";

import type { SpotifyTrack } from "app/lib/spotify";
import { AlbumArt } from "./AlbumArt";
import { useCoverPalette } from "./coverColor";

const SWATCH_SLOTS = 4;

function Palette({ colors }: { colors: string[] | null }) {
  return (
    <span
      aria-hidden="true"
      className="mt-2 flex h-2.5 gap-1.5 sm:mt-0 sm:h-[140px] sm:flex-col"
    >
      {colors
        ? colors.map((color) => (
            <span
              key={color}
              className="flex-1 rounded-[3px] ring-1 ring-inset ring-ink/10 sm:rounded-[4px]"
              style={{ backgroundColor: color }}
            />
          ))
        : Array.from({ length: SWATCH_SLOTS }, (_, i) => (
            <span key={i} className="flex-1 rounded-[3px] bg-hi sm:rounded-[4px]" />
          ))}
    </span>
  );
}

export function FeaturedTrack({
  label,
  track,
  live,
}: {
  label: string;
  track: SpotifyTrack;
  live: boolean;
}) {
  const palette = useCoverPalette(track.albumImageUrl || undefined);

  return (
    <a
      href={track.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block sm:flex sm:gap-5"
    >
      <AlbumArt
        track={track}
        sizes="(min-width: 640px) 260px, 100vw"
        className="w-full shrink-0 rounded-lg sm:w-[260px]"
      />
      <span className="flex min-w-0 flex-1 flex-col sm:justify-between">
        <Palette colors={palette} />
        <span className="mt-3.5 block sm:mt-0">
          <span className="flex items-center gap-2 text-[12px] text-mute">
            {live && <span className="h-1.5 w-1.5 rounded-full bg-accent-now" aria-hidden="true" />}
            {label}
          </span>
          <span className="mt-1 block truncate text-[13px] text-ink">{track.title}</span>
          <span className="block truncate text-[13px] text-mute">{track.artist}</span>
        </span>
      </span>
    </a>
  );
}

export function FeaturedTrackSkeleton() {
  return (
    <div aria-hidden="true" className="sm:flex sm:gap-5">
      <div className="aspect-square w-full shrink-0 rounded-lg bg-hi motion-safe:animate-pulse sm:w-[260px]" />
      <div className="flex flex-1 flex-col sm:justify-between">
        <Palette colors={null} />
        <div className="mt-3.5 space-y-2 sm:mt-0">
          <div className="h-3 w-20 rounded-[4px] bg-hi motion-safe:animate-pulse" />
          <div className="h-3.5 w-2/5 rounded-[4px] bg-hi motion-safe:animate-pulse" />
          <div className="h-3.5 w-1/4 rounded-[4px] bg-hi motion-safe:animate-pulse" />
        </div>
      </div>
    </div>
  );
}
