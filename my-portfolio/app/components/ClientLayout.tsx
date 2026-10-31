"use client";

import { Navbar } from "../components/nav";
import { MotionConfig, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative isolate flex min-h-screen w-full min-w-0 flex-col">
        <div data-lamp aria-hidden className="lamp" />
        <Navbar />
        <div className="mx-auto flex w-full max-w-[720px] flex-grow flex-col px-4 sm:px-7">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-6 mb-6 flex flex-grow flex-col gap-16"
          >
            {children}
          </motion.main>
          {footer}
        </div>
      </div>
    </MotionConfig>
  );
}
