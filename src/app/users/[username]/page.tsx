"use client";

import { notFound } from "next/navigation";
import { CoverPhoto } from "@/components/profile/CoverPhoto";
import { ProfilePhoto } from "@/components/profile/ProfilePhoto";
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserInfo } from "@/components/profile/UserInfo";
import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { useEditProfileModal } from "@/hooks/profile/useEditProfileModal";
import { useLocalUserProfile } from "@/hooks/profile/useLocalUserProfile";
import { useProfilePermissions } from "@/hooks/profile/useProfilePermissions";
import { useProfilePhotoUpdate } from "@/hooks/profile/useProfilePhotoUpdate";
import { ProfilePhotoEditor } from "@/components/profile/ProfilePhotoEditor";
import { CoverPhotoEditor } from "@/components/profile/CoverPhotoEditor";
import { toast } from "sonner";
import { FollowButton } from "@/components/profile/FollowButton";
import { FollowCounters } from "@/components/profile/FollowCounters";
import { RoleAdjustModal } from "@/components/profile/RoleAdjustModal";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ActivityComposerModal } from "@/components/profile/ActivityComposerModal";
import { ActivityFeed } from "@/components/profile/ActivityFeed";
import { PlusIcon } from "lucide-react";
import { ListIcon } from "lucide-react";
import UserPageSkeleton from "@/components/skeletons/UserPageSkeleton";
import { ErrorPage } from "@/components/system/ErrorPage";
import { AdminDeleteButton } from "@/components/profile/AdminDeleteButton";
import { MyListsDialog } from "@/components/lists/MyListsDialog";

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const { user, loading, error } = useUserProfile(username);
  const { localUser, setLocalUser } = useLocalUserProfile(user);
  const { isModalOpen, openModal, closeModal } = useEditProfileModal();
  const { canEdit } = useProfilePermissions(user?.id);
  const { currentUser: authUser, isAdmin } = useCurrentUser();
  const [refreshCounters, setRefreshCounters] = useState(0); // Estado para refresh de contadores
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [myListsModalOpen, setMyListsModalOpen] = useState(false);
  const {
    updateProfilePhoto,
    updateCoverPhoto,
    loading: photoLoading,
    error: photoError,
  } = useProfilePhotoUpdate();
  const [refreshFeed, setRefreshFeed] = useState(0);

  const handleProfilePhotoUpdate = async (newImageUrl: string) => {
    console.log("Updating profile photo. Current user:", currentUser);
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
      console.log("Photo update successful, updating local state");
      setLocalUser((prevUser: any) => {
        const updatedUser = {
          ...currentUser, // Preservar todas las propiedades actuales
          ...prevUser, // Sobrescribir con cambios locales previos
          profile_pic: newImageUrl, // Actualizar solo la foto de perfil
        };
        console.log("Updated user state:", updatedUser);
        return updatedUser;
      });

      // Toast de éxito
      toast.success("Foto de perfil actualizada", {
        description: "Tu foto de perfil se ha actualizado correctamente.",
      });
    } else {
      // Toast de error
      toast.error("Error al actualizar", {
        description:
          "No se pudo actualizar tu foto de perfil. Inténtalo de nuevo.",
      });
    }
  };

  const handleCoverPhotoUpdate = async (newImageUrl: string) => {
    console.log("Updating cover photo. Current user:", currentUser);
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
      console.log("Cover update successful, updating local state");
      setLocalUser((prevUser: any) => {
        const updatedUser = {
          ...currentUser, // Preservar todas las propiedades actuales
          ...prevUser, // Sobrescribir con cambios locales previos
          cover_pic: newImageUrl, // Actualizar solo la foto de cover
        };
        console.log("Updated user state:", updatedUser);
        return updatedUser;
      });

      // Toast de éxito
      toast.success("Foto de portada actualizada", {
        description: "Tu foto de portada se ha actualizado correctamente.",
      });
    } else {
      // Toast de error
      toast.error("Error al actualizar", {
        description:
          "No se pudo actualizar tu foto de portada. Inténtalo de nuevo.",
      });
    }
  };

  // Función para manejar el cambio de seguimiento
  const handleFollowChange = (isFollowing: boolean) => {
    // Incrementamos el counter para triggear el refresh de FollowCounters
    setRefreshCounters((prev) => prev + 1);
  };

  // Función para manejar el cambio de rol
  const handleRoleUpdate = (newRoleId: number) => {
    setLocalUser((prevUser: any) => {
      const updatedUser = {
        ...currentUser,
        ...prevUser,
        role_id: newRoleId,
      };
      return updatedUser;
    });
  };

  if (loading) {
    return <UserPageSkeleton />;
  }

  // Si no hay usuario y no está cargando, entonces no existe
  if (!user && !localUser) {
    return (
      <ErrorPage
        message="El usuario que buscas no existe o ha sido eliminado"
        title="Usuario no encontrado"
        icon="👤"
      />
    );
  }

  const currentUser = localUser || user;

  console.log("Current user state:", {
    user,
    localUser,
    currentUser,
    canEdit,
    isAdmin,
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative">
        {canEdit ? (
          <CoverPhotoEditor
            currentImageUrl={currentUser.cover_pic}
            onImageUpdated={handleCoverPhotoUpdate}
            className="w-full"
          >
            <CoverPhoto src={currentUser.cover_pic} />
          </CoverPhotoEditor>
        ) : (
          <CoverPhoto src={currentUser.cover_pic} />
        )}
      </div>

      {/* Botones de administrador y añadir post */}
      <div className="flex justify-end px-6 mt-4 gap-2">
        {/* Botón de eliminar cuenta para administradores */}
        <AdminDeleteButton
          user={currentUser}
          isVisible={isAdmin && authUser?.role_id === 1 && !canEdit}
        />

        {/* Botón Añadir post - Solo para el propio usuario */}
        {canEdit && (
          <>
            <Button
              onClick={() => setMyListsModalOpen(true)}
              size="sm"
              variant="outline"
            >
              <ListIcon className="w-4 h-4 mr-2" />
              Mis listas
            </Button>
            <Button onClick={() => setActivityModalOpen(true)} size="sm">
              <PlusIcon className="w-4 h-4 mr-2" />
              Añadir post
            </Button>
          </>
        )}
      </div>
      <div className="relative">
        {canEdit ? (
          <ProfilePhotoEditor
            currentImageUrl={currentUser.profile_pic}
            onImageUpdated={handleProfilePhotoUpdate}
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
      <UserInfo
        fullname={currentUser.fullname}
        username={currentUser.username}
        biography={currentUser.biography}
        createdAt={currentUser.register_date}
        className="flex flex-col items-start px-6 mt-4"
        spLink={currentUser.spotify_link}
        ytLink={currentUser.youtube_link}
        twLink={currentUser.twitter_link}
        igLink={currentUser.instagram_link}
        ttLink={currentUser.tiktok_link}
        extUrl={currentUser.external_url}
        roleId={currentUser.role_id}
        followButton={
          !canEdit && (
            <div className="flex gap-2 relative z-20">
              <FollowButton
                profileUserId={currentUser.id}
                onFollowChange={handleFollowChange}
              />
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Ajustar rol clicked - isAdmin:", isAdmin);
                    setRoleModalOpen(true);
                  }}
                  className="text-xs relative z-30 pointer-events-auto cursor-pointer"
                  style={{ pointerEvents: "auto" }}
                >
                  Ajustar rol
                </Button>
              )}
            </div>
          )
        }
      />

      {/* Contadores de seguidores/seguidos debajo de la biografía */}
      <div className="px-6 mt-4">
        <FollowCounters
          profileUserId={currentUser.id}
          username={currentUser.username}
          refreshTrigger={refreshCounters}
        />
      </div>

      <div className="flex px-6 mt-4">
        {canEdit && (
          <Button variant="default" onClick={openModal}>
            <PencilIcon />
            Editar
          </Button>
        )}
      </div>

      {/* Mostrar errores de actualización de fotos */}
      {photoError && (
        <div className="mx-6 mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {photoError}
        </div>
      )}

      <EditProfileModal
        open={isModalOpen}
        onClose={closeModal}
        user={currentUser}
        onUserUpdated={setLocalUser}
      />

      <RoleAdjustModal
        open={roleModalOpen}
        onOpenChange={setRoleModalOpen}
        targetUser={{
          id: currentUser.id,
          username: currentUser.username,
          fullname: currentUser.fullname,
          role_id: currentUser.role_id,
        }}
        onRoleUpdated={handleRoleUpdate}
      />

      <ActivityComposerModal
        open={activityModalOpen}
        onOpenChange={setActivityModalOpen}
        onPosted={() => setRefreshFeed((v) => v + 1)}
      />

      <MyListsDialog
        open={myListsModalOpen}
        onOpenChange={setMyListsModalOpen}
        userId={currentUser.id}
      />

      <div className="px-6">
        <ActivityFeed
          userId={user?.id || 0}
          refreshToken={refreshFeed}
          currentUser={authUser}
        />
      </div>
    </div>
  );
}
