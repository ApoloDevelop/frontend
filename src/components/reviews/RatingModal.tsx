import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type RateableType = "artist" | "album" | "track" | "venue";

export function RatingModal({
  open,
  onClose,
  onSubmit,
  name,
  type,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (score: number, comment: string, title: string) => void;
  name: string;
  type: RateableType;
}) {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const [hovered, setHovered] = useState<number | null>(null);

  const headingByType: Record<RateableType, string> = {
    artist: "Puntúa a",
    album: "Puntúa el álbum",
    track: "Puntúa la canción",
    venue: "Puntúa la sala",
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {headingByType[type]} {name}
          </DialogTitle>
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
          {score > 0 && (
            <p className="text-lg font-semibold">Tu nota: {score}</p>
          )}
          <input
            type="text"
            placeholder="Título (opcional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded p-2"
          />
          <textarea
            placeholder="Comentario (opcional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded p-2"
            rows={3}
          />
          <Button
            onClick={() => {
              if (score > 0) {
                onSubmit(score, comment, title);
                window.location.reload(); // Refrescar la página
              }
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
