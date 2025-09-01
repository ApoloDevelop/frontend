"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRatingForm } from "@/hooks/reviews/useRatingForm";
import { StarRating } from "./StarRating";
import { CommentForm } from "./CommentForm";
import { ModalActions } from "./ModalActions";

type RateableType = "artist" | "album" | "track" | "venue";

export function RatingModal({
  open,
  onClose,
  onSubmit,
  name,
  type,
  initialScore = 0,
  initialTitle = "",
  initialComment = "",
  hasExisting = false,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (score: number, comment: string, title: string) => void;
  name: string;
  type: RateableType;
  initialScore?: number;
  initialTitle?: string;
  initialComment?: string;
  hasExisting?: boolean;
}) {
  const {
    score,
    setScore,
    comment,
    setComment,
    title,
    setTitle,
    hovered,
    setHovered,
  } = useRatingForm({
    open,
    initialScore,
    initialTitle,
    initialComment,
  });

  const heading = hasExisting ? `Tu reseña de ${name}` : `Puntúa a ${name}`;

  const handleSubmit = () => {
    if (score > 0) {
      onSubmit(score, comment, title);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{heading}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <StarRating
            score={score}
            hovered={hovered}
            onScoreChange={setScore}
            onHover={setHovered}
          />

          {score > 0 && (
            <p className="text-lg font-semibold">Tu nota: {score}</p>
          )}

          <CommentForm
            title={title}
            comment={comment}
            onTitleChange={setTitle}
            onCommentChange={setComment}
          />

          <ModalActions
            score={score}
            hasExisting={hasExisting}
            onSubmit={handleSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
