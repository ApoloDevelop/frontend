import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";

interface ProfileEditSectionProps {
  canEdit: boolean;
  onEditClick: () => void;
}

export const ProfileEditSection = ({
  canEdit,
  onEditClick,
}: ProfileEditSectionProps) => {
  if (!canEdit) return null;

  return (
    <div className="flex px-6 mt-4">
      <Button variant="default" onClick={onEditClick}>
        <PencilIcon />
        Editar
      </Button>
    </div>
  );
};
