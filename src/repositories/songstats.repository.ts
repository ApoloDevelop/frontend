const B = process.env.NEXT_PUBLIC_BACKEND_URL;

export type Meta = {
  bpm: number | null;
  key: string | null;
  genres: string[];
  collaborators: { name: string; roles: string[] }[];
  label: string | null;
  distributor: string | null;
};

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
}
