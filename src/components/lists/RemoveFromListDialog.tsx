import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RemoveFromListDialogProps {
  open: boolean;
  onOpenChange: () => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export function RemoveFromListDialog({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
}: RemoveFromListDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar de la lista</DialogTitle>
        </DialogHeader>
        <p>¿Estás seguro de que deseas eliminar este ítem de la lista?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={onOpenChange}
            className="bg-gray-200 hover:bg-gray-300 text-black"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-red-500 hover:bg-red-600 text-white"
            disabled={loading}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
