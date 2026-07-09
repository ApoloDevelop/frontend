import { ConcertsService } from "@/services/concerts.service";
import { ArtistEventInfo } from "@/types/songstats";

const EMPTY: ArtistEventInfo = {
  counts: { citiesUpcoming: 0, countriesUpcoming: 0, eventsUpcoming: 0 },
  upcoming: [],
  past: [],
};

export async function getArtistEvents(artistName: string): Promise<ArtistEventInfo> {
  try {
    const info = await ConcertsService.getArtistEventInfo(artistName);
    return info ?? EMPTY;
  } catch (error) {
    console.error("Error fetching artist events:", error);
    return EMPTY;
  }
}
