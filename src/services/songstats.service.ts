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

export type ArtistEvent = {
  title: string | null;
  date: string | null;
  link: string | null;
  city: string | null;
  region: string | null;
  countryCode: string | null;
  lat: number | null;
  lng: number | null;
};

export type ArtistEventInfo = {
  counts: {
    citiesUpcoming: number;
    countriesUpcoming: number;
    eventsUpcoming: number;
  };
  upcoming: ArtistEvent[];
  past: ArtistEvent[];
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

  static async getArtistEventInfo(
    spotifyArtistId: string
  ): Promise<ArtistEventInfo | null> {
    return await SongstatsRepository.getArtistEventInfo(spotifyArtistId);
  }
}
