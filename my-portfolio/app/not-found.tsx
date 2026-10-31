import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "app/components/PageHeader";

export const metadata: Metadata = {
  title: "404",
  description: "Error 404",
};

export default function NotFound() {
  return (
    <div className="flex w-full flex-col">
      <PageHeader title="404">that page doesn&apos;t exist.</PageHeader>
      <Link href="/" className="w-fit py-2 text-[15px] text-ink underline underline-offset-4">
        back home
      </Link>
    </div>
  );
}
