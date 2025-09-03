"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserService } from "@/services/user.service";
import { toast } from "sonner";
import { FollowType, UserLite } from "@/types/users";

export function FollowListModal({
  open,
  onOpenChange,
  username,
  userId,
  type,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number;
  username: string;
  type: FollowType;
}) {
  const [items, setItems] = useState<UserLite[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const TAKE = 5;

  const load = async (reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const skip = reset ? 0 : items.length;
      const fetcher =
        type === "followers"
          ? UserService.listFollowers
          : UserService.listFollowing;

      const batch = await fetcher(userId, skip, TAKE);
      setItems(reset ? batch : [...items, ...batch]);
      setHasMore(batch.length === TAKE);
    } catch (e: any) {
      toast.error(e?.message || "Error al cargar la lista");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, userId, type]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === "followers"
              ? `Seguidores de ${username}`
              : `Seguidos de ${username}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {items.map((u) => (
            <Link
              key={u.id}
              href={`/users/${u.username}`}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition"
            >
              <Avatar className="size-9">
                <AvatarImage src={u.profile_pic || ""} alt={u.username} />
                <AvatarFallback>
                  {u.username?.slice(0, 2)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {u.fullname || u.username}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  @{u.username}
                </div>
              </div>
            </Link>
          ))}

          {items.length === 0 && !loading && (
            <p className="text-sm text-muted-foreground py-4 text-center">
              {type === "followers"
                ? "Este usuario no tiene seguidores."
                : "Este usuario no sigue a nadie."}
            </p>
          )}
        </div>

        <div className="flex justify-center gap-2">
          {hasMore && (
            <Button onClick={() => load(false)} disabled={loading}>
              {loading ? "Cargando..." : "Cargar más"}
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
