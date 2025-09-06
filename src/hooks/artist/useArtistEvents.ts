import { SongstatsService } from "@/services/songstats.service";
import { mockEvent } from "@/mocks/mockSongstats";

export async function getArtistEvents(artistId: string) {
  try {
    // let eventsInfo;
    // try {
    //   eventsInfo = await SongstatsService.getArtistEventInfo(artistId);
    // } catch (error) {
    //   console.warn("Error fetching artist event data:", error);
    //   eventsInfo = mockEvent;
    // }

    const eventsInfo = mockEvent;

    return eventsInfo;
  } catch (error) {
    console.error("Error fetching artist events:", error);
    return mockEvent;
  }
}
