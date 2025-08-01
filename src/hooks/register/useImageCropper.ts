import { useState } from "react";
import getCroppedImg from "@/helpers/images";

export function useImageCropper(setProfileImage: any, setImagePreview: any) {
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = (_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleCropSave = async (originalImagePreview: string) => {
    if (!originalImagePreview || !croppedAreaPixels) return;

    const croppedImage = await getCroppedImg(
      originalImagePreview,
      croppedAreaPixels
    );
    const croppedImageFile = await fetch(croppedImage)
      .then((res) => res.blob())
      .then(
        (blob) => new File([blob], "cropped-image.jpg", { type: "image/jpeg" })
      );

    setImagePreview(croppedImage);
    setProfileImage(croppedImageFile);
    setShowCropper(false);
  };

  return {
    showCropper,
    setShowCropper,
    crop,
    setCrop,
    zoom,
    setZoom,
    onCropComplete,
    handleCropSave,
  };
}
