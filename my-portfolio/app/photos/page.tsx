import type { Metadata } from "next";
import Image from "next/image";
import { photos } from "app/lib/content/photos";
import { PageHeader } from "app/components/PageHeader";

export const metadata: Metadata = {
  title: "Photos",
  description: "bits of the last few years.",
};

export default function Photos() {
  return (
    <div className="flex w-full flex-col">
      <PageHeader title="photos">bits of the last few years.</PageHeader>
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
