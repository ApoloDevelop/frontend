import { ReviewRepository } from "@/repositories/review.repository";

export class ReviewService {
  static async rate(payload: {
    type: "artist" | "album" | "track" | "venue";
    name: string;
    userId: number;
    score: number;
    comment?: string;
    title?: string;
    artistName?: string; // álbum/track
    location?: string; // venue
  }) {
    return ReviewRepository.rate(payload);
  }

  static async getArtistReviewCounts(artistName: string) {
    return await ReviewRepository.getReviewCounts(artistName);
  }

  static async getAlbumReviewStats(albumName: string, artistName?: string) {
    return ReviewRepository.getAlbumReviewStats(albumName, artistName);
  }

  static async getReviewsByItem(
    itemId: number,
    verified: boolean,
    userId?: number,
    take?: number,
    cursor?: number
  ) {
    return await ReviewRepository.getReviewsByItem(
      itemId,
      verified,
      userId,
      take,
      cursor
    );
  }

  static async voteReview(reviewId: number, value: 1 | -1, userId: number) {
    return await ReviewRepository.voteReview(reviewId, value, userId);
  }
}
