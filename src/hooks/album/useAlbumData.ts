import { useState, useEffect, useCallback } from "react";
import { SpotifyService } from "@/services/spotify.service";
import { ReviewService } from "@/services/review.service";
import { deslugify, fold } from "@/utils/normalization";

interface UseAlbumDataProps {
  artistSlug: string;
  albumSlug: string;
}

export function useAlbumData({ artistSlug, albumSlug }: UseAlbumDataProps) {
  const [album, setAlbum] = useState<any>(null);
  const [tracks, setTracks] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const artistName = deslugify(artistSlug);
  const albumName = deslugify(albumSlug);

  const loadAlbumData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar álbum
      const albumData = await SpotifyService.fetchAlbumByName(
        albumName,
        artistName
      );

      if (
        !albumData ||
        !albumData.artists?.some((a: any) => fold(a.name) === fold(artistName))
      ) {
        setError("Album not found");
        return;
      }

      setAlbum(albumData);

      // Cargar tracks y stats en paralelo
      const [tracksData, statsData] = await Promise.all([
        SpotifyService.fetchAlbumTracks(albumData.id),
        ReviewService.getAlbumReviewStats(albumData.name, artistName),
      ]);

      setTracks(tracksData);
      setStats(statsData);
    } catch (err) {
      console.error("Error loading album data:", err);
      setError("Error loading album data");
    } finally {
      setLoading(false);
    }
  }, [artistName, albumName]);

  useEffect(() => {
    loadAlbumData();
  }, [loadAlbumData]);

  const albumMetadata = album
    ? {
        cover: album.images?.[0]?.url || "/default-cover.png",
        year:
          album.release_date &&
          !Number.isNaN(new Date(album.release_date).getTime())
            ? new Date(album.release_date).getFullYear()
            : undefined,
        releaseDate: album.release_date
          ? new Date(album.release_date).toLocaleDateString()
          : null,
        genre: album.genres?.[0] || null,
        spotifyUrl: album.external_urls?.spotify,
      }
    : null;

  return {
    album,
    tracks,
    stats,
    loading,
    error,
    artistName,
    albumName,
    albumMetadata,
  };
}
