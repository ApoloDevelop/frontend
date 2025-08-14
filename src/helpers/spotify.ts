const B = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function fetchArtistByName(name: string) {
  const res = await fetch(
    `${B}/spotify/artist?name=${encodeURIComponent(name)}`
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Error al buscar artista");
  return res.json();
}

export async function fetchAlbumByName(name: string, artist: string) {
  console.log(`Fetching album: ${name}`);
  const res = await fetch(
    `${B}/spotify/album?name=${encodeURIComponent(
      name
    )}&artistName=${encodeURIComponent(artist)}`
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Error al buscar álbum");
  return res.json();
}

export async function fetchSongByName(
  name: string,
  album?: string,
  artist?: string
) {
  const qs = new URLSearchParams({ name });
  if (album) qs.set("albumName", album);
  if (artist) qs.set("artistName", artist);

  const res = await fetch(`${B}/spotify/track?${qs.toString()}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Error al buscar pista");
  return res.json();
}

export async function fetchArtistAlbums(artistId: string) {
  const res = await fetch(`${B}/spotify/artist/albums?artistId=${artistId}`);
  if (!res.ok) throw new Error("Error al buscar álbumes");
  return res.json();
}

export async function fetchArtistTopTracks(artistId: string) {
  const res = await fetch(
    `${B}/spotify/artist/top-tracks?artistId=${artistId}`
  );
  if (!res.ok) throw new Error("Error al buscar top tracks");
  return res.json();
}

export async function fetchArtistReleases(artistId: string) {
  const res = await fetch(`${B}/spotify/artist/releases?artistId=${artistId}`);
  if (!res.ok) throw new Error("Error al buscar lanzamientos");
  return res.json();
}

export async function fetchAlbumTracks(albumId: string) {
  const res = await fetch(`${B}/spotify/album/tracks?albumId=${albumId}`);
  if (!res.ok) throw new Error("Error al buscar pistas del álbum");
  return res.json();
}
