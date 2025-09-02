import { deslugify } from "@/utils/normalization";
import { SpotifyService } from "@/services/spotify.service";
import { GeniusService } from "@/services/genius.service";
import { SongstatsService } from "@/services/songstats.service";
import { ReviewService } from "@/services/review.service";
import { ItemService } from "@/services/item.service";
import { mockTrackData } from "@/mocks/mockSongstats";
import { normalizeRole, roleLabelEs, sortCollabs } from "@/utils/collabs";

interface UseSongDataParams {
  artistSlug: string;
  albumSlug: string;
  songSlug: string;
}

export async function getSongData({
  artistSlug,
  albumSlug,
  songSlug,
}: UseSongDataParams) {
  try {
    const artistName = deslugify(artistSlug);
    const albumName = deslugify(albumSlug);
    const songName = deslugify(songSlug);

    // Fetch track data
    const track = await SpotifyService.fetchSongByName(
      songName,
      albumName,
      artistName
    );

    if (!track) {
      throw new Error(`Canción "${songName}" no encontrada`);
    }

    if (!track.name || !track.artists || track.artists.length === 0) {
      throw new Error(
        `Los datos de la canción "${songName}" están incompletos`
      );
    }

    const hasCorrectArtist = track.artists?.some(
      (artist: any) =>
        artist.name.toLowerCase().includes(artistName.toLowerCase()) ||
        artistName.toLowerCase().includes(artist.name.toLowerCase())
    );

    if (!hasCorrectArtist) {
      throw new Error(
        `La canción "${songName}" no pertenece al artista "${artistName}"`
      );
    }

    // Fetch album data to get label and copyrights information
    let albumLabel: string | null = null;
    let albumDistributor: string | null = null;

    try {
      const album = await SpotifyService.fetchAlbumByName(
        albumName,
        artistName
      );
      if (album) {
        albumLabel = album.label || null;

        if (album.copyrights && Array.isArray(album.copyrights)) {
          const distributorCopyright = album.copyrights.find(
            (copyright: any) => copyright.type === "P"
          );
          albumDistributor =
            distributorCopyright?.text || album.copyrights[0]?.text || null;
        }
      }
    } catch (error) {
      console.warn("Error fetching album data for label/distributor:", error);
    }

    // const songstatsInfo = await SongstatsService.getTrackInfo(track.id);
    const info = {
      ...mockTrackData,
      //   ...songstatsInfo,
      label: albumLabel || mockTrackData?.label,
      distributor: albumDistributor || mockTrackData?.distributor,
    };
    // const lyrics = await GeniusService.getLyricsByTrack(songName, artistName);
    const lyrics = {
      lyrics:
        "Esta es una letra de ejemplo para la canción. \nEsta es la segunda línea de la letra. \nEsta es la tercera línea de la letra. \nEsta es una letra de ejemplo para la canción. \nEsta es la segunda línea de la letra. \nEsta es la tercera línea de la letra. \nEsta es una letra de ejemplo para la canción. \nEsta es la segunda línea de la letra. \nEsta es la tercera línea de la letra.",
    };

    const primaryArtist = track.artists?.[0]?.name || artistName;
    const stats = (await ReviewService.getTrackReviewStats(
      track.name,
      primaryArtist,
      albumName
    ).catch(() => null)) || {
      verified: null,
      unverified: null,
      verifiedCount: 0,
      unverifiedCount: 0,
      itemId: null as number | null,
    };

    let itemId = stats.itemId ?? null;
    if (itemId == null) {
      const item = await ItemService.findItemByTypeAndName(
        "track",
        track.name,
        primaryArtist
      ).catch(() => null);
      itemId = item?.itemId ?? null;
    }

    const collaborators = info?.collaborators ?? [];
    const translatedCollaborators = (
      collaborators as Array<{ name: string; roles: string[] }>
    )
      .map((c) => {
        const translated = (c.roles || [])
          .flatMap((r) => {
            return String(r)
              .split(/[\/,&|]/g)
              .map((s) => s.trim())
              .filter(Boolean);
          })
          .map(normalizeRole)
          .sort()
          .map(roleLabelEs)
          .filter((lbl): lbl is string => Boolean(lbl));

        const unique = Array.from(new Set(translated));
        return { name: c.name, roles: unique };
      })
      .filter((c) => c.roles.length > 0);

    const collaboratorsByRole = sortCollabs(translatedCollaborators);

    return {
      track,
      info,
      lyrics,
      stats,
      itemId,
      primaryArtist,
      collaboratorsByRole,
      slugs: { artistSlug, albumSlug, songSlug },
      names: { artistName, albumName, songName },
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error al cargar los datos de la canción");
  }
}
