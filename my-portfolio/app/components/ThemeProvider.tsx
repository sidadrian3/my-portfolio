"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      forcedTheme="dark" // removed in Task 9 when the toggle ships
    >
      {children}
    </NextThemesProvider>
  );
}
