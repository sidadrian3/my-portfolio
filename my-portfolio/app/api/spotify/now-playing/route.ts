import { NextResponse } from "next/server";
import { getNowPlaying } from "../../../lib/spotify";

export const revalidate = 30; // Cache for 30 seconds

export async function GET() {
  try {
    const data = await getNowPlaying();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Spotify now playing error:", error);
    return NextResponse.json(
      { error: "Failed to fetch now playing" },
      { status: 500 }
    );
  }
}
