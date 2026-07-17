import Link from "next/link";
// import { ThemeSwitch } from "./theme-switch";
import { metaData } from "../config";
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

const navItems = {
  "/about": { name: "About" },
  "/photos": { name: "Photos" },
  "/contact": { name: "Contact" },
};

import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  
  return (
    <nav className="sticky top-0 z-40 w-full glass-panel lg:mb-8 transition-all duration-300">
      <div className="max-w-[1000px] mx-auto px-6 sm:px-4 md:px-9 flex flex-col md:flex-row md:items-center justify-between py-4">
        <div className="flex items-center">
          <Link
            href="/"
            className={`${robotoFlex.variable} text-2xl font-light tracking-tight font-robotoFlex opacity-90 hover:opacity-100 transition-opacity`}
          >
            {metaData.title}
          </Link>
        </div>
        <div className="flex flex-row gap-6 mt-4 md:mt-0 md:ml-auto items-center overflow-x-auto no-scrollbar">
          {Object.entries(navItems).map(([path, { name }]) => {
            const isActive = pathname === path;
            return (
              <Link
                key={path}
                href={path}
                className={`text-sm font-normal transition-all duration-300 relative ${
                  isActive ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {name}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-white rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
