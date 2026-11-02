import Image from "next/image";
import type { SpotifyTrack } from "app/lib/spotify";

export function AlbumArt({
  track,
  sizes,
  className = "",
}: {
  track: SpotifyTrack;
  sizes: string;
  className?: string;
}) {
  return (
    <span className={`relative block aspect-square overflow-hidden bg-hi ${className}`}>
      {track.albumImageUrl && (
        // Unoptimised so the canvas colour sampling reads the original CORS-enabled Spotify image
        <Image
          src={track.albumImageUrl}
          alt=""
          fill
          sizes={sizes}
          crossOrigin="anonymous"
          className="object-cover"
          unoptimized
        />
      )}
    </span>
  );
}
