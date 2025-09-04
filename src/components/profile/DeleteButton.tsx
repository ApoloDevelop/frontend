"use client";

import { ActivityService } from "@/services/activity.service";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DeleteButtonProps {
  postId: number;
  onDeleted: (id: number) => void;
}

export function DeleteButton({ postId, onDeleted }: DeleteButtonProps) {
  const handleDelete = async () => {
    // Mostrar confirmación
    const confirmed = window.confirm(
      "¿Estás seguro de que quieres borrar esta publicación? Esta acción no se puede deshacer."
    );

    if (!confirmed) return;

    try {
      await ActivityService.remove(postId);
      onDeleted(postId);
      toast.success("Publicación borrada exitosamente");
    } catch (error: any) {
      toast.error(error?.message || "No se pudo borrar la publicación");
    }
  };

  return (
    <div className="mt-3">
      <Button
        size="sm"
        variant="outline"
        onClick={handleDelete}
        className="w-full"
      >
        Borrar
      </Button>
    </div>
  );
}
