"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { clearSession } from "@/lib/auth";
import { useDeleteAccount } from "@/hooks/profile/useDeleteAccount";

interface DangerZoneFormProps {
  user: any;
  onClose: () => void;
}

export function DangerZoneForm({ user, onClose }: DangerZoneFormProps) {
  const [confirmText, setConfirmText] = useState("");
  const router = useRouter();
  const { deleteAccount, isDeleting, error } = useDeleteAccount();

  const expectedText = `eliminar ${user.username}`;
  const canDelete = confirmText.toLowerCase() === expectedText.toLowerCase();

  const handleDeleteAccount = async () => {
    if (!canDelete) return;

    const success = await deleteAccount(user.id);
    if (success) {
      // Limpiar sesión y redirigir
      clearSession();
      toast.success("Cuenta eliminada", {
        description: "Tu cuenta ha sido eliminada exitosamente.",
      });

      onClose();
      router.replace("/login");
      router.refresh();
    } else {
      toast.error("Error", {
        description:
          error || "No se pudo eliminar la cuenta. Inténtalo de nuevo.",
      });
    }
  };

  return (
    <div className="space-y-3 h-full overflow-y-auto">
      <div className="p-3 sm:p-4 border border-red-200 rounded-lg bg-red-50 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <Trash2 className="w-4 h-4 text-red-600 flex-shrink-0" />
          <h3 className="text-sm sm:text-base font-semibold text-red-800">
            Eliminar cuenta
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-red-700 mb-3 leading-relaxed">
          Esta acción no se puede deshacer. Se eliminarán permanentemente todos
          tus datos, incluyendo tu perfil, reseñas, listas, comentarios y
          actividad.
        </p>

        <div className="space-y-3">
          <div>
            <div className="text-xs sm:text-sm text-red-800 font-medium mb-2">
              Para confirmar, escribe &quot;{expectedText}&quot; en el campo de
              abajo:
            </div>
            <Input
              id="confirm-delete"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={expectedText}
              className="text-xs sm:text-sm border-red-300 focus:border-red-500 focus:ring-red-500"
              disabled={isDeleting}
            />
          </div>

          <Button
            onClick={handleDeleteAccount}
            disabled={!canDelete || isDeleting}
            variant="destructive"
            className="w-full text-xs sm:text-sm py-2"
          >
            {isDeleting
              ? "Eliminando cuenta..."
              : "Eliminar mi cuenta permanentemente"}
          </Button>
        </div>
      </div>
    </div>
  );
}
