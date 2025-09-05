import { ArtistEventInfo, ArtistInfo, Meta } from "@/types/songstats";

const B = process.env.NEXT_PUBLIC_BACKEND_URL;

export class SongstatsRepository {
  static async getTrackInfo(spotifyId: string): Promise<Meta | null> {
    const url = new URL(`${B}/songstats/track/info`);
    url.searchParams.set("spotifyId", spotifyId);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (res.status === 404) return null;
    if (!res.ok) {
      throw new Error("Error al buscar información de la pista");
    }
    return (await res.json()) as Meta;
  }

  static async getArtistInfo(
    spotifyArtistId: string
  ): Promise<ArtistInfo | null> {
    const url = new URL(`${B}/songstats/artist/info`);
    url.searchParams.set("spotifyArtistId", spotifyArtistId);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Error al buscar información del artista");
    return (await res.json()) as ArtistInfo;
  }

  static async getArtistEventInfo(
    spotifyArtistId: string
  ): Promise<ArtistEventInfo | null> {
    const url = new URL(`${B}/songstats/artist/events`);
    url.searchParams.set("spotifyArtistId", spotifyArtistId);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Error al buscar eventos del artista");
    return (await res.json()) as ArtistEventInfo;
  }
}
