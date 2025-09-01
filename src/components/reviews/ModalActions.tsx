import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";

interface ModalActionsProps {
  score: number;
  hasExisting: boolean;
  onSubmit: () => void;
}

export function ModalActions({
  score,
  hasExisting,
  onSubmit,
}: ModalActionsProps) {
  const cta = hasExisting ? "Actualizar reseña" : "Guardar";

  return (
    <div className="flex w-full justify-end gap-2">
      <DialogClose asChild>
        <Button type="button" variant="outline">
          Cancelar
        </Button>
      </DialogClose>

      <Button onClick={onSubmit} disabled={score === 0}>
        {cta}
      </Button>
    </div>
  );
}
