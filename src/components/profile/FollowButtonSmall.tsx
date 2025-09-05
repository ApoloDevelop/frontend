"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserService } from "@/services/user.service";
import { toast } from "sonner";
import { UserPlus, UserMinus } from "lucide-react";

interface FollowButtonSmallProps {
  userId: number;
  username: string;
  isFollowing: boolean | null;
  onFollowChange?: (isFollowing: boolean) => void;
}

export function FollowButtonSmall({
  userId,
  username,
  isFollowing,
  onFollowChange,
}: FollowButtonSmallProps) {
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(isFollowing === true);

  // Sincronizar el estado local cuando cambie la prop isFollowing
  useEffect(() => {
    setFollowing(isFollowing === true);
  }, [isFollowing]);

  // Si isFollowing es null, significa que no hay usuario autenticado o es el mismo usuario
  if (isFollowing === null) {
    return <div className="text-xs text-muted-foreground px-2">-</div>;
  }

  const handleFollow = async () => {
    setLoading(true);
    try {
      if (following) {
        await UserService.unfollowUser(userId);
        setFollowing(false);
        onFollowChange?.(false);
        toast.success(`Dejaste de seguir a @${username}`);
      } else {
        await UserService.followUser(userId);
        setFollowing(true);
        onFollowChange?.(true);
        toast.success(`Ahora sigues a @${username}`);
      }
    } catch (error: any) {
      toast.error(error?.message || "Error al actualizar el seguimiento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleFollow}
      disabled={loading}
      size="sm"
      variant={following ? "outline" : "default"}
      className="h-8 px-3"
    >
      {following ? (
        <>
          <UserMinus className="h-3 w-3 mr-1" />
          Dejar de seguir
        </>
      ) : (
        <>
          <UserPlus className="h-3 w-3 mr-1" />
          Seguir
        </>
      )}
    </Button>
  );
}
