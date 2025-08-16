const B = process.env.NEXT_PUBLIC_BACKEND_URL;

export type Meta = {
  bpm: number | null;
  key: string | null;
  genres: string[];
  collaborators: { name: string; roles: string[] }[];
  label: string | null;
  distributor: string | null;
};

export type RelatedArtist = {
  id: string | null;
  name: string | null;
  avatar: string | null;
};

export type ArtistInfo = {
  bio: string | null;
  genres: string[];
  related_artists: RelatedArtist[];
};

export type ArtistEvent = {
  title: string | null;
  date: string | null; // YYYY-MM-DD
  link: string | null;
  city: string | null;
  region: string | null;
  countryCode: string | null;
  lat: number | null;
  lng: number | null;
};

export type ArtistEventInfo = {
  counts: {
    citiesUpcoming: number;
    countriesUpcoming: number;
    eventsUpcoming: number;
  };
  upcoming: ArtistEvent[];
  past: ArtistEvent[];
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
