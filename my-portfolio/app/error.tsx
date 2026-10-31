"use client";

import Link from "next/link";
import { useEffect } from "react";
import { PageHeader } from "app/components/PageHeader";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex w-full flex-col">
      <PageHeader title="something broke">that wasn&apos;t supposed to happen. try again?</PageHeader>
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
