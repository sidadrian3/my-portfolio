"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FastAverageColor } from "fast-average-color";
import { useLampTint } from "./useLampTint";

type Track = {
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
};

type NowPlaying = { isPlaying: boolean } & Partial<Track>;

type TabId = "recent" | "short_term" | "medium_term" | "long_term";

const TABS: { id: TabId; label: string; url: string }[] = [
  { id: "recent", label: "Recently played", url: "/api/spotify/recently-played?limit=5" },
  { id: "short_term", label: "4 weeks", url: "/api/spotify/top-tracks?time_range=short_term&limit=5" },
  { id: "medium_term", label: "6 months", url: "/api/spotify/top-tracks?time_range=medium_term&limit=5" },
  { id: "long_term", label: "All time", url: "/api/spotify/top-tracks?time_range=long_term&limit=5" },
];

const POLL_MS = 30_000;
const ROW_COUNT = 5;

// undefined = not loaded yet, null = failed
type Feeds = Partial<Record<TabId, Track[] | null>>;

async function fetchTracks(url: string): Promise<Track[] | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const json: { items?: Track[] } = await res.json();
    return json.items ?? null;
  } catch {
    return null;
  }
}

async function fetchNowPlaying(): Promise<NowPlaying | null> {
  try {
    const res = await fetch("/api/spotify/now-playing");
    if (!res.ok) return null;
    return (await res.json()) as NowPlaying;
  } catch {
    return null;
  }
}

function useDominantColor(url: string | undefined): string | null {
  const [result, setResult] = useState<{ url: string; color: string } | null>(null);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    new FastAverageColor()
      .getColorAsync(url, { algorithm: "dominant", crossOrigin: "anonymous" })
      .then((color) => {
        if (!cancelled) setResult({ url, color: color.hex });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [url]);

  return url && result?.url === url ? result.color : null;
}

function useNowPlaying() {
  const [now, setNow] = useState<NowPlaying | null>(null);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      if (document.hidden) return;
      const data = await fetchNowPlaying();
      if (cancelled) return;
      setNow(data);
      setSettled(true);
    };

    const onVisibility = () => {
      if (!document.hidden) void poll();
    };

    void poll();
    const interval = setInterval(poll, POLL_MS);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return { now, settled };
}

function AlbumArt({ track, size }: { track: Track; size: 40 | 56 }) {
  const box = size === 56 ? "h-14 w-14" : "h-10 w-10";
  return (
    <div className={`relative ${box} shrink-0 overflow-hidden rounded-[4px] bg-hi`}>
      {track.albumImageUrl && (
        <Image
          src={track.albumImageUrl}
          alt={`${track.title} album art`}
          fill
          sizes={`${size}px`}
          crossOrigin="anonymous"
          unoptimized
        />
      )}
    </div>
  );
}

function Header({ label, track, live }: { label: string; track: Track; live: boolean }) {
  return (
    <div>
      <p className="flex h-5 items-center gap-2 text-[13px] text-mute">
        {live && <span className="h-1.5 w-1.5 rounded-full bg-accent-now" aria-hidden="true" />}
        {label}
      </p>
      <a
        href={track.songUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 flex items-center gap-4"
      >
        <AlbumArt track={track} size={56} />
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-medium text-ink">{track.title}</span>
          <span className="block truncate text-[15px] text-mute">{track.artist}</span>
        </span>
      </a>
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="h-5 w-24 rounded-[4px] bg-hi motion-safe:animate-pulse" />
      <div className="mt-2 flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 rounded-[4px] bg-hi motion-safe:animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/5 rounded-[4px] bg-hi motion-safe:animate-pulse" />
          <div className="h-4 w-1/4 rounded-[4px] bg-hi motion-safe:animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function TrackRow({ track }: { track: Track }) {
  const [color, setColor] = useState<string | null>(null);
  const requested = useRef(false);

  // Sampled lazily on first hover or focus so five rows don't all decode art on mount
  const sampleColor = () => {
    if (requested.current || !track.albumImageUrl) return;
    requested.current = true;
    new FastAverageColor()
      .getColorAsync(track.albumImageUrl, { algorithm: "dominant", crossOrigin: "anonymous" })
      .then((result) => setColor(result.hex))
      .catch(() => {});
  };

  return (
    <li className="group relative" onPointerEnter={sampleColor} onFocus={sampleColor}>
      {color && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-25 group-has-[:focus-visible]:opacity-25`}
          style={{ backgroundImage: `linear-gradient(90deg, ${color}, transparent 75%)` }}
        />
      )}
      <a
        href={track.songUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex h-16 items-center gap-4"
      >
        <AlbumArt track={track} size={40} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-medium text-ink">{track.title}</span>
          <span className="block truncate text-[15px] text-mute">{track.artist}</span>
        </span>
        <span className="ruled-arrow pr-1 text-faint" aria-hidden="true">
          ↗
        </span>
      </a>
    </li>
  );
}

function RowsSkeleton() {
  return (
    <ol className="ruled" aria-hidden="true">
      {Array.from({ length: ROW_COUNT }, (_, i) => (
        <li key={i} className="flex h-16 items-center gap-4">
          <div className="h-10 w-10 shrink-0 rounded-[4px] bg-hi motion-safe:animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/5 rounded-[4px] bg-hi motion-safe:animate-pulse" />
            <div className="h-4 w-1/4 rounded-[4px] bg-hi motion-safe:animate-pulse" />
          </div>
        </li>
      ))}
    </ol>
  );
}

export function OnRepeat() {
  const { now, settled: nowSettled } = useNowPlaying();
  const [feeds, setFeeds] = useState<Feeds>({});
  const [selected, setSelected] = useState<TabId | null>(null);
  const requested = useRef(new Set<TabId>());

  const load = useCallback((tab: TabId) => {
    if (requested.current.has(tab)) return;
    requested.current.add(tab);
    const url = TABS.find((t) => t.id === tab)?.url;
    if (!url) return;
    void fetchTracks(url).then((tracks) => setFeeds((prev) => ({ ...prev, [tab]: tracks })));
  }, []);

  useEffect(() => {
    load("recent");
    load("short_term");
  }, [load]);

  useEffect(() => {
    if (selected) load(selected);
  }, [selected, load]);

  const isPlaying = Boolean(now?.isPlaying && now.title && now.songUrl);
  const nowTrack = isPlaying ? (now as Track) : null;
  const dominantColor = useDominantColor(nowTrack?.albumImageUrl);
  useLampTint(isPlaying ? dominantColor : null);

  const recentSettled = feeds.recent !== undefined;
  const recentTracks = feeds.recent ?? null;
  const topTracks = feeds.short_term ?? null;
  const recentOk = recentTracks !== null;
  const everythingFailed = recentSettled && feeds.short_term === null && !recentOk && !isPlaying;

  if (everythingFailed) {
    return <p className="text-[15px] text-mute">spotify&apos;s taking a break.</p>;
  }

  const active: TabId | null = selected ?? (recentSettled ? (recentOk ? "recent" : "short_term") : null);
  const visibleTabs = recentOk ? TABS : TABS.filter((t) => t.id !== "recent");
  const activeFeed = active ? feeds[active] : undefined;

  const headerSettled = nowSettled && recentSettled && (recentOk || feeds.short_term !== undefined);
  let header: React.ReactNode = null;
  if (nowTrack) header = <Header label="Now playing" track={nowTrack} live />;
  else if (recentTracks?.[0]) header = <Header label="Last played" track={recentTracks[0]} live={false} />;
  else if (topTracks?.[0]) header = <Header label="#1 this month" track={topTracks[0]} live={false} />;

  return (
    <div>
      <div className="min-h-[84px]">{headerSettled ? header : <HeaderSkeleton />}</div>

      <div
        role="group"
        aria-label="Track list"
        className="mt-8 flex min-h-10 flex-wrap items-center gap-x-5"
      >
        {recentSettled &&
          visibleTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              aria-pressed={active === tab.id}
              onClick={() => setSelected(tab.id)}
              className={`min-h-10 text-[14px] underline-offset-[10px] decoration-1 [@media(hover:hover)_and_(pointer:fine)]:hover:text-ink ${
                active === tab.id ? "text-ink underline" : "text-mute"
              }`}
            >
              {tab.label}
            </button>
          ))}
      </div>

      <div className="min-h-[326px]">
        {activeFeed === undefined && <RowsSkeleton />}
        {activeFeed === null && (
          <p className="pt-4 text-[15px] text-mute">couldn&apos;t load these. try another tab.</p>
        )}
        {activeFeed && (
          <ol className="ruled">
            {activeFeed.map((track, i) => (
              <TrackRow key={`${track.songUrl}-${i}`} track={track} />
            ))}
          </ol>
        )}
      </div>

      <p className="mt-6 text-[15px] text-mute">
        music depends on the mood. it always ends up at daniel caesar.
      </p>
    </div>
  );
}
