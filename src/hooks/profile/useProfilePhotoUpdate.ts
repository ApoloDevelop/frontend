import { useState } from "react";
import { UserService } from "@/services/user.service";

export function useProfilePhotoUpdate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfilePhoto = async (userId: number, imageUrl: string) => {
    setLoading(true);
    setError(null);

    try {
      await UserService.updateUser(userId, { profile_pic: imageUrl });
      return true;
    } catch (err: any) {
      setError(err?.message || 'Error al actualizar la foto de perfil');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCoverPhoto = async (userId: number, imageUrl: string) => {
    setLoading(true);
    setError(null);

    try {
      await UserService.updateUser(userId, { cover_pic: imageUrl });
      return true;
    } catch (err: any) {
      setError(err?.message || 'Error al actualizar la foto de cover');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfilePhoto,
    updateCoverPhoto,
    loading,
    error,
  };
}
