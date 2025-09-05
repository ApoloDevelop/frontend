import { useProfilePhotoUpdate } from "./useProfilePhotoUpdate";
import { toast } from "sonner";

export const useProfilePhotos = (currentUser: any, setLocalUser: any) => {
  const {
    updateProfilePhoto,
    updateCoverPhoto,
    loading: photoLoading,
    error: photoError,
  } = useProfilePhotoUpdate();

  const handleProfilePhotoUpdate = async (newImageUrl: string) => {
    if (!currentUser?.id) {
      console.error("No user ID available");
      toast.error("Error", {
        description:
          "No se pudo identificar el usuario para actualizar la foto.",
      });
      return;
    }

    const success = await updateProfilePhoto(currentUser.id, newImageUrl);
    if (success) {
      setLocalUser((prevUser: any) => {
        const updatedUser = {
          ...currentUser,
          ...prevUser,
          profile_pic: newImageUrl,
        };
        return updatedUser;
      });

      toast.success("Foto de perfil actualizada", {
        description: "Tu foto de perfil se ha actualizado correctamente.",
      });
    } else {
      toast.error("Error al actualizar", {
        description:
          "No se pudo actualizar tu foto de perfil. Inténtalo de nuevo.",
      });
    }
  };

  const handleCoverPhotoUpdate = async (newImageUrl: string) => {
    if (!currentUser?.id) {
      console.error("No user ID available");
      toast.error("Error", {
        description:
          "No se pudo identificar el usuario para actualizar la foto.",
      });
      return;
    }

    const success = await updateCoverPhoto(currentUser.id, newImageUrl);
    if (success) {
      setLocalUser((prevUser: any) => {
        const updatedUser = {
          ...currentUser,
          ...prevUser,
          cover_pic: newImageUrl,
        };
        return updatedUser;
      });

      toast.success("Foto de portada actualizada", {
        description: "Tu foto de portada se ha actualizado correctamente.",
      });
    } else {
      toast.error("Error al actualizar", {
        description:
          "No se pudo actualizar tu foto de portada. Inténtalo de nuevo.",
      });
    }
  };

  return {
    handleProfilePhotoUpdate,
    handleCoverPhotoUpdate,
    photoLoading,
    photoError,
  };
};
