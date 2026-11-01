"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <span aria-hidden className="inline-block h-10 w-10" />;

  const isDark = resolvedTheme !== "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="press relative inline-flex h-10 w-10 items-center justify-center text-mute transition-colors hover:text-ink"
    >
      <FiSun
        aria-hidden
        size={18}
        className={`absolute transition-opacity duration-150 motion-reduce:transition-none ${isDark ? "opacity-100" : "opacity-0"}`}
      />
      <FiMoon
        aria-hidden
        size={18}
        className={`absolute transition-opacity duration-150 motion-reduce:transition-none ${isDark ? "opacity-0" : "opacity-100"}`}
      />
    </button>
  );
}
