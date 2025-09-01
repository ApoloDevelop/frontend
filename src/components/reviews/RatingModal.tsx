import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";

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
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      setScore(initialScore ?? 0);
      setTitle(initialTitle ?? "");
      setComment(initialComment ?? "");
      setHovered(null);
    } else {
      setScore(0);
      setTitle("");
      setComment("");
      setHovered(null);
    }
  }, [open, initialScore, initialTitle, initialComment]);

  const heading = hasExisting ? `Tu reseña de ${name}` : `Puntúa a ${name}`;
  const cta = hasExisting ? "Actualizar reseña" : "Guardar";

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
          {/* Estrellas 1..10 */}
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
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

          <div className="flex w-full justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>

            <Button
              onClick={() => score > 0 && onSubmit(score, comment, title)}
              disabled={score === 0}
            >
              {cta}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
