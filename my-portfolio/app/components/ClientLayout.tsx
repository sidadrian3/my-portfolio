"use client";

import "../global.css";
import { Navbar } from "../components/nav";
import Footer from "../components/footer";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Jockey_One, Roboto_Flex } from "next/font/google";

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
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }} // Increased from 1 to 2
      className="rounded-lg bg-black text-white flex-auto min-w-0 mt-2 md:mt-6 flex flex-col px-6 sm:px-4 md:px-9 max-w-[1000px] w-full p-9"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0 }} // Increased from 0.5 to 1
      >
        <Navbar />
      </motion.div>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }} // Increased delay from 0.3 to 1.5
        className="flex-grow"
      >
        {children}
      </motion.main>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }} // Increased delay from 0.6 to 2.5
      >
        <Footer />
      </motion.div>
    </motion.div>
  );
}
