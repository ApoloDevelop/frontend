"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserService } from "@/services/user.service";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/auth";
import { FollowListModal } from "./FollowListModal";

export function FollowBar({
  profileUserId,
  showFollowButton, // ocultar cuando es tu propio perfil
}: {
  profileUserId: number;
  showFollowButton: boolean;
}) {
  const [user, setUser] = useState<any>(undefined); // undefined = cargando, null = no autenticado
  const [counts, setCounts] = useState({ followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false); // flag para saber si ya cargamos el usuario

  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);

  async function refresh() {
    try {
      const summary = await UserService.getFollowSummary(profileUserId);
      setCounts({ followers: summary.followers, following: summary.following });
      setIsFollowing(summary.isFollowing);
    } catch (e: any) {
      // Silencioso o toast si quieres
    }
  }

  // Cargar usuario actual
  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (e) {
        // Usuario no autenticado
        setUser(null);
      } finally {
        setUserLoaded(true); // Marcamos que ya terminamos de cargar el usuario
      }
    }
    loadUser();
  }, []);

  // Ejecutar refresh cuando el usuario esté cargado o cuando cambie profileUserId
  useEffect(() => {
    // Solo ejecutamos refresh si ya terminamos de cargar el usuario
    if (userLoaded) {
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileUserId, userLoaded]);

  const onToggleFollow = async () => {
    if (!user) {
      toast.error("Inicia sesión para seguir usuarios");
      return;
    }
    setLoading(true);
    try {
      if (isFollowing) {
        await UserService.unfollowUser(profileUserId);
        setIsFollowing(false);
        setCounts((c) => ({ ...c, followers: Math.max(0, c.followers - 1) }));
      } else {
        await UserService.followUser(profileUserId);
        setIsFollowing(true);
        setCounts((c) => ({ ...c, followers: c.followers + 1 }));
      }
    } catch (e: any) {
      toast.error(e.message || "No se pudo actualizar el seguimiento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 px-6 mt-4 items-center">
        {showFollowButton && (
          <Button
            onClick={onToggleFollow}
            disabled={loading}
            variant={isFollowing ? "secondary" : "default"}
          >
            {isFollowing ? "Siguiendo" : "Seguir"}
          </Button>
        )}

        <Button
          variant="ghost"
          className="px-3"
          onClick={() => setFollowersOpen(true)}
        >
          Seguidores&nbsp;
          <span className="font-semibold">{counts.followers}</span>
        </Button>

        <Button
          variant="ghost"
          className="px-3"
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
        username={user?.username || ""}
        userId={profileUserId}
        type="followers"
      />
      <FollowListModal
        open={followingOpen}
        onOpenChange={setFollowingOpen}
        username={user?.username || ""}
        userId={profileUserId}
        type="following"
      />
    </>
  );
}
