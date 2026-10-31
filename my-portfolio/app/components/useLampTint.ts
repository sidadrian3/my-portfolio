"use client";

import { useEffect } from "react";
import { clampLampColor } from "app/lib/color";

// Tints the page lamp while `color` is set; the CSS transition on --lamp does the easing.
export function useLampTint(color: string | null): void {
  useEffect(() => {
    if (!color) return;
    const lamp = document.querySelector<HTMLElement>("[data-lamp]");
    if (!lamp) return;

    lamp.style.setProperty("--lamp", clampLampColor(color));
    return () => {
      lamp.style.removeProperty("--lamp");
    };
  }, [color]);
}
