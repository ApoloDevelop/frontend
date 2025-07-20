import { ReviewRepository } from "@/repositories/review.repository";

export class ArtistService {
  static async rateArtist({
    artistName,
    score,
    comment,
    userId,
    birthdate,
  }: {
    artistName: string;
    score: number;
    comment?: string;
    userId: number;
    birthdate?: Date;
  }) {
    return await ReviewRepository.rateArtist({
      artistName,
      score,
      comment,
      userId,
      birthdate,
    });
  }
}
