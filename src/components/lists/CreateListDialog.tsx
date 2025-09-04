import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newListName: string;
  setNewListName: (name: string) => void;
  onCreateList: (name: string) => Promise<boolean>;
  loading: boolean;
}

export function CreateListDialog({
  open,
  onOpenChange,
  newListName,
  setNewListName,
  onCreateList,
  loading,
}: CreateListDialogProps) {
  const handleCreate = async () => {
    const success = await onCreateList(newListName);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear nueva lista</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Nombre de la lista"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="border rounded px-2 py-1"
          />

          <div className="flex justify-end gap-2">
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-gray-200 hover:bg-gray-300 text-black"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreate}
              className="text-white"
              disabled={loading || !newListName.trim()}
            >
              {loading ? "Creando..." : "Crear"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
