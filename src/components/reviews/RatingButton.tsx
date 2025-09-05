import { Button } from "@/components/ui/button";

interface RatingButtonProps {
  hasReview: boolean;
  isAuthenticated: boolean;
  onOpen: () => void;
  type: "artist" | "album" | "track" | "venue";
}

export function RatingButton({
  hasReview,
  isAuthenticated,
  onOpen,
  type,
}: RatingButtonProps) {
  const baseLabel =
    type === "artist"
      ? "Puntuar artista"
      : type === "album"
      ? "Puntuar álbum"
      : type === "track"
      ? "Puntuar canción"
      : "Puntuar sala";

  const label = hasReview ? "Cambiar puntuación" : baseLabel;

  return (
    <Button
      onClick={onOpen}
      title={!isAuthenticated ? "Inicia sesión para puntuar" : undefined}
      data-hasreview={hasReview ? "1" : "0"}
    >
      {hasReview ? (
        <span className="mr-1 text-yellow-500 text-xl" aria-hidden>
          ★
        </span>
      ) : (
        <span className="mr-1 text-xl" aria-hidden>
          ☆
        </span>
      )}
      {label}
    </Button>
  );
}
