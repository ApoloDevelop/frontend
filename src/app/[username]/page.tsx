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

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const { user, loading, error } = useUserProfile(username);
  const { isModalOpen, openModal, closeModal } = useEditProfileModal();

  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <CoverPhoto src={user.cover_pic} />
      <ProfilePhoto
        src={user.profile_pic}
        className="relative left-6 -top-30 -mb-30"
      />
      <UserInfo
        fullname={user.fullname}
        username={user.username}
        biography={user.biography}
        createdAt={user.register_date}
        className="flex flex-col items-start px-6 mt-4"
      />
      <div className="flex px-6 mt-4">
        <Button variant="default" onClick={openModal}>
          <PencilIcon />
          Editar
        </Button>
      </div>
      <EditProfileModal open={isModalOpen} onClose={closeModal} user={user} />
    </div>
  );
}
