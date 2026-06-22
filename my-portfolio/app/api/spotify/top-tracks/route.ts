import { NextRequest, NextResponse } from "next/server";
import { getTopTracks } from "../../../lib/spotify";

export const revalidate = 3600; // Cache for 1 hour

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const timeRange = searchParams.get("time_range") || "short_term";
  const limit = parseInt(searchParams.get("limit") || "10", 10);

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
