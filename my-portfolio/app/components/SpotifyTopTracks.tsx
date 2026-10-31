"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FastAverageColor } from "fast-average-color";


interface Track {
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
}


function TrackItem({ track, index }: { track: Track; index: number }) {
  const [dominantColor, setDominantColor] = useState<string>("transparent");

  useEffect(() => {
    if (track.albumImageUrl) {
      const fac = new FastAverageColor();
      fac.getColorAsync(track.albumImageUrl, { algorithm: 'dominant', crossOrigin: 'anonymous' })
        .then(color => setDominantColor(color.hex))
        .catch(err => console.error(err));
    }
  }, [track.albumImageUrl]);

  return (
    <a
      href={track.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center gap-4 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] rounded-xl p-3 transition-all duration-300 overflow-hidden hover:shadow-lg"
    >
      {/* Glow effects that appear on hover */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-40 blur-2xl z-0 pointer-events-none"
        style={{ background: `radial-gradient(circle at 20% 50%, ${dominantColor}, transparent 70%)` }}
      />
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-0 pointer-events-none"
        style={{ backgroundImage: `linear-gradient(90deg, ${dominantColor}40 0%, transparent 100%)` }}
      />

      <span className="w-8 text-center text-sm font-mono text-white/30 group-hover:text-white/70 transition-colors z-10">
        {index + 1}
      </span>
      <div className="relative w-14 h-14 shrink-0 overflow-hidden rounded-lg shadow-md z-10">
        {track.albumImageUrl ? (
          <Image
            src={track.albumImageUrl}
            alt={`${track.title} album art`}
            fill
            crossOrigin="anonymous"
            unoptimized={true}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-white/[0.05]" />
        )}
      </div>
      <div className="flex flex-col min-w-0 z-10">
        <p className="text-white/90 text-base font-medium truncate group-hover:text-white transition-colors">
          {track.title}
        </p>
        <p className="text-white/50 text-sm truncate">
          {track.artist}
        </p>
      </div>
    </a>
  );
}

export function SpotifyTopTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("short_term");

  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/spotify/top-tracks?time_range=${timeRange}&limit=5`);
        const json = await res.json();
        if (json.items) {
          setTracks(json.items);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [timeRange]);

  return (
    <div className="w-full mt-4">
      <div className="flex items-center justify-between mb-4 mt-8">
        <h2 className="text-[10px] uppercase tracking-[0.15em] text-white/40">Top Tracks</h2>
        <div className="flex gap-1 bg-white/[0.04] backdrop-blur-md p-1 rounded-[10px] border border-white/[0.08]">
          {[
            { id: "short_term", label: "4 Weeks" },
            { id: "medium_term", label: "6 Months" },
            { id: "long_term", label: "All Time" },
          ].map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id)}
              className={`px-3 py-1.5 text-[11px] font-medium rounded-lg transition-all duration-200 ${timeRange === range.id
                ? "bg-white/15 text-white shadow-sm"
                : "text-white/40 hover:text-white hover:bg-white/[0.06]"
                }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-2"
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 animate-pulse">
                  <div className="w-8 text-center"><div className="w-4 h-4 bg-white/[0.05] mx-auto rounded"></div></div>
                  <div className="w-14 h-14 bg-white/[0.05] rounded-lg shrink-0"></div>
                  <div className="flex flex-col gap-2 w-full">
                    <div className="h-4 bg-white/[0.05] rounded w-1/3"></div>
                    <div className="h-3 bg-white/[0.05] rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={timeRange}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-3"
            >
              {tracks.map((track, i) => (
                <TrackItem key={track.title} track={track} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
