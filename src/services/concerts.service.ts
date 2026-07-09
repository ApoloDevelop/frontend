import { ConcertsRepository } from "@/repositories/concerts.repository";
import { ArtistEventInfo } from "@/types/songstats";

export class ConcertsService {
  static async getArtistEventInfo(
    artistName: string
  ): Promise<ArtistEventInfo | null> {
    return ConcertsRepository.getArtistEventInfo(artistName);
  }

  static async getArtistUpcomingInfo(
    artistName: string
  ): Promise<ArtistEventInfo | null> {
    return ConcertsRepository.getArtistUpcomingInfo(artistName);
  }
}
