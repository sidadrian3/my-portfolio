import type { Metadata } from "next";
import Image from "next/image";
import { photos } from "app/lib/content/photos";

export const metadata: Metadata = {
  title: "Photos",
  description: "bits of the last few years.",
};

export default function Photos() {
  return (
    <div className="flex w-full flex-col">
      <header className="pt-8 pb-4 sm:pt-12">
        <h1 className="text-[32px] font-[650] leading-[1.1] tracking-[-0.03em] text-ink">photos</h1>
        <p className="mt-2 text-[15px] text-mute">bits of the last few years.</p>
      </header>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {photos.map((photo) => (
          <figure key={photo.src}>
            <Image
              src={photo.src}
              alt={photo.alt}
              width={600}
              height={600}
              priority
              sizes="(min-width: 640px) 33vw, 50vw"
              className="aspect-square w-full rounded-[4px] object-cover"
            />
            <figcaption className="mt-2 text-sm text-faint">{photo.caption}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
