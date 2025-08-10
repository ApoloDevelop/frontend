"use client";
import React, { useEffect, useState } from "react";
import { Heart, Star } from "lucide-react";
import { FavoriteService } from "@/services/favorites.service";
import { useAlert } from "@/hooks/register/useAlert";
import { AlertMessage } from "../ui/AlertMessage";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type FavType = "artist" | "album" | "track" | "venue";

interface FavoriteButtonProps {
  type: FavType;
  name: string;
  userId: number; //(fake: 1)
  artistName?: string; // Optional, used for artist favorites
  location?: string; // Optional, used for venue favorites
  className?: string; // Optional, used for custom styling
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
  const { alertMsgs, setAlertMsgs, showAlert } = useAlert();

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
        await FavoriteService.removeFavorite({
          type,
          name,
          userId,
          artistName,
          location,
        });
        setIsFavorite(false);
        setAlertMsgs([`Has eliminado "${name}" de tus favoritos`]);
      } else {
        await FavoriteService.addFavorite({
          type,
          name,
          userId,
          artistName,
          location,
        });
        setIsFavorite(true);
        setAlertMsgs([`Has añadido "${name}" a tus favoritos`]);
      }
    } catch (err) {
      console.error("Error al cambiar favorito", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertMessage
        alertMsgs={alertMsgs}
        showAlert={showAlert}
        topSize="-8rem"
      />
      <Button
        type="button"
        onClick={toggleFavorite}
        disabled={loading}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? "Eliminar de favoritos" : "Añadir a favoritos"}
        title={isFavorite ? "Eliminar de favoritos" : "Añadir a favoritos"}
        className={cn(
          // mismo look & feel que tu AlbumPage
          "inline-flex items-center rounded-md disabled:opacity-60",
          className
        )}
      >
        <Star
          size={18}
          className={isFavorite ? "text-yellow-500" : "text-gray-500"}
          fill={isFavorite ? "currentColor" : "none"}
        />
        <span>{isFavorite ? "Favorito" : "Favorito"}</span>
      </Button>
    </>
  );
}
