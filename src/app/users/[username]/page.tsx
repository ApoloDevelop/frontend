"use client";

import { use } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  useEditProfileModal,
  useLocalUserProfile,
  useProfilePermissions,
  useProfileModals,
  useProfilePhotos,
  useProfileUpdates,
} from "@/hooks/profile";
import UserPageSkeleton from "@/components/skeletons/UserPageSkeleton";
import { ErrorPage } from "@/components/system/ErrorPage";
import {
  ProfileCoverSection,
  ProfileActionButtons,
  ProfilePhotoSection,
  ProfileUserInfoSection,
  ProfileEditSection,
  ProfilePhotoError,
  ProfileModals,
  FollowCounters,
  ActivityFeed,
} from "@/components/profile";

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

  const {
    roleModalOpen,
    openRoleModal,
    setRoleModalOpen,
    activityModalOpen,
    openActivityModal,
    setActivityModalOpen,
    myListsModalOpen,
    openMyListsModal,
    setMyListsModalOpen,
  } = useProfileModals();

  const {
    refreshCounters,
    refreshFeed,
    handleFollowChange,
    handleRoleUpdate,
    handleActivityPosted,
  } = useProfileUpdates();

  const currentUser = localUser || user;

  const { handleProfilePhotoUpdate, handleCoverPhotoUpdate, photoError } =
    useProfilePhotos(currentUser, setLocalUser);

  // Handlers para los componentes
  const handleRoleAdjust = () => {
    openRoleModal();
  };

  const handleRoleUpdated = (newRoleId: number) => {
    handleRoleUpdate(newRoleId, setLocalUser, currentUser);
  };

  if (loading) {
    return <UserPageSkeleton />;
  }

  if (!user && !localUser) {
    return (
      <ErrorPage
        message="El usuario que buscas no existe o ha sido eliminado"
        title="Usuario no encontrado"
        icon="👤"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sección de portada */}
      <ProfileCoverSection
        currentUser={currentUser}
        canEdit={canEdit}
        onCoverPhotoUpdate={handleCoverPhotoUpdate}
      />

      {/* Botones de acción superiores */}
      <ProfileActionButtons
        currentUser={currentUser}
        authUser={authUser}
        canEdit={canEdit}
        isAdmin={isAdmin}
        onAddPostClick={openActivityModal}
        onMyListsClick={openMyListsModal}
      />

      {/* Sección de foto de perfil */}
      <ProfilePhotoSection
        currentUser={currentUser}
        canEdit={canEdit}
        onProfilePhotoUpdate={handleProfilePhotoUpdate}
      />

      {/* Información del usuario */}
      <ProfileUserInfoSection
        currentUser={currentUser}
        canEdit={canEdit}
        isAdmin={isAdmin}
        onFollowChange={handleFollowChange}
        onRoleAdjustClick={handleRoleAdjust}
      />

      {/* Contadores de seguidores/seguidos */}
      <div className="px-6 mt-4">
        <FollowCounters
          profileUserId={currentUser.id}
          username={currentUser.username}
          refreshTrigger={refreshCounters}
        />
      </div>

      {/* Sección de editar perfil */}
      <ProfileEditSection canEdit={canEdit} onEditClick={openModal} />

      {/* Errores de fotos */}
      <ProfilePhotoError photoError={photoError} />

      {/* Todos los modales */}
      <ProfileModals
        editModalOpen={isModalOpen}
        onEditModalClose={closeModal}
        currentUser={currentUser}
        onUserUpdated={setLocalUser}
        roleModalOpen={roleModalOpen}
        onRoleModalChange={setRoleModalOpen}
        onRoleUpdated={handleRoleUpdated}
        activityModalOpen={activityModalOpen}
        onActivityModalChange={setActivityModalOpen}
        onActivityPosted={handleActivityPosted}
        myListsModalOpen={myListsModalOpen}
        onMyListsModalChange={setMyListsModalOpen}
      />

      {/* Feed de actividad */}
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
