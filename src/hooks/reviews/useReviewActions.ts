"use client";
import { useCallback } from "react";
import { ReviewService } from "@/services/review.service";
import { ReviewCardData } from "@/types/reviews";

interface UseReviewActionsProps {
  reviews: ReviewCardData[];
  setReviews: React.Dispatch<React.SetStateAction<ReviewCardData[]>>;
  currentUserId?: number | null;
  canModerate: boolean;
}

interface UseReviewActionsReturn {
  handleVote: (reviewId: number, value: 1 | -1) => Promise<void>;
  handleDelete: (reviewId: number) => Promise<void>;
}

export function useReviewActions({
  reviews,
  setReviews,
  currentUserId,
  canModerate,
}: UseReviewActionsProps): UseReviewActionsReturn {
  const handleVote = useCallback(
    async (reviewId: number, value: 1 | -1) => {
      if (!currentUserId) return;
      const prev = reviews;

      // Actualización optimista
      setReviews((prevList) =>
        prevList.map((r) => {
          if (r.id !== reviewId) return r;
          let up = r.upvotes,
            down = r.downvotes,
            my = r.myVote;
          if (my === value) {
            if (value === 1) up--;
            else down--;
            my = 0;
          } else {
            if (my === 1) up--;
            if (my === -1) down--;
            if (value === 1) up++;
            else down++;
            my = value;
          }
          return {
            ...r,
            upvotes: Math.max(0, up),
            downvotes: Math.max(0, down),
            myVote: my as -1 | 0 | 1,
          };
        })
      );

      try {
        await ReviewService.voteReview(reviewId, value);
      } catch (e) {
        console.error("vote failed:", e);
        setReviews(prev); // revert
      }
    },
    [currentUserId, reviews, setReviews]
  );

  const handleDelete = useCallback(
    async (reviewId: number) => {
      if (!currentUserId && !canModerate) return;
      if (!confirm("¿Eliminar esta reseña?")) return;

      try {
        await ReviewService.deleteReview(reviewId);
        window.location.reload();
      } catch (e) {
        console.error("delete failed:", e);
        alert("No se pudo eliminar la reseña");
      }
    },
    [currentUserId, canModerate]
  );

  return {
    handleVote,
    handleDelete,
  };
}
