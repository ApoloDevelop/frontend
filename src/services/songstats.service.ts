import { SongstatsRepository } from "@/repositories/songstats.repository";
import { ArtistEventInfo, ArtistInfo, Meta } from "@/types/songstats";

export class SongstatsService {
  static async getTrackInfo(spotifyId: string): Promise<Meta | null> {
    return await SongstatsRepository.getTrackInfo(spotifyId);
  }

  static async getArtistInfo(
    spotifyArtistId: string
  ): Promise<ArtistInfo | null> {
    return await SongstatsRepository.getArtistInfo(spotifyArtistId);
  }

  static async getArtistEventInfo(
    spotifyArtistId: string
  ): Promise<ArtistEventInfo | null> {
    return await SongstatsRepository.getArtistEventInfo(spotifyArtistId);
  }
}
