import { ReviewRepository } from "@/repositories/review.repository";

export class ReviewService {
  static async rate(payload: {
    type: "artist" | "album" | "track" | "venue";
    name: string;
    artistName?: string; // álbum/track
    albumName?: string; // track
    score: number;
    comment?: string;
    title?: string;
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

  static async getTrackReviewStats(
    trackName: string,
    artistName: string,
    albumName: string
  ) {
    return ReviewRepository.getTrackReviewStats(
      trackName,
      artistName,
      albumName
    );
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

  static async voteReview(reviewId: number, value: 1 | -1) {
    return await ReviewRepository.voteReview(reviewId, value);
  }

  static async deleteReview(reviewId: number) {
    return ReviewRepository.deleteReview(reviewId);
  }
}
