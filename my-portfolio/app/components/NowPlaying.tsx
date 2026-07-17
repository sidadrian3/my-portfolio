"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FastAverageColor } from "fast-average-color";

interface NowPlaying {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumImageUrl?: string;
  songUrl?: string;
}

export function NowPlaying() {
  const [data, setData] = useState<NowPlaying>({ isPlaying: false });
  const [loading, setLoading] = useState(true);
  const [dominantColor, setDominantColor] = useState<string>("#171717");

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch("/api/spotify/now-playing");
        const json = await res.json();
        if (!json.error) {
          setData(json);
        }

        if (json.albumImageUrl) {
          const fac = new FastAverageColor();
          fac.getColorAsync(json.albumImageUrl, { algorithm: 'dominant' })
            .then(color => setDominantColor(color.hex))
            .catch(err => console.error(err));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchNowPlaying();
    // Poll every 30 seconds
    const interval = setInterval(fetchNowPlaying, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-4 glass-card p-4 w-full h-24 animate-pulse">
        <div className="w-16 h-16 bg-white/[0.05] rounded-xl shrink-0"></div>
        <div className="flex flex-col gap-2 w-full">
          <div className="h-4 bg-white/[0.05] rounded w-1/3"></div>
          <div className="h-3 bg-white/[0.05] rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (!data.isPlaying) {
    return (
      <div className="flex items-center gap-4 glass-card p-4 w-full">
        <div className="w-16 h-16 bg-white/[0.02] border border-white/[0.05] rounded-xl shrink-0 flex items-center justify-center">
          <svg className="w-6 h-6 text-white/20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </div>
        <div className="flex flex-col flex-1">
          <p className="text-white/40 text-[10px] uppercase tracking-[0.15em]">Not Listening</p>
          <p className="text-white/20 text-xs mt-1">Spotify is currently idle</p>
        </div>
      </div>
    );
  }

  return (
    <a
      href={data.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center gap-4 glass-card p-4 w-full overflow-hidden transition-all duration-300 hover:shadow-apple-glow"
      style={{
        backgroundImage: `linear-gradient(90deg, ${dominantColor}30 0%, transparent 100%)`
      }}
    >
      {/* Background radial glow */}
      <div 
        className="absolute inset-0 opacity-40 transition-opacity duration-500 group-hover:opacity-70 blur-3xl z-0 pointer-events-none"
        style={{ background: `radial-gradient(circle at 20% 50%, ${dominantColor}, transparent 60%)` }}
      />

      <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-xl shadow-lg z-10">
        {data.albumImageUrl ? (
          <Image
            src={data.albumImageUrl}
            alt={`${data.title} album art`}
            fill
            crossOrigin="anonymous"
            unoptimized={true}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-white/[0.05]" />
        )}
      </div>
      <div className="flex flex-col flex-1 min-w-0 z-10">
        <div className="flex items-center gap-2 mb-1">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-apple-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-apple-accent"></span>
          </span>
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/40">Now Playing</p>
        </div>
        <p className="text-white/90 font-medium truncate">{data.title}</p>
        <p className="text-white/50 text-sm truncate">{data.artist}</p>
      </div>
    </a>
  );
}
