export async function fetchArtistByName(name: string) {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BACKEND_URL
    }/spotify/artist?name=${encodeURIComponent(name)}`
  );
  if (!res.ok) throw new Error("Error al buscar artista");
  return res.json();
}

export async function fetchAlbumByName(name: string) {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BACKEND_URL
    }/spotify/album?name=${encodeURIComponent(name)}`
  );
  if (!res.ok) throw new Error("Error al buscar álbum");
  return res.json();
}

export async function fetchSongByName(name: string) {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BACKEND_URL
    }/spotify/track?name=${encodeURIComponent(name)}`
  );
  if (!res.ok) throw new Error("Error al buscar pista");
  return res.json();
}
