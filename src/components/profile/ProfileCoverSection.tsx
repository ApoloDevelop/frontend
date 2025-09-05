import { CoverPhoto } from "./CoverPhoto";
import { CoverPhotoEditor } from "./CoverPhotoEditor";

interface ProfileCoverSectionProps {
  currentUser: any;
  canEdit: boolean;
  onCoverPhotoUpdate: (newImageUrl: string) => Promise<void>;
}

export const ProfileCoverSection = ({
  currentUser,
  canEdit,
  onCoverPhotoUpdate,
}: ProfileCoverSectionProps) => {
  return (
    <div className="relative">
      {canEdit ? (
        <CoverPhotoEditor
          currentImageUrl={currentUser.cover_pic}
          onImageUpdated={onCoverPhotoUpdate}
          className="w-full"
        >
          <CoverPhoto src={currentUser.cover_pic} />
        </CoverPhotoEditor>
      ) : (
        <CoverPhoto src={currentUser.cover_pic} />
      )}
    </div>
  );
};
