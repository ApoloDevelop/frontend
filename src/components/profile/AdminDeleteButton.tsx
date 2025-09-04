"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDeleteAccount } from "@/hooks/profile/useDeleteAccount";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AdminDeleteButtonProps {
  user: any;
  isVisible: boolean;
}

export function AdminDeleteButton({ user, isVisible }: AdminDeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { deleteAccount, isDeleting, error } = useDeleteAccount();

  if (!isVisible) return null;

  const handleDeleteUser = async () => {
    const success = await deleteAccount(user.id);
    if (success) {
      toast.success("Usuario eliminado", {
        description: `La cuenta de ${user.username} ha sido eliminada exitosamente.`,
      });

      // Redirigir a la página principal después de eliminar
      router.replace("/");
    } else {
      toast.error("Error", {
        description:
          error || "No se pudo eliminar la cuenta. Inténtalo de nuevo.",
      });
    }
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        className="text-xs relative z-50 pointer-events-auto cursor-pointer"
        disabled={isDeleting}
        onClick={() => setIsOpen(true)}
        style={{ pointerEvents: "auto", zIndex: 50 }}
      >
        <Trash2 className="w-3 h-3 mr-1" />
        {isDeleting ? "Eliminando..." : "Eliminar cuenta"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-gray-600">
              Esta acción no se puede deshacer. Se eliminará permanentemente la
              cuenta de <strong>{user.username}</strong> y todos sus datos,
              incluyendo perfil, reseñas, listas, comentarios y actividad.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Sí, eliminar cuenta"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
