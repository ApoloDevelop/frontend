import { SongstatsRepository } from "@/repositories/songstats.repository";

export type Meta = {
  bpm: number | null;
  key: string | null;
  genres: string[];
  collaborators: { name: string; roles: string[] }[];
  label: string | null;
  distributor: string | null;
};

export class SongstatsService {
  static async getTrackInfo(spotifyId: string): Promise<Meta | null> {
    return await SongstatsRepository.getTrackInfo(spotifyId);
  }
}
