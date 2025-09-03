import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserService } from "@/services/user.service";
import { toast } from "sonner";

interface RoleAdjustModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetUser: {
    id: number;
    username: string;
    fullname?: string;
    role_id: number;
  };
  onRoleUpdated: (newRoleId: number) => void;
}

const ROLES = [
  { id: 1, name: "Admin", variant: "admin" as const },
  { id: 2, name: "Moderador", variant: "mod" as const },
  { id: 3, name: "Redactor", variant: "writer" as const },
  { id: 4, name: "Verificado", variant: "verified" as const },
  { id: 5, name: "Lector", variant: "secondary" as const },
];

export function RoleAdjustModal({
  open,
  onOpenChange,
  targetUser,
  onRoleUpdated,
}: RoleAdjustModalProps) {
  const [selectedRole, setSelectedRole] = useState<string>(
    targetUser.role_id.toString()
  );
  const [isLoading, setIsLoading] = useState(false);

  // Resetear la selección cuando el modal se abra
  useEffect(() => {
    if (open) {
      setSelectedRole(targetUser.role_id.toString());
    }
  }, [open, targetUser.role_id]);

  const handleCancel = () => {
    setSelectedRole(targetUser.role_id.toString());
    onOpenChange(false);
  };

  const handleSave = async () => {
    const newRoleId = parseInt(selectedRole);
    if (newRoleId === targetUser.role_id) {
      onOpenChange(false);
      return;
    }

    setIsLoading(true);
    try {
      await UserService.updateUser(targetUser.id, { role_id: newRoleId });

      onRoleUpdated(newRoleId);
      onOpenChange(false);

      const roleName = ROLES.find((r) => r.id === newRoleId)?.name || "rol";
      toast.success("Rol actualizado", {
        description: `El rol de ${targetUser.username} ha sido cambiado a ${roleName}.`,
      });
    } catch (error) {
      toast.error("Error", {
        description: "No se pudo actualizar el rol del usuario.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentRole = ROLES.find((r) => r.id === targetUser.role_id);
  const selectedRoleInfo = ROLES.find((r) => r.id === parseInt(selectedRole));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajustar rol de usuario</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Usuario:</p>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {targetUser.fullname || `@${targetUser.username}`}
              </span>
              {currentRole && currentRole.id !== 5 && (
                <Badge variant={currentRole.variant}>
                  {currentRole.name.toUpperCase()}
                </Badge>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Nuevo rol:</p>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent
                className="z-[9999]"
                position="popper"
                sideOffset={5}
              >
                {ROLES.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    <div className="flex items-center gap-2">
                      <span>{role.name}</span>
                      {role.id !== 5 && (
                        <Badge variant={role.variant} className="text-xs">
                          {role.name.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRoleInfo && selectedRoleInfo.id !== targetUser.role_id && (
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                El rol será cambiado de{" "}
                <strong>{currentRole?.name || "Lector"}</strong> a{" "}
                <strong>{selectedRoleInfo.name}</strong>
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" disabled={isLoading} onClick={handleCancel}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              isLoading || selectedRole === targetUser.role_id.toString()
            }
          >
            {isLoading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
