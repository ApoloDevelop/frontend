"use client";

import { notFound } from "next/navigation";
import { CoverPhoto } from "@/components/Profile/CoverPhoto";
import { ProfilePhoto } from "@/components/Profile/ProfilePhoto";
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserInfo } from "@/components/Profile/UserInfo";

export default function UserProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;
  const { user, loading, error } = useUserProfile(username);

  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  if (error) {
    notFound(); // Redirige a la página 404 si hay un error
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative">
        <CoverPhoto src={user.cover_pic} />
        <ProfilePhoto src={user.profile_pic} />
      </div>
      <UserInfo
        fullname={user.fullname}
        username={user.username}
        biography={user.biography}
      />
    </div>
  );
}
