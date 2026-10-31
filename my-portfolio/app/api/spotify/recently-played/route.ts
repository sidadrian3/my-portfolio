import { NextRequest, NextResponse } from "next/server";
import { getRecentlyPlayed, SpotifyScopeError } from "../../../lib/spotify";

export async function GET(request: NextRequest) {
  const requested = parseInt(request.nextUrl.searchParams.get("limit") ?? "5", 10);
  const limit = Math.min(10, Math.max(1, Number.isNaN(requested) ? 5 : requested));

  try {
    const items = await getRecentlyPlayed(limit);
    return NextResponse.json({ items });
  } catch (error) {
    if (error instanceof SpotifyScopeError) {
      return NextResponse.json({ error: "scope" }, { status: 403 });
    }
    console.error("Spotify recently played error:", error);
    return NextResponse.json({ error: "unavailable" }, { status: 502 });
  }
}
