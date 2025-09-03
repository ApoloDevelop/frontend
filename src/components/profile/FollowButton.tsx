"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserService } from "@/services/user.service";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/auth";

export function FollowButton({ profileUserId }: { profileUserId: number }) {
  const [user, setUser] = useState<any>(undefined); // undefined = cargando, null = no autenticado
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false); // flag para saber si ya cargamos el usuario

  async function checkFollowStatus() {
    try {
      const summary = await UserService.getFollowSummary(profileUserId);
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

  // Ejecutar checkFollowStatus cuando el usuario esté cargado o cuando cambie profileUserId
  useEffect(() => {
    // Solo ejecutamos checkFollowStatus si ya terminamos de cargar el usuario
    if (userLoaded) {
      checkFollowStatus();
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
      } else {
        await UserService.followUser(profileUserId);
        setIsFollowing(true);
      }
    } catch (e: any) {
      toast.error(e.message || "No se pudo actualizar el seguimiento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={onToggleFollow}
      disabled={loading}
      variant={isFollowing ? "secondary" : "default"}
      size="sm"
    >
      {isFollowing ? "Siguiendo" : "Seguir"}
    </Button>
  );
}
