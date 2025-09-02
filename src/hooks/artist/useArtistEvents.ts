import { SongstatsService } from "@/services/songstats.service";
import { mockEvent } from "@/mocks/mockSongstats";

/**
 * Hook para obtener eventos del artista
 * @param artistId - ID del artista en Spotify
 * @returns Información de eventos (usando mock por ahora)
 */
export async function getArtistEvents(artistId: string) {
  try {
    // TODO: Descomentar cuando la API esté lista
    // const eventsInfo = await SongstatsService.getArtistEventInfo(artistId);

    // Usar mock data por ahora
    const eventsInfo = mockEvent;

    return eventsInfo;
  } catch (error) {
    console.error("Error fetching artist events:", error);
    return mockEvent; // Fallback a mock data en caso de error
  }
}
