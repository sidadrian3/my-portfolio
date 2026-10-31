"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex w-full flex-col">
      <header className="pt-8 pb-4 sm:pt-12">
        <h1 className="text-[32px] font-[650] leading-[1.1] tracking-[-0.03em] text-ink">something broke</h1>
        <p className="mt-2 text-[15px] text-mute">that wasn&apos;t supposed to happen. try again?</p>
      </header>
      <div className="flex gap-4">
        <button type="button" onClick={reset} className="press py-2 text-[15px] text-ink underline underline-offset-4">
          try again
        </button>
        <Link href="/" className="py-2 text-[15px] text-mute underline underline-offset-4 hover:text-ink">
          back home
        </Link>
      </div>
    </div>
  );
}
