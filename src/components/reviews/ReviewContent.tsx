import { CardContent } from "../ui/card";
import { VoteButtons } from "./VoteButtons";

interface ReviewContentProps {
  reviewId: number;
  text: string | null;
  myVote: -1 | 0 | 1;
  currentUserId?: number | null;
  onVote: (reviewId: number, value: 1 | -1) => void;
}

export function ReviewContent({
  reviewId,
  text,
  myVote,
  currentUserId,
  onVote,
}: ReviewContentProps) {
  if (!text) return null;

  return (
    <CardContent className="pt-0 sm:pt-2 text-sm sm:text-base">
      {text}
      <VoteButtons
        reviewId={reviewId}
        myVote={myVote}
        currentUserId={currentUserId}
        onVote={onVote}
      />
    </CardContent>
  );
}
