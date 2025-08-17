const B = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface MbArtist {
  id: string;
  name: string;
}

export interface ArtistDetails {
  fullName: string;
  birthDate: string | null;
  birthPlace: string | null;
  birthCountry: string | null;
  birthCountryCode: string | null;
  type: string | null;
  bio: string;
}

export async function fetchMusicBrainzMatch(
  spotifyId: string,
  name: string
): Promise<string> {
  const url =
    `${B}/musicbrainz/artist/match?` +
    `spotifyId=${encodeURIComponent(spotifyId)}` +
    `&name=${encodeURIComponent(name)}`;

  const res = await fetch(url);
  if (!res.ok) {
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

export async function fetchArtistDetails(mbid: string): Promise<ArtistDetails> {
  const res = await fetch(
    `${B}/musicbrainz/artist/details?mbid=${encodeURIComponent(mbid)}`
  );
  if (!res.ok) {
    throw new Error("Error al obtener detalles del artista desde MusicBrainz");
  }
  return res.json();
}
