import { ThumbsUp, ThumbsDown } from "lucide-react";

interface VoteButtonsProps {
  reviewId: number;
  myVote: -1 | 0 | 1;
  currentUserId?: number | null;
  onVote: (reviewId: number, value: 1 | -1) => void;
}

export function VoteButtons({
  reviewId,
  myVote,
  currentUserId,
  onVote,
}: VoteButtonsProps) {
  if (!currentUserId) return null;

  return (
    <div className="mt-3 flex items-center gap-3">
      <button
        onClick={() => onVote(reviewId, 1)}
        aria-pressed={myVote === 1}
        className={`cursor-pointer inline-flex items-center justify-center rounded-full border px-2.5 py-1.5 transition ${
          myVote === 1
            ? "bg-green-50 border-green-500 text-green-700"
            : "border-transparent hover:bg-green-50 text-green-600"
        }`}
        title="Estoy de acuerdo"
      >
        <ThumbsUp className="h-4 w-4" />
      </button>
      <button
        onClick={() => onVote(reviewId, -1)}
        aria-pressed={myVote === -1}
        className={`cursor-pointer inline-flex items-center justify-center rounded-full border px-2.5 py-1.5 transition ${
          myVote === -1
            ? "bg-red-50 border-red-500 text-red-700"
            : "border-transparent hover:bg-red-50 text-red-600"
        }`}
        title="No estoy de acuerdo"
      >
        <ThumbsDown className="h-4 w-4" />
      </button>
    </div>
  );
}
