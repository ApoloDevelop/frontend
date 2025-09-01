import { useState, useEffect, useCallback } from "react";
import { FavoriteService } from "@/services/favorites.service";

type FavType = "artist" | "album" | "track" | "venue";

interface UseFavoriteStatusProps {
  type: FavType;
  name: string;
  userId: number;
  artistName?: string;
  location?: string;
}

export function useFavoriteStatus({
  type,
  name,
  userId,
  artistName,
  location,
}: UseFavoriteStatusProps) {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const checkFavoriteStatus = useCallback(async () => {
    let mounted = true;
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
    return () => {
      mounted = false;
    };
  }, [type, name, userId, artistName, location]);

  useEffect(() => {
    checkFavoriteStatus();
  }, [checkFavoriteStatus]);

  return {
    isFavorite,
    setIsFavorite,
    loading,
    setLoading,
  };
}
