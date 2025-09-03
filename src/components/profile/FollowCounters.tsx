"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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

  useEffect(() => {
    loadCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileUserId, refreshTrigger]); // Agregamos refreshTrigger como dependencia

  return (
    <>
      <div className="flex flex-wrap gap-2 items-center">
        <Button
          variant="ghost"
          className="px-0 h-auto"
          onClick={() => setFollowersOpen(true)}
        >
          Seguidores&nbsp;
          <span className="font-semibold">{counts.followers}</span>
        </Button>

        <Button
          variant="ghost"
          className="px-0 h-auto"
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
      />
      <FollowListModal
        open={followingOpen}
        onOpenChange={setFollowingOpen}
        username={username}
        userId={profileUserId}
        type="following"
      />
    </>
  );
}
