import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ArtistRatingModal({
  open,
  onClose,
  onSubmit,
  artistName,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (score: number, comment: string) => void;
  artistName: string;
}) {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Puntúa a {artistName}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-1">
            {[...Array(10)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setScore(i + 1)}
                onMouseEnter={() => setHovered(i + 1)}
                onMouseLeave={() => setHovered(null)}
                aria-label={`Puntuar ${i + 1}`}
                className={`text-3xl transition-colors ${
                  (hovered !== null ? i < hovered : i < score)
                    ? "text-yellow-400"
                    : "text-gray-300"
                } cursor-pointer`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            placeholder="Comentario (opcional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded p-2"
            rows={3}
          />
          <Button
            onClick={() => {
              if (score > 0) onSubmit(score, comment);
            }}
            disabled={score === 0}
          >
            Enviar valoración
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
