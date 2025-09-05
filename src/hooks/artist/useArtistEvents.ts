import { SongstatsService } from "@/services/songstats.service";
import { mockEvent } from "@/mocks/mockSongstats";

export async function getArtistEvents(artistId: string) {
  try {
    const eventsInfo = await SongstatsService.getArtistEventInfo(artistId);

    // const eventsInfo = mockEvent;

    return eventsInfo;
  } catch (error) {
    console.error("Error fetching artist events:", error);
    return mockEvent;
  }
}
