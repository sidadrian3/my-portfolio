"use client";

import "../global.css";
import { Navbar } from "../components/nav";
import Footer from "../components/footer";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Jockey_One, Roboto_Flex } from "next/font/google";
import { GrainOverlay } from "./GrainOverlay";

// Import the fonts
const jockeyOne = Jockey_One({
  subsets: ["latin"],
  weight: "400", // Jockey One only has one weight
  variable: "--font-jockey-one",
});

const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  weight: ["100", "400", "700"], // Specify weights you want to use
  variable: "--font-roboto-flex",
});

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <GrainOverlay />
      <div className="fixed inset-0 pointer-events-none z-[-1]" style={{ background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.03), transparent 60%)' }} />
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="text-white flex-auto min-w-0 flex flex-col w-full relative isolate"
      >
        <Navbar />

        <div className="px-6 sm:px-4 md:px-9 max-w-[1000px] w-full mx-auto flex flex-col flex-grow mt-8 mb-12">
          <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
            className="flex-grow flex flex-col gap-16"
          >
            {children}
          </motion.main>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
          >
            <Footer />
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
