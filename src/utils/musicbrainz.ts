// utils/musicbrainz.ts
const B = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface MbArtist {
  id: string;
  name: string;
}

export async function fetchMusicBrainzMatch(
  spotifyId: string,
  name: string
): Promise<string> {
  const url =
    `${B}/musicbrainz/artist/match?` +
    `spotifyId=${encodeURIComponent(spotifyId)}` +
    `&name=${encodeURIComponent(name)}`;

  console.log("Fetching MusicBrainz match:", url);

  const res = await fetch(url);
  if (!res.ok) {
    // Podrías loguear res.status o cuerpo para debug
    throw new Error("No se pudo emparejar artista en MusicBrainz");
  }
  const { mbid } = await res.json();
  return mbid as string;
}

export async function fetchSimilarByTags(
  mbid: string,
  tagsLimit = 3,
  perTag = 5,
  limit = 5
): Promise<MbArtist[]> {
  const qs = new URLSearchParams({
    mbid,
    tagsLimit: String(tagsLimit),
    perTag: String(perTag),
    limit: String(limit),
  });
  const res = await fetch(`${B}/musicbrainz/artist/similar-by-tags?${qs}`);
  if (!res.ok) throw new Error("Error fetching similar-by-tags");
  return res.json();
}
