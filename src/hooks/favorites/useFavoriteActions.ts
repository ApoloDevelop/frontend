import { useCallback } from "react";
import { FavoriteService } from "@/services/favorites.service";
import { toast } from "sonner";

type FavType = "artist" | "album" | "track" | "venue";

interface UseFavoriteActionsProps {
  type: FavType;
  name: string;
  userId: number;
  artistName?: string;
  albumName?: string;
  location?: string;
  isFavorite: boolean;
  setIsFavorite: (favorite: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export function useFavoriteActions({
  type,
  name,
  userId,
  artistName,
  albumName,
  location,
  isFavorite,
  setIsFavorite,
  setLoading,
}: UseFavoriteActionsProps) {
  const addToFavorites = useCallback(async () => {
    try {
      await FavoriteService.addFavorite({
        type,
        name,
        userId,
        artistName,
        albumName,
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
    } catch (err) {
      console.error("Error al añadir favorito", err);
      toast.error("No se pudo añadir a favoritos");
      throw err;
    }
  }, [type, name, userId, artistName, location, setIsFavorite, setLoading]);

  const removeFromFavorites = useCallback(async () => {
    try {
      await FavoriteService.removeFavorite({
        type,
        name,
        userId,
        artistName,
        albumName,
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
    } catch (err) {
      console.error("Error al eliminar favorito", err);
      toast.error("No se pudo eliminar de favoritos");
      throw err;
    }
  }, [type, name, userId, artistName, location, setIsFavorite, setLoading]);

  const toggleFavorite = useCallback(async () => {
    setLoading(true);
    try {
      if (isFavorite) {
        await removeFromFavorites();
      } else {
        await addToFavorites();
      }
    } catch (err) {
      console.error("Error al cambiar favorito", err);
      toast.error("No se pudo completar la acción");
    } finally {
      setLoading(false);
    }
  }, [isFavorite, addToFavorites, removeFromFavorites, setLoading]);

  return {
    toggleFavorite,
    addToFavorites,
    removeFromFavorites,
  };
}
