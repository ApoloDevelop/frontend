import { Card, CardHeader } from "../ui/card";
import { ReviewHeader } from "./ReviewHeader";
import { ReviewContent } from "./ReviewContent";
import { ReviewCardData } from "@/types/reviews";

interface ReviewCardProps {
  review: ReviewCardData;
  currentUserId?: number | null;
  canModerate: boolean;
  onVote: (reviewId: number, value: 1 | -1) => void;
  onDelete: (reviewId: number) => void;
  verified: boolean;
}

export function ReviewCard({
  review,
  currentUserId,
  canModerate,
  onVote,
  onDelete,
  verified,
}: ReviewCardProps) {
  return (
    <Card key={review.id} className="overflow-hidden">
      <CardHeader className="flex justify-between items-start sm:items-center gap-3 sm:gap-4">
        <ReviewHeader
          review={review}
          currentUserId={currentUserId}
          canModerate={canModerate}
          onDelete={onDelete}
          verified={verified}
        />
      </CardHeader>

      <ReviewContent
        reviewId={review.id}
        text={review.text ?? null}
        myVote={review.myVote}
        currentUserId={currentUserId}
        onVote={onVote}
      />
    </Card>
  );
}
