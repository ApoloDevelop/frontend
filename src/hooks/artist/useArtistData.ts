import { SpotifyService } from "@/services/spotify.service";
import { deslugify } from "@/utils/normalization";

export interface Artist {
  id: string;
  name: string;
  images?: Array<{ url: string }>;
  [key: string]: any;
}

interface UseArtistDataReturn {
  artist: Artist | null;
  error: string | null;
}

export async function getArtistData(
  slug: string
): Promise<UseArtistDataReturn> {
  try {
    const artistName = decodeURIComponent(deslugify(slug));
    const artistData = await SpotifyService.fetchArtistByName(artistName);

    if (!artistData) {
      return {
        artist: null,
        error: "Artista no encontrado",
      };
    }

    return {
      artist: artistData,
      error: null,
    };
  } catch (error) {
    return {
      artist: null,
      error: "Error al cargar los datos del artista",
    };
  }
}
