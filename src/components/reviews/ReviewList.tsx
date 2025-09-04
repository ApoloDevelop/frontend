import { ReviewCard } from "./ReviewCard";
import { ReviewCardData } from "@/types/reviews";

interface ReviewListProps {
  myReview: ReviewCardData | null;
  otherReviews: ReviewCardData[];
  currentUserId?: number | null;
  canModerate: boolean;
  onVote: (reviewId: number, value: 1 | -1) => void;
  onDelete: (reviewId: number) => void;
  isLoading: boolean;
  nextCursor: number | null;
  totalReviews: number;
  filterScore: number | null;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
}

export function ReviewList({
  myReview,
  otherReviews,
  currentUserId,
  canModerate,
  onVote,
  onDelete,
  isLoading,
  nextCursor,
  totalReviews,
  filterScore,
  scrollRef,
  sentinelRef,
}: ReviewListProps) {
  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 pr-1"
      style={{ minHeight: 0 }}
    >
      {/* Mi reseña */}
      {myReview && (
        <>
          <h4 className="text-sm font-semibold text-purple-800 mb-1">
            Tu reseña
          </h4>

          <ReviewCard
            review={myReview}
            currentUserId={currentUserId}
            canModerate={canModerate}
            onVote={onVote}
            onDelete={onDelete}
          />

          {otherReviews.length > 0 && (
            <h4 className="text-sm font-semibold text-gray-700 mt-4">
              Otras reseñas
            </h4>
          )}
        </>
      )}

      {/* Otras reseñas */}
      {otherReviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          currentUserId={currentUserId}
          canModerate={canModerate}
          onVote={onVote}
          onDelete={onDelete}
        />
      ))}

      {/* Sentinel para infinite scroll */}
      <div ref={sentinelRef} />

      {/* Estados */}
      {isLoading && (
        <div className="py-3 text-center text-sm text-muted-foreground">
          Cargando…
        </div>
      )}

      {!isLoading && nextCursor === null && totalReviews > 0 && (
        <div className="py-3 text-center text-sm text-muted-foreground">
          No hay más reseñas
        </div>
      )}

      {totalReviews === 0 && !isLoading && (
        <div className="text-sm text-muted-foreground px-1 py-2">
          {filterScore == null
            ? "No hay reseñas todavía."
            : `No hay reseñas con puntuación ${filterScore}.`}
        </div>
      )}
    </div>
  );
}
