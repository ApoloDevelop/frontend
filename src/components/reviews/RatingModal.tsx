import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";

type RateableType = "artist" | "album" | "track";

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
  };

  const resetForm = () => {
    setScore(0);
    setComment("");
    setTitle("");
    setHovered(null);
  };

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          resetForm();
          onClose();
        }
      }}
    >
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

          <div className="flex w-full justify-end gap-2">
            {/* Botón Cancelar que cierra y limpia */}
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm} // 🔄
              >
                Cancelar
              </Button>
            </DialogClose>

            <Button
              onClick={() => {
                if (score > 0) {
                  onSubmit(score, comment, title);
                  window.location.reload(); // si quieres, puedes quitar esto y hacer refetch elegante
                }
              }}
              disabled={score === 0}
            >
              Enviar valoración
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
