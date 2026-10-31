import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404",
  description: "Error 404",
};

export default function NotFound() {
  return (
    <div className="flex w-full flex-col">
      <header className="pt-8 pb-4 sm:pt-12">
        <h1 className="text-[32px] font-[650] leading-[1.1] tracking-[-0.03em] text-ink">404</h1>
        <p className="mt-2 text-[15px] text-mute">that page doesn&apos;t exist.</p>
      </header>
      <Link href="/" className="w-fit py-2 text-[15px] text-ink underline underline-offset-4">
        back home
      </Link>
    </div>
  );
}
