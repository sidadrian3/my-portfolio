"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { NowPlayingData, SpotifyTrack } from "app/lib/spotify";
import { useLampTint } from "../useLampTint";
import { useDominantColor } from "./coverColor";
import { FeaturedTrack, FeaturedTrackSkeleton } from "./FeaturedTrack";
import { CoverShelf, CoverShelfSkeleton, SHELF_COUNT } from "./CoverShelf";

type Track = SpotifyTrack;
type NowPlaying = NowPlayingData;

type TabId = "recent" | "short_term" | "medium_term" | "long_term";

const TABS: { id: TabId; label: string; url: string }[] = [
  { id: "recent", label: "Recently played", url: `/api/spotify/recently-played?limit=${SHELF_COUNT}` },
  { id: "short_term", label: "4 weeks", url: `/api/spotify/top-tracks?time_range=short_term&limit=${SHELF_COUNT}` },
  { id: "medium_term", label: "6 months", url: `/api/spotify/top-tracks?time_range=medium_term&limit=${SHELF_COUNT}` },
  { id: "long_term", label: "All time", url: `/api/spotify/top-tracks?time_range=long_term&limit=${SHELF_COUNT}` },
];

const POLL_MS = 30_000;

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
  if (nowTrack) header = <FeaturedTrack label="Now playing" track={nowTrack} live />;
  else if (recentTracks?.[0]) header = <FeaturedTrack label="Last played" track={recentTracks[0]} live={false} />;
  else if (topTracks?.[0]) header = <FeaturedTrack label="#1 this month" track={topTracks[0]} live={false} />;

  return (
    <div>
      {headerSettled ? header : <FeaturedTrackSkeleton />}

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

      <div className="mt-4">
        {activeFeed === undefined && <CoverShelfSkeleton />}
        {activeFeed === null && (
          <p className="text-[15px] text-mute">couldn&apos;t load these. try another tab.</p>
        )}
        {activeFeed && <CoverShelf tracks={activeFeed} />}
      </div>

      <p className="mt-6 text-[15px] text-mute">
        music depends on the mood. it always ends up at daniel caesar.
      </p>
    </div>
  );
}
