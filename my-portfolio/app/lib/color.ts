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
