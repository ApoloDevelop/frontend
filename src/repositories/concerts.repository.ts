import { ArtistEventInfo } from "@/types/songstats";

const B = process.env.NEXT_PUBLIC_BACKEND_URL;

export class ConcertsRepository {
  static async getArtistEventInfo(
    artistName: string
  ): Promise<ArtistEventInfo | null> {
    const url = new URL(`${B}/concerts/artist/events`);
    url.searchParams.set("artistName", artistName);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as ArtistEventInfo;
  }

  // Lightweight: only upcoming events (sidebar). Much faster than the full call.
  static async getArtistUpcomingInfo(
    artistName: string
  ): Promise<ArtistEventInfo | null> {
    const url = new URL(`${B}/concerts/artist/upcoming`);
    url.searchParams.set("artistName", artistName);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as ArtistEventInfo;
  }
}
