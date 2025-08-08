import { ReviewRepository } from "@/repositories/review.repository";

export class ReviewService {
  static async rateArtist({
    artistName,
    score,
    comment,
    userId,
  }: {
    artistName: string;
    score: number;
    comment?: string;
    userId: number;
  }) {
    return await ReviewRepository.rateArtist({
      artistName,
      score,
      comment,
      userId,
    });
  }

  static async getArtistReviewCounts(artistName: string) {
    return await ReviewRepository.getReviewCounts(artistName);
  }

  static async getReviewsByItem(itemId: number, verified: boolean) {
    return await ReviewRepository.getReviewsByItem(itemId, verified);
  }
}
