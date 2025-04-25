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
  // "/blog": { name: "Blog" },
  "/projects": { name: "Projects" },
  "/photos": { name: "Photos" },
};

export function Navbar() {
  return (
    <nav className=" lg:mb-16 mb-12 py-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className={`${jockeyOne.variable} ${robotoFlex.variable} transition-transform transform hover:scale-105 text-5xl font-semibold font-jockeyOne`}>

            {metaData.title}
          </Link>
        </div>
        <div className="flex flex-row gap-4 mt-6 md:mt-0 md:ml-auto items-center">
          {Object.entries(navItems).map(([path, { name }]) => (
            <Link
              key={path}
              href={path}
              className="transition-transform transform hover:scale-105 hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative"
              >
              {name}
            </Link>
          ))}
          {/* <ThemeSwitch /> */}
        </div>
      </div>
    </nav>
  );
}
