import { SongstatsRepository } from "@/repositories/songstats.repository";

export type Meta = {
  bpm: number | null;
  key: string | null;
  genres: string[];
  collaborators: { name: string; roles: string[] }[];
  label: string | null;
  distributor: string | null;
};

export type RelatedArtist = {
  name: string | null;
  avatar: string | null;
  id: string | null;
};

export type ArtistInfo = {
  bio: string | null;
  genres: string[];
  related_artists: RelatedArtist[];
};

export class SongstatsService {
  static async getTrackInfo(spotifyId: string): Promise<Meta | null> {
    return await SongstatsRepository.getTrackInfo(spotifyId);
  }

  static async getArtistInfo(
    spotifyArtistId: string
  ): Promise<ArtistInfo | null> {
    return await SongstatsRepository.getArtistInfo(spotifyArtistId);
  }
}
