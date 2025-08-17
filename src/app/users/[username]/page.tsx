"use client";

import { notFound } from "next/navigation";
import { CoverPhoto } from "@/components/profile/CoverPhoto";
import { ProfilePhoto } from "@/components/profile/ProfilePhoto";
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserInfo } from "@/components/profile/UserInfo";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { useEditProfileModal } from "@/hooks/profile/useEditProfileModal";
import { useLocalUserProfile } from "@/hooks/profile/useLocalUserProfile";

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const { user, loading } = useUserProfile(username);
  const { localUser, setLocalUser } = useLocalUserProfile(user);
  const { isModalOpen, openModal, closeModal } = useEditProfileModal();

  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  if (!user && !localUser) {
    notFound();
  }

  const currentUser = localUser || user;

  return (
    <div className="min-h-screen bg-gray-100">
      <CoverPhoto src={currentUser.cover_pic} />
      <ProfilePhoto
        src={currentUser.profile_pic}
        className="relative left-6 -top-30 -mb-30"
      />
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
        extUrl={currentUser.external_url}
      />
      <div className="flex px-6 mt-4">
        <Button variant="default" onClick={openModal}>
          <PencilIcon />
          Editar
        </Button>
      </div>
      <EditProfileModal
        open={isModalOpen}
        onClose={closeModal}
        user={currentUser}
        onUserUpdated={setLocalUser}
      />
    </div>
  );
}
