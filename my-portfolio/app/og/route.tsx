import { ImageResponse } from "next/og";
import { metaData } from "app/config";

// The bundled OG font has no bold weight, so fetch Roboto Bold for just the glyphs on the card.
const FONT_TIMEOUT_MS = 2500;

async function loadBoldFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Roboto:wght@700&text=${encodeURIComponent(text)}`, {
        signal: AbortSignal.timeout(FONT_TIMEOUT_MS),
      })
    ).text();
    const fontUrl = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!fontUrl) return null;
    return await (await fetch(fontUrl, { signal: AbortSignal.timeout(FONT_TIMEOUT_MS) })).arrayBuffer();
  } catch {
    return null;
  }
}

// Social card: fixed brand colours, since theme tokens don't exist outside the page.
export async function GET(request: Request) {
  const title = new URL(request.url).searchParams.get("title") || metaData.title;
  const bold = await loadBoldFont(`sid.${title}`);

  return new ImageResponse(
    (
      <div tw="flex flex-col justify-between w-full h-full bg-black p-20 text-[#F5F0E8]">
        <div tw="flex text-5xl font-bold">sid.</div>
        <div tw="flex text-8xl font-bold">{title}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: bold ? [{ name: "Roboto", data: bold, weight: 700, style: "normal" }] : undefined,
    }
  );
}
