import React from "react";
import { ProfileImageUploader } from "../ProfileImageUploader";
import { CropperModal } from "../CropperModal";

interface RegisterFormStep3Props {
  profileImage: File | null;
  imagePreview: string;
  originalImagePreview: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  showCropper: boolean;
  crop: { x: number; y: number };
  setCrop: (value: { x: number; y: number }) => void;
  zoom: number;
  setZoom: (value: number) => void;
  onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void;
  onCropSave: (image: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onEditClick: () => void;
  onCloseCropper: () => void;
}

export const RegisterFormStep3: React.FC<RegisterFormStep3Props> = ({
  profileImage,
  imagePreview,
  originalImagePreview,
  fileInputRef,
  showCropper,
  crop,
  setCrop,
  zoom,
  setZoom,
  onCropComplete,
  onCropSave,
  onImageChange,
  onRemoveImage,
  onEditClick,
  onCloseCropper,
}) => {
  return (
    <div className="w-full flex-shrink-0">
      <h3 className="text-lg mb-4 text-center">¡Estamos terminando!</h3>

      <ProfileImageUploader
        profileImage={profileImage}
        imagePreview={imagePreview}
        fileInputRef={fileInputRef}
        onImageChange={onImageChange}
        onRemoveImage={onRemoveImage}
        onEditClick={onEditClick}
      />

      <CropperModal
        isOpen={showCropper}
        onClose={onCloseCropper}
        originalImage={originalImagePreview}
        crop={crop}
        setCrop={setCrop}
        zoom={zoom}
        setZoom={setZoom}
        onCropComplete={onCropComplete}
        onSave={() => onCropSave(originalImagePreview)}
      />
    </div>
  );
};
