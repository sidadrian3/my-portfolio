'use client';

import "../global.css";
import { Navbar } from "../components/nav";
import Footer from "../components/footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
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

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
//   const [isMounted, setIsMounted] = useState(false);

//   // Ensure this only runs once after the component is mounted
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   if (!isMounted) return null; // Prevent rendering anything until mounted

  return (
    <motion.div
      key={pathname} // Ensure route change triggers animation
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
      className=" rounded-lg bg-cyan-100 flex-auto min-w-0 mt-2 md:mt-6 flex flex-col px-6 sm:px-4 md:px-9 max-w-[624px] w-full p-9"
    >
      <Navbar />
      {children}
      <Footer />
      <Analytics />
      <SpeedInsights />
    </motion.div>
  );
}