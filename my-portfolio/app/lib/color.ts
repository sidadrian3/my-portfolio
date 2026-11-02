const DEFAULT_LAMP = "rgb(245 240 232)";
// Bounds sit just inside 55% / 35-60% so 8-bit rounding can't push a channel outside them
const MAX_SATURATION = 0.54;
const MIN_LIGHTNESS = 0.36;
const MAX_LIGHTNESS = 0.59;

function parseHex(hex: string): [number, number, number] | null {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  const digits =
    match[1].length === 3
      ? match[1].split("").map((c) => c + c).join("")
      : match[1];
  return [0, 2, 4].map((i) => parseInt(digits.slice(i, i + 2), 16)) as [
    number,
    number,
    number,
  ];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h / 6, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const channel = (t: number) => {
    const x = (t + 1) % 1;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };
  return [channel(h + 1 / 3), channel(h), channel(h - 1 / 3)];
}

export function clampLampColor(hex: string): string {
  const rgb = parseHex(hex);
  if (!rgb) return DEFAULT_LAMP;

  const [h, s, l] = rgbToHsl(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
  const [r, g, b] = hslToRgb(
    h,
    Math.min(s, MAX_SATURATION),
    Math.min(MAX_LIGHTNESS, Math.max(MIN_LIGHTNESS, l))
  ).map((v) => Math.round(v * 255));

  return `rgb(${r} ${g} ${b})`;
}

type Bucket = { r: number; g: number; b: number; n: number };

// Two swatches closer than this (RGB distance) read as the same colour
const MIN_SWATCH_DISTANCE = 56;

function toHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
}

function distance(a: Bucket, b: Bucket): number {
  return Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);
}

// Most common distinct colours in RGBA pixel data, most frequent first. May return fewer than `count`.
export function extractPalette(pixels: Uint8ClampedArray, count: number): string[] {
  const buckets = new Map<number, Bucket>();
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] < 128) continue;
    const [r, g, b] = [pixels[i], pixels[i + 1], pixels[i + 2]];
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    const bucket = buckets.get(key) ?? { r: 0, g: 0, b: 0, n: 0 };
    bucket.r += r;
    bucket.g += g;
    bucket.b += b;
    bucket.n += 1;
    buckets.set(key, bucket);
  }

  const ranked = Array.from(buckets.values())
    .sort((a, b) => b.n - a.n)
    .map((s) => ({ r: s.r / s.n, g: s.g / s.n, b: s.b / s.n, n: s.n }));

  const picked: Bucket[] = [];
  for (const swatch of ranked) {
    if (picked.length === count) break;
    if (picked.every((p) => distance(p, swatch) >= MIN_SWATCH_DISTANCE)) picked.push(swatch);
  }

  return picked.map((s) => toHex(s.r, s.g, s.b));
}
