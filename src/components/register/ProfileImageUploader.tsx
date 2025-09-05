import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { acceptedTypes } from "@/constants/registerConstants";

interface ProfileImageUploaderProps {
  profileImage: File | null;
  imagePreview: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onEditClick: () => void;
}

export const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  profileImage,
  imagePreview,
  fileInputRef,
  onImageChange,
  onRemoveImage,
  onEditClick,
}) => {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl font-bold">Sube tu foto de perfil</h3>
      <p className="text-sm mb-4">(Si quieres)</p>

      {imagePreview && (
        <div
          className="relative group mb-4"
          style={{ width: "120px", height: "120px" }}
        >
          <Image
            width={120}
            height={120}
            src={imagePreview}
            alt="Preview"
            className={`rounded-full object-cover w-[120px] h-[120px] transition-all duration-200 ${
              profileImage
                ? "border-2 border-gray-300 group-hover:border-gray-400 hover:brightness-90 cursor-pointer"
                : ""
            }`}
            onClick={() => {
              if (profileImage) onEditClick();
            }}
            title={profileImage ? "Haz click para recortar la imagen" : ""}
          />
          {profileImage && (
            <div className="absolute inset-0 rounded-full bg-black/10 opacity-0 group-hover:opacity-100 flex items-center justify-center pointer-events-none transition-opacity duration-200 select-none">
              <span className="text-xs text-white font-semibold select-none">
                Recortar
              </span>
            </div>
          )}
        </div>
      )}

      <div className="relative w-3/4 mb-4 flex flex-row items-center">
        <label
          htmlFor="profile-image-input"
          className="block w-full cursor-pointer border border-gray-200 rounded px-4 py-2 text-center bg-white hover:bg-gray-100 transition mb-4 text-gray-400 text-sm"
        >
          {profileImage
            ? "¿No te convence? Selecciona otra"
            : "Seleccionar imagen"}
          <input
            id="profile-image-input"
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={acceptedTypes.join(",")}
            onChange={onImageChange}
          />
        </label>

        {profileImage && (
          <Button
            type="button"
            variant="hover"
            title="Eliminar imagen"
            aria-label="Remove image"
            className="mb-4 text-xl text-gray-400 hover:text-red-500 px-2 py-0 h-auto"
            onClick={onRemoveImage}
          >
            x
          </Button>
        )}
      </div>
    </div>
  );
};
