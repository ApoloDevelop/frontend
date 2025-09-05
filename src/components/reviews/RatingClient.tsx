"use client";
import { RatingModal } from "./RatingModal";
import { RatingButton } from "./RatingButton";
import { useRatingModal } from "@/hooks/reviews/useRatingModal";
import { useRatingSubmit } from "@/hooks/reviews/useRatingSubmit";
import { ReviewService } from "@/services/review.service";

type RateableType = "artist" | "album" | "track" | "venue";

type BaseProps = {
  type: RateableType;
  name: string;
  defaultOpen?: boolean;
  isAuthenticated: boolean;
  itemId?: number | null;
  isVerifiedUser?: boolean;
  currentUserId?: number | null;
  initialReview?: {
    id?: number;
    score: number;
    title?: string | null;
    text?: string | null;
  } | null;
};

type ExtraProps =
  | { type: "artist" }
  | { type: "album"; artistName: string }
  | { type: "track"; artistName: string; albumName: string }
  | { type: "venue"; location: string };

type RatingClientProps = BaseProps & ExtraProps;

export function RatingClient(props: RatingClientProps) {
  const { open, handleOpen, handleClose } = useRatingModal(props.defaultOpen);

  const submitProps = {
    type: props.type,
    name: props.name,
    ...(props.type === "album" ? { artistName: props.artistName } : {}),
    ...(props.type === "track"
      ? { artistName: props.artistName, albumName: props.albumName }
      : {}),
    ...(props.type === "venue" ? { location: props.location } : {}),
  };

  const { handleSubmit } = useRatingSubmit(submitProps);

  // Para eliminar reseñas, función simple
  const handleDelete = async () => {
    if (!props.initialReview?.id) return;

    if (!confirm("¿Eliminar esta reseña?")) return;

    try {
      await ReviewService.deleteReview(props.initialReview.id);
      // Recargar la página o manejar la actualización de estado
      window.location.reload();
    } catch (error) {
      console.error("Error al eliminar la reseña:", error);
      alert("No se pudo eliminar la reseña");
    }
  };

  const hasReview = !!props.initialReview;

  return (
    <>
      <RatingButton
        hasReview={hasReview}
        isAuthenticated={props.isAuthenticated}
        onOpen={() => handleOpen(props.isAuthenticated)}
        type={props.type}
      />

      <RatingModal
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        onDelete={hasReview ? handleDelete : undefined}
        name={props.name}
        type={props.type}
        initialScore={props.initialReview?.score ?? 0}
        initialTitle={props.initialReview?.title ?? ""}
        initialComment={props.initialReview?.text ?? ""}
        hasExisting={hasReview}
      />
    </>
  );
}
