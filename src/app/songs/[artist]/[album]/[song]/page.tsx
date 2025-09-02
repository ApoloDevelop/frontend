import { getCurrentUser } from "@/lib/auth";
import { getSongData } from "@/hooks/song";
import { SongLayout } from "@/components/song/SongLayout";
import { slugify, wrapWord } from "@/utils/normalization";
import { checkModerationPermissions } from "@/utils/permissions";
import { ErrorPage } from "@/components/system/ErrorPage";

export default async function SongPage({
  params: rawParams,
}: {
  params: { artist: string; album: string; song: string };
}) {
  const {
    artist: artistSlug,
    album: albumSlug,
    song: songSlug,
  } = await rawParams;

  try {
    const songData = await getSongData({
      artistSlug,
      albumSlug,
      songSlug,
    });

    const user = await getCurrentUser();
    const { canModerate } = checkModerationPermissions(user);

    const breadcrumbItems = [
      { label: "ARTISTAS" },
      {
        label: wrapWord(songData.names.artistName).toUpperCase(),
        href: `/artists/${artistSlug}`,
      },
      {
        label: wrapWord(songData.names.albumName).toUpperCase(),
        href: `/albums/${artistSlug}/${slugify(songData.names.albumName)}`,
      },
      {
        label: wrapWord(songData.track.name).toUpperCase(),
        isCurrentPage: true,
      },
    ];

    const cover =
      songData.track.album?.images?.[0]?.url || "/default-cover.png";
    const durationMs = songData.track.duration_ms ?? 0;
    const explicit = !!songData.track.explicit;
    const albumRelease = songData.track.album?.release_date ?? null;
    const bpm = songData.info?.bpm ?? null;
    const key = songData.info?.key ?? null;
    const genres = songData.info?.genres ?? [];
    const label = songData.info?.label ?? null;
    const distributor = songData.info?.distributor ?? null;

    return (
      <SongLayout
        track={songData.track}
        cover={cover}
        breadcrumbItems={breadcrumbItems}
        durationMs={durationMs}
        albumRelease={albumRelease}
        genres={genres}
        explicit={explicit}
        bpm={bpm}
        musicKey={key}
        lyrics={songData.lyrics.lyrics}
        collaboratorsByRole={songData.collaboratorsByRole}
        label={label}
        distributor={distributor}
        artistSlug={artistSlug}
        albumSlug={albumSlug}
        albumName={songData.names.albumName}
        primaryArtist={songData.primaryArtist}
        stats={songData.stats}
        itemId={songData.itemId}
        user={user}
        canModerate={canModerate}
      />
    );
  } catch (error) {
    console.error("Error loading song data:", error);

    // Determinar el mensaje de error específico
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error al cargar los datos de la canción";

    return (
      <ErrorPage
        message={errorMessage}
        title="Canción no disponible"
        icon="🎵"
      />
    );
  }
}
