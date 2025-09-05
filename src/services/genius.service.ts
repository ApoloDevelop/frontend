import { GeniusRepository } from "@/repositories/genius.repository";

export class GeniusService {
  static async getLyricsByTrack(
    title: string,
    artist: string
  ): Promise<any | null> {
    return GeniusRepository.getLyricsByTrack(title, artist);
  }
}
