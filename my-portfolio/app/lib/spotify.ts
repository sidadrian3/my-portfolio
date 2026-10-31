const client_id = process.env.SPOTIFY_CLIENT_ID!;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN!;

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

interface SpotifyTokenResponse {
  access_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
}

// In-memory token cache
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

export async function getAccessToken(): Promise<string> {
  // Return cached token if it's still valid (with 60s buffer)
  if (cachedToken && Date.now() < tokenExpiresAt - 60000) {
    return cachedToken;
  }

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }),
  });

  const data: SpotifyTokenResponse = await response.json();

  if (data.error || !data.access_token) {
    throw new Error(`Spotify token error: ${data.error} - ${data.error_description}`);
  }

  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in ?? 3600) * 1000;

  return data.access_token;
}

export class SpotifyScopeError extends Error {}

export interface SpotifyTrack {
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
}

export type RecentTrack = SpotifyTrack & { playedAt: string };

export interface NowPlayingData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
}

type SpotifyApiTrack = {
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  external_urls: { spotify: string };
};

function toTrack(t: SpotifyApiTrack): SpotifyTrack {
  return {
    title: t.name,
    artist: t.artists.map((a) => a.name).join(", "),
    album: t.album.name,
    albumImageUrl: t.album.images[0]?.url ?? "",
    songUrl: t.external_urls.spotify,
  };
}

async function spotifyGet(path: string): Promise<Response> {
  const accessToken = await getAccessToken();
  return fetch(`${SPOTIFY_API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function getTopTracks(
  timeRange: string = "short_term",
  limit: number = 10
): Promise<SpotifyTrack[]> {
  const response = await spotifyGet(
    `/me/top/tracks?time_range=${timeRange}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.status}`);
  }

  const data: { items: SpotifyApiTrack[] } = await response.json();
  return data.items.map(toTrack);
}

export async function getRecentlyPlayed(limit: number): Promise<RecentTrack[]> {
  const response = await spotifyGet(`/me/player/recently-played?limit=${limit}`);

  if (response.status === 401 || response.status === 403) {
    throw new SpotifyScopeError(`Spotify API error: ${response.status}`);
  }
  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.status}`);
  }

  const data: { items: { track: SpotifyApiTrack; played_at: string }[] } =
    await response.json();
  return data.items.map((item) => ({
    ...toTrack(item.track),
    playedAt: item.played_at,
  }));
}

export async function getNowPlaying(): Promise<NowPlayingData> {
  const response = await spotifyGet("/me/player/currently-playing");

  // 204 = no content (not playing anything)
  if (response.status === 204 || response.status === 202) {
    return { isPlaying: false };
  }

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.status}`);
  }

  const data: { is_playing: boolean; item: SpotifyApiTrack | null } =
    await response.json();

  if (!data.is_playing || !data.item) {
    return { isPlaying: false };
  }

  return { isPlaying: true, ...toTrack(data.item) };
}
