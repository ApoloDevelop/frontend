import { SpotifyService } from "@/services/spotify.service";
import { ReviewService } from "@/services/review.service";
import { deslugify, fold } from "@/utils/normalization";
import { getCurrentUser } from "@/lib/auth";
import { AlbumLayout } from "@/components/album/AlbumLayout";
import { ErrorPage } from "@/components/system/ErrorPage";

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ artist: string; album: string }>;
}) {
  const { artist: artistSlug, album: albumSlug } = await params;
  const user = await getCurrentUser();

  const artistName = deslugify(artistSlug);
  const albumName = deslugify(albumSlug);

  try {
    const album = await SpotifyService.fetchAlbumByName(albumName, artistName);

    if (
      !album ||
      !album.artists?.some((a: any) => fold(a.name) === fold(artistName))
    ) {
      return (
        <ErrorPage
          message="Álbum no encontrado"
          title="Álbum no disponible"
          icon="💿"
        />
      );
    }

    const [tracks, stats] = await Promise.all([
      SpotifyService.fetchAlbumTracks(album.id),
      ReviewService.getAlbumReviewStats(album.name, artistName),
    ]);

    const albumMetadata = {
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
    };

    const breadcrumbItems = [
      { label: "ARTISTAS" },
      { label: artistName.toUpperCase(), href: `/artists/${artistSlug}` },
      {
        label: album.name.toUpperCase(),
        isCurrentPage: true,
      },
    ];

    return (
      <AlbumLayout
        album={album}
        tracks={tracks}
        stats={stats}
        artistName={artistName}
        albumSlug={albumSlug}
        albumMetadata={albumMetadata}
        breadcrumbItems={breadcrumbItems}
        user={user}
      />
    );
  } catch (error) {
    console.error("Error loading album data:", error);
    return (
      <ErrorPage
        message="Error al cargar los datos del álbum"
        title="Álbum no disponible"
        icon="💿"
      />
    );
  }
}
