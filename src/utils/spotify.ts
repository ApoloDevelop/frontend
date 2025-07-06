export async function fetchArtistByName(name: string) {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BACKEND_URL
    }/spotify/artist?name=${encodeURIComponent(name)}`
  );
  if (!res.ok) throw new Error("Error al buscar artista");
  return res.json();
}
