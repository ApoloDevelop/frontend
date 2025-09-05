import { SpotifyService } from "@/services/spotify.service";
import { ReviewService } from "@/services/review.service";
import { ItemService } from "@/services/item.service";
import { SongstatsService } from "@/services/songstats.service";
import { fetchMusicBrainzMatch, fetchArtistDetails } from "@/utils/musicbrainz";
import { mockArtistData } from "@/mocks/mockSongstats";
import { ArtistDetails } from "@/types/musicbrainz";

interface ArtistDataHookReturn {
  artistData: any;
  reviewCounts: any;
  item: any;
  averages: { verified: number | null; unverified: number | null };
  details: ArtistDetails | null;
  albums: any[];
  topTracks: any[];
  releases: any[];
  lastRelease: any;
  bio: string | null;
  genres: string[];
  relatedArtists: any[];
  mbid: string | null;
  links: { source: string; url: string }[];
}

export async function getArtistData(
  artistName: string
): Promise<ArtistDataHookReturn> {
  // Fetch datos del artista desde Spotify
  const artistData = await SpotifyService.fetchArtistByName(artistName);
  if (!artistData) {
    throw new Error("Artista no encontrado");
  }

  // Fetch reviewCounts e item en paralelo
  const [reviewCounts, item] = await Promise.all([
    ReviewService.getArtistReviewCounts(artistData.name),
    ItemService.findItemByTypeAndName("artist", artistData.name),
  ]);

  const info = await SongstatsService.getArtistInfo(artistData.id);
  // const info = mockArtistData;
  const bio = info?.bio || null;
  const genres = info?.genres || [];
  const relatedArtists = info?.related_artists || [];
  const links = info?.links || [];

  // Fetch datos de Spotify en paralelo
  const [albums, topTracks, releases] = await Promise.all([
    SpotifyService.fetchArtistAlbums(artistData.id),
    SpotifyService.fetchArtistTopTracks(artistData.id),
    SpotifyService.fetchArtistReleases(artistData.id),
  ]);

  // Fetch averages de reviews
  let averages: { verified: number | null; unverified: number | null } = {
    verified: null,
    unverified: null,
  };

  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/reviews/artist/average?artistName=${encodeURIComponent(
        artistData.name
      )}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      averages = await res.json();
    }
  } catch (e) {
    console.warn("Error fetching averages:", e);
  }

  // Fetch datos de MusicBrainz
  let mbid: string | null = null;
  let details: ArtistDetails | null = null;

  try {
    mbid = await fetchMusicBrainzMatch(artistData.id, artistData.name);
    if (mbid) {
      details = await fetchArtistDetails(mbid);
    }
  } catch (err) {
    console.warn("Error fetching MusicBrainz data:", err);
  }

  // Calcular el último lanzamiento
  const lastRelease = releases
    .slice()
    .sort(
      (a: { release_date: string }, b: { release_date: string }) =>
        new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
    )[0];

  return {
    artistData,
    reviewCounts,
    item,
    averages,
    details,
    albums,
    topTracks,
    releases,
    lastRelease,
    bio,
    genres,
    relatedArtists,
    mbid,
    links,
  };
}
