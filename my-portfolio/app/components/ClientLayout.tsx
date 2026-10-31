"use client";

import { Navbar } from "../components/nav";
import Footer from "../components/footer";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative isolate flex min-h-screen w-full min-w-0 flex-col">
      <div data-lamp aria-hidden className="lamp" />
      <Navbar />
      <div className="mx-auto flex w-full max-w-[720px] flex-grow flex-col px-4 sm:px-7">
        <motion.main
          key={pathname}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mt-8 mb-12 flex flex-grow flex-col gap-16"
        >
          {children}
        </motion.main>
        <Footer />
      </div>
    </div>
  );
}
