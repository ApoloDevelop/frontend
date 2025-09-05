import { EditProfileModal } from "./EditProfileModal";
import { RoleAdjustModal } from "./RoleAdjustModal";
import { ActivityComposerModal } from "./ActivityComposerModal";
import { MyListsDialog } from "@/components/lists/MyListsDialog";

interface ProfileModalsProps {
  editModalOpen: boolean;
  onEditModalClose: () => void;
  currentUser: any;
  onUserUpdated: (user: any) => void;

  roleModalOpen: boolean;
  onRoleModalChange: (open: boolean) => void;
  onRoleUpdated: (newRoleId: number) => void;

  activityModalOpen: boolean;
  onActivityModalChange: (open: boolean) => void;
  onActivityPosted: () => void;

  myListsModalOpen: boolean;
  onMyListsModalChange: (open: boolean) => void;
}

export const ProfileModals = ({
  editModalOpen,
  onEditModalClose,
  currentUser,
  onUserUpdated,
  roleModalOpen,
  onRoleModalChange,
  onRoleUpdated,
  activityModalOpen,
  onActivityModalChange,
  onActivityPosted,
  myListsModalOpen,
  onMyListsModalChange,
}: ProfileModalsProps) => {
  return (
    <>
      <EditProfileModal
        open={editModalOpen}
        onClose={onEditModalClose}
        user={currentUser}
        onUserUpdated={onUserUpdated}
      />

      <RoleAdjustModal
        open={roleModalOpen}
        onOpenChange={onRoleModalChange}
        targetUser={{
          id: currentUser.id,
          username: currentUser.username,
          fullname: currentUser.fullname,
          role_id: currentUser.role_id,
        }}
        onRoleUpdated={onRoleUpdated}
      />

      <ActivityComposerModal
        open={activityModalOpen}
        onOpenChange={onActivityModalChange}
        onPosted={onActivityPosted}
      />

      <MyListsDialog
        open={myListsModalOpen}
        onOpenChange={onMyListsModalChange}
        userId={currentUser.id}
      />
    </>
  );
};
