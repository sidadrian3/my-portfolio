"use client";

import { useEffect, useState } from "react";
import { FastAverageColor } from "fast-average-color";
import { extractPalette } from "app/lib/color";

// 32px is plenty to find a cover's main colours and keeps the canvas read cheap
const SAMPLE_SIZE = 32;

export async function sampleDominantColor(url: string): Promise<string> {
  const result = await new FastAverageColor().getColorAsync(url, {
    algorithm: "dominant",
    crossOrigin: "anonymous",
  });
  return result.hex;
}

async function samplePalette(url: string, count: number): Promise<string[]> {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = url;
  await img.decode();

  const canvas = document.createElement("canvas");
  canvas.width = SAMPLE_SIZE;
  canvas.height = SAMPLE_SIZE;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
  return extractPalette(ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE).data, count);
}

// Resolves `sample` for the current url; stale results from a previous url are ignored
function useSampled<T>(url: string | undefined, sample: (url: string) => Promise<T>): T | null {
  const [result, setResult] = useState<{ url: string; value: T } | null>(null);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    sample(url)
      .then((value) => {
        if (!cancelled) setResult({ url, value });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [url, sample]);

  return url && result?.url === url ? result.value : null;
}

export function useDominantColor(url: string | undefined): string | null {
  return useSampled(url, sampleDominantColor);
}

const sampleFourColors = (url: string) => samplePalette(url, 4);

export function useCoverPalette(url: string | undefined): string[] | null {
  return useSampled(url, sampleFourColors);
}
