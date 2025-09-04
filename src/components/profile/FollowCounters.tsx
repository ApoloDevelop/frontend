"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserService } from "@/services/user.service";
import { FollowListModal } from "./FollowListModal";

export function FollowCounters({
  profileUserId,
  username,
  refreshTrigger,
}: {
  profileUserId: number;
  username: string;
  refreshTrigger?: number; // Prop para triggear refresh
}) {
  const [counts, setCounts] = useState({ followers: 0, following: 0 });
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);

  async function loadCounts() {
    try {
      const summary = await UserService.getFollowSummary(profileUserId);
      setCounts({ followers: summary.followers, following: summary.following });
    } catch (e: any) {
      // Silencioso o toast si quieres
    }
  }

  const handleFollowChange = () => {
    // Recargar contadores cuando alguien sigue/deja de seguir
    loadCounts();
  };

  useEffect(() => {
    loadCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileUserId, refreshTrigger]); // Agregamos refreshTrigger como dependencia

  return (
    <>
      <div className="flex flex-wrap gap-2 items-center">
        <Button
          variant="ghost"
          className="px-0 h-auto hover:underline"
          onClick={() => setFollowersOpen(true)}
        >
          Seguidores&nbsp;
          <span className="font-semibold">{counts.followers}</span>
        </Button>

        <span className="text-gray-400 mx-1">|</span>

        <Button
          variant="ghost"
          className="px-0 h-auto hover:underline"
          onClick={() => setFollowingOpen(true)}
        >
          Seguidos&nbsp;
          <span className="font-semibold">{counts.following}</span>
        </Button>
      </div>

      {/* Modales */}
      <FollowListModal
        open={followersOpen}
        onOpenChange={setFollowersOpen}
        username={username}
        userId={profileUserId}
        type="followers"
        onFollowChange={handleFollowChange}
      />
      <FollowListModal
        open={followingOpen}
        onOpenChange={setFollowingOpen}
        username={username}
        userId={profileUserId}
        type="following"
        onFollowChange={handleFollowChange}
      />
    </>
  );
}
