import { NextRequest, NextResponse } from "next/server";
import { getTopTracks } from "../../../lib/spotify";

export const revalidate = 3600; // Cache for 1 hour

const TIME_RANGES = ["short_term", "medium_term", "long_term"];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const requestedRange = searchParams.get("time_range") ?? "";
  const timeRange = TIME_RANGES.includes(requestedRange) ? requestedRange : "short_term";
  const requested = parseInt(searchParams.get("limit") ?? "10", 10);
  const limit = Math.min(10, Math.max(1, Number.isNaN(requested) ? 10 : requested));

  try {
    const tracks = await getTopTracks(timeRange, limit);
    return NextResponse.json({ items: tracks });
  } catch (error) {
    console.error("Spotify top tracks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch top tracks" },
      { status: 500 }
    );
  }
}
