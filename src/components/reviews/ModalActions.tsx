import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";

interface ModalActionsProps {
  score: number;
  hasExisting: boolean;
  onSubmit: () => void;
  onDelete?: () => void;
}

export function ModalActions({
  score,
  hasExisting,
  onSubmit,
  onDelete,
}: ModalActionsProps) {
  const cta = hasExisting ? "Actualizar reseña" : "Guardar";

  return (
    <div className="flex w-full justify-between gap-2">
      <div className="flex gap-2">
        {hasExisting && onDelete && (
          <Button type="button" variant="destructive" onClick={onDelete}>
            Eliminar reseña
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancelar
          </Button>
        </DialogClose>

        <Button onClick={onSubmit} disabled={score === 0}>
          {cta}
        </Button>
      </div>
    </div>
  );
}
