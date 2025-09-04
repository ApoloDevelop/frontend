import { Button } from "@/components/ui/button";
import { PlusIcon, ListIcon } from "lucide-react";
import { AdminDeleteButton } from "./AdminDeleteButton";

interface ProfileActionButtonsProps {
  currentUser: any;
  authUser: any;
  canEdit: boolean;
  isAdmin: boolean;
  onAddPostClick: () => void;
  onMyListsClick: () => void;
}

export const ProfileActionButtons = ({
  currentUser,
  authUser,
  canEdit,
  isAdmin,
  onAddPostClick,
  onMyListsClick,
}: ProfileActionButtonsProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-end px-6 mt-4 gap-2">
      {/* Botón de eliminar cuenta para administradores */}
      <AdminDeleteButton
        user={currentUser}
        isVisible={isAdmin && authUser?.role_id === 1 && !canEdit}
      />

      {/* Botones para el propio usuario */}
      {canEdit && (
        <div className="flex flex-col sm:flex-row gap-2 items-end">
          <Button
            onClick={onMyListsClick}
            size="sm"
            variant="outline"
            className="w-fit whitespace-nowrap"
          >
            <ListIcon className="w-4 h-4 mr-2" />
            Mis listas
          </Button>
          <Button
            onClick={onAddPostClick}
            size="sm"
            className="w-fit whitespace-nowrap"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Añadir post
          </Button>
        </div>
      )}
    </div>
  );
};
