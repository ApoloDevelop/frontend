"use client";
import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { FavoriteService } from "@/services/favorites.service";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type FavType = "artist" | "album" | "track" | "venue";

interface FavoriteButtonProps {
  type: FavType;
  name: string;
  userId: number;
  artistName?: string;
  location?: string;
  className?: string;
}

export function FavoriteButton({
  type,
  name,
  userId,
  artistName,
  location,
  className,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const fav = await FavoriteService.isFavorite({
          type,
          name,
          userId,
          artistName,
          location,
        });
        if (mounted) setIsFavorite(fav);
      } catch (err) {
        console.error("Error al obtener favorito", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [type, name, userId, artistName, location]);

  const toggleFavorite = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (isFavorite) {
        // Quitar de favoritos
        await FavoriteService.removeFavorite({
          type,
          name,
          userId,
          artistName,
          location,
        });
        setIsFavorite(false);

        toast("Has eliminado de favoritos", {
          description: `"${name}" se ha eliminado de tus favoritos.`,
          action: {
            label: "Deshacer",
            onClick: async () => {
              setLoading(true);
              try {
                await FavoriteService.addFavorite({
                  type,
                  name,
                  userId,
                  artistName,
                  location,
                });
                setIsFavorite(true);
                toast.success("Acción revertida");
              } catch (e) {
                console.error(e);
                toast.error("No se pudo deshacer");
              } finally {
                setLoading(false);
              }
            },
          },
        });
      } else {
        // Añadir a favoritos
        await FavoriteService.addFavorite({
          type,
          name,
          userId,
          artistName,
          location,
        });
        setIsFavorite(true);

        toast.success("Añadido a favoritos", {
          description: `"${name}" se ha añadido a tus favoritos.`,
          action: {
            label: "Deshacer",
            onClick: async () => {
              setLoading(true);
              try {
                await FavoriteService.removeFavorite({
                  type,
                  name,
                  userId,
                  artistName,
                  location,
                });
                setIsFavorite(false);
                toast.success("Acción revertida");
              } catch (e) {
                console.error(e);
                toast.error("No se pudo deshacer");
              } finally {
                setLoading(false);
              }
            },
          },
        });
      }
    } catch (err) {
      console.error("Error al cambiar favorito", err);
      toast.error("No se pudo completar la acción");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={toggleFavorite}
      disabled={loading}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? "Eliminar de favoritos" : "Añadir a favoritos"}
      title={isFavorite ? "Eliminar de favoritos" : "Añadir a favoritos"}
      className={cn(
        "inline-flex items-center gap-2 rounded-md disabled:opacity-60",
        className
      )}
    >
      <Heart
        size={18}
        className={isFavorite ? "text-red-500" : "text-white"}
        fill={isFavorite ? "currentColor" : "none"}
      />
      <span>{isFavorite ? "Favorito" : "Favorito"}</span>
    </Button>
  );
}
