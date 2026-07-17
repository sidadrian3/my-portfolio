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
      <div className="flex items-center gap-4 bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 w-full h-24 animate-pulse">
        <div className="w-16 h-16 bg-neutral-800 rounded-md shrink-0"></div>
        <div className="flex flex-col gap-2 w-full">
          <div className="h-4 bg-neutral-800 rounded w-1/3"></div>
          <div className="h-3 bg-neutral-800 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (!data.isPlaying) {
    return (
      <div className="flex items-center gap-4 bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 w-full">
        <div className="w-16 h-16 bg-neutral-800 rounded-md shrink-0 flex items-center justify-center">
          <svg className="w-6 h-6 text-neutral-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.5 0-4.5-2-4.5-4.5h2c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5c-.53 0-1.04.16-1.46.46l1.2 1.2H7V6.5l8 2v3.74c.66-.4 1.43-.63 2.25-.63 2.5 0 4.5 2 4.5 4.5s-2 4.5-4.5 4.5z" />
          </svg>
        </div>
        <div className="flex flex-col flex-1">
          <p className="text-neutral-400 text-sm font-medium">Not Listening</p>
          <p className="text-neutral-500 text-xs">Spotify is currently idle</p>
        </div>
      </div>
    );
  }

  return (
    <a
      href={data.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center gap-4 border border-neutral-800 rounded-xl p-4 w-full overflow-hidden transition-transform hover:scale-[1.02]"
      style={{
        backgroundColor: "rgba(23, 23, 23, 0.8)",
        backgroundImage: `linear-gradient(90deg, ${dominantColor}50 0%, rgba(23,23,23,1) 100%)`
      }}
    >
      {/* Background radial glow */}
      <div 
        className="absolute inset-0 opacity-40 transition-opacity duration-500 group-hover:opacity-70 blur-2xl z-0"
        style={{ background: `radial-gradient(circle at 20% 50%, ${dominantColor}, transparent 60%)` }}
      />

      <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-md shadow-lg z-10">
        {data.albumImageUrl ? (
          <Image
            src={data.albumImageUrl}
            alt={`${data.title} album art`}
            fill
            crossOrigin="anonymous"
            unoptimized={true}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-neutral-800" />
        )}
      </div>
      <div className="flex flex-col flex-1 min-w-0 z-10">
        <div className="flex items-center gap-2 mb-1">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <p className="text-green-500 text-xs font-semibold uppercase tracking-wider">Now Playing</p>
        </div>
        <p className="text-neutral-100 font-medium truncate">{data.title}</p>
        <p className="text-neutral-400 text-sm truncate">{data.artist}</p>
      </div>
    </a>
  );
}
