import { PageRes, SearchType } from "@/types/spotify";

const B = process.env.NEXT_PUBLIC_BACKEND_URL;

export class SpotifyRepository {
  static async fetchArtistByName(name: string) {
    const res = await fetch(
      `${B}/spotify/artist?name=${encodeURIComponent(name)}`
    );
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Error al buscar artista");
    return res.json();
  }
  static async fetchAlbumByName(name: string, artist: string) {
    const res = await fetch(
      `${B}/spotify/album?name=${encodeURIComponent(
        name
      )}&artistName=${encodeURIComponent(artist)}`
    );
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Error al buscar álbum");
    return res.json();
  }

  static async fetchSongByName(name: string, album?: string, artist?: string) {
    const qs = new URLSearchParams({ name });
    if (album) qs.set("albumName", album);
    if (artist) qs.set("artistName", artist);

    const res = await fetch(`${B}/spotify/track?${qs.toString()}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Error al buscar pista");
    return res.json();
  }

  static async fetchArtistAlbums(artistId: string) {
    const res = await fetch(`${B}/spotify/artist/albums?artistId=${artistId}`);
    if (!res.ok) throw new Error("Error al buscar álbumes");
    return res.json();
  }

  static async fetchArtistTopTracks(artistId: string) {
    const res = await fetch(
      `${B}/spotify/artist/top-tracks?artistId=${artistId}`
    );
    if (!res.ok) throw new Error("Error al buscar top tracks");
    return res.json();
  }

  static async fetchArtistReleases(artistId: string) {
    const res = await fetch(
      `${B}/spotify/artist/releases?artistId=${artistId}`
    );
    if (!res.ok) throw new Error("Error al buscar lanzamientos");
    return res.json();
  }

  static async fetchAlbumTracks(albumId: string) {
    const res = await fetch(`${B}/spotify/album/tracks?albumId=${albumId}`);
    if (!res.ok) throw new Error("Error al buscar pistas del álbum");
    return res.json();
  }

  static async search<T = any>(
    q: string,
    type: SearchType,
    opts?: { limit?: number; offset?: number; market?: string }
  ): Promise<PageRes<T> | null> {
    const limit = String(opts?.limit ?? 12);
    const offset = String(opts?.offset ?? 0);
    const market = opts?.market ?? "ES";

    const qs = new URLSearchParams({
      q,
      type,
      limit,
      offset,
      market,
    });

    const res = await fetch(`${B}/spotify/search?${qs.toString()}`, {
      cache: "no-store",
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Error en búsqueda");
    return res.json();
  }

  static searchArtists(
    q: string,
    opts?: { limit?: number; offset?: number; market?: string; exact?: boolean }
  ) {
    return this.search(q, "artist", opts);
  }
  static searchAlbums(
    q: string,
    opts?: { limit?: number; offset?: number; market?: string; exact?: boolean }
  ) {
    return this.search(q, "album", opts);
  }
  static searchTracks(
    q: string,
    opts?: { limit?: number; offset?: number; market?: string; exact?: boolean }
  ) {
    return this.search(q, "track", opts);
  }
}
