import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  reviewId: number;
  canDelete: boolean;
  onDelete: (reviewId: number) => void;
}

export function DeleteButton({
  reviewId,
  canDelete,
  onDelete,
}: DeleteButtonProps) {
  if (!canDelete) return null;

  return (
    <div className="mt-1">
      <button
        onClick={() => onDelete(reviewId)}
        className="inline-flex items-center gap-1 text-sm text-red-600 hover:underline cursor-pointer"
        title="Eliminar reseña"
      >
        <Trash2 className="h-4 w-4" /> Eliminar reseña
      </button>
    </div>
  );
}
