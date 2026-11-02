import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Photo } from "app/lib/content/photos";

const FAN = [
  { tilt: -7, lift: 6 },
  { tilt: -2, lift: -6 },
  { tilt: 3, lift: -4 },
  { tilt: 8, lift: 8 },
];

// Hover is CSS-only; the photos are decorative, so they are not links or tab stops.
export function PhotoFan({ photos }: { photos: Photo[] }) {
  const fan = photos.slice(0, FAN.length);

  return (
    <div>
      <ul className="flex items-center justify-center px-[4%] pb-5 pt-4">
        {fan.map((photo, index) => {
          const { tilt, lift } = FAN[index];
          return (
            <li
              key={photo.src}
              style={{ "--tilt": `${tilt}deg`, "--lift": `${lift}px` } as CSSProperties}
              className="relative -mx-[4%] aspect-square w-[32%] overflow-hidden rounded-[3px] border-[6px] border-b-[22px] border-ink bg-hi shadow-[0_10px_30px_rgb(0_0_0/0.6)] transition-transform duration-[260ms] ease-[cubic-bezier(0.23,1,0.32,1)] [transform:rotate(var(--tilt))_translateY(var(--lift))] hover:z-10 hover:[transform:translateY(-14px)_scale(1.06)] motion-reduce:transition-none motion-reduce:hover:[transform:rotate(var(--tilt))_translateY(var(--lift))] sm:-mx-3.5 sm:w-[190px] [.light_&]:border-white [.light_&]:shadow-[0_10px_24px_rgb(20_18_16/0.18)]"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                priority
                sizes="(min-width: 640px) 190px, 32vw"
                className="object-cover"
              />
            </li>
          );
        })}
      </ul>
      <Link href="/photos" className="press text-[15px] text-ink">
        more photos →
      </Link>
    </div>
  );
}
