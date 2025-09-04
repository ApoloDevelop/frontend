import { ProfilePhoto } from "./ProfilePhoto";
import { ProfilePhotoEditor } from "./ProfilePhotoEditor";

interface ProfilePhotoSectionProps {
  currentUser: any;
  canEdit: boolean;
  onProfilePhotoUpdate: (newImageUrl: string) => Promise<void>;
}

export const ProfilePhotoSection = ({
  currentUser,
  canEdit,
  onProfilePhotoUpdate,
}: ProfilePhotoSectionProps) => {
  return (
    <div className="relative">
      {canEdit ? (
        <ProfilePhotoEditor
          currentImageUrl={currentUser.profile_pic}
          onImageUpdated={onProfilePhotoUpdate}
          className="relative left-6 -top-30 -mb-30 w-[180px] h-[180px]"
        >
          <ProfilePhoto src={currentUser.profile_pic} className="" />
        </ProfilePhotoEditor>
      ) : (
        <ProfilePhoto
          src={currentUser.profile_pic}
          className="relative left-6 -top-30 -mb-30"
        />
      )}
    </div>
  );
};
