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
}
