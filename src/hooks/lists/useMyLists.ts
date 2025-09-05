"use client";

import { useState, useEffect } from "react";
import { ListService } from "@/services/lists.service";
import { FavoriteService } from "@/services/favorites.service";
import { SpotifyService } from "@/services/spotify.service";
import { toast } from "sonner";
import { ItemType2 } from "@/types/items";
import { FavoriteItem, List, TabType } from "@/types/lists";

export function useMyLists() {
  const [activeTab, setActiveTab] = useState<TabType>("artist");
  const [lists, setLists] = useState<List[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [itemCovers, setItemCovers] = useState<Record<number, string>>({});

  // Función para obtener el cover de un item
  const getCoverForItem = async (
    item: FavoriteItem,
    itemType: ItemType2
  ): Promise<string> => {
    try {
      const { name, artistName, albumName } = item.item || {};

      if (itemType === "artist") {
        const artist = await SpotifyService.fetchArtistByName(name || "");
        return artist?.images?.[0]?.url || "/default-cover.png";
      }

      if (itemType === "album" && artistName) {
        const album = await SpotifyService.fetchAlbumByName(
          name || "",
          artistName
        );
        return album?.images?.[0]?.url || "/default-cover.png";
      }

      if (itemType === "track" && artistName) {
        const track = await SpotifyService.fetchSongByName(
          name || "",
          albumName,
          artistName
        );
        return track?.album?.images?.[0]?.url || "/default-cover.png";
      }

      return "/default-cover.png";
    } catch (error) {
      console.warn("Error loading cover for item:", error);
      return "/default-cover.png";
    }
  };

  // Cargar covers para favoritos
  const loadCoversForFavorites = async (items: FavoriteItem[]) => {
    const newCovers: Record<number, string> = {};

    await Promise.all(
      items.map(async (item) => {
        const itemKey = item.item?.id || item.itemId;

        if (!itemCovers[itemKey]) {
          const cover = await getCoverForItem(item, item.type);
          newCovers[itemKey] = cover;
        }
      })
    );

    if (Object.keys(newCovers).length > 0) {
      setItemCovers((prev) => ({ ...prev, ...newCovers }));
    }
  };

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const fetchedFavorites = await FavoriteService.getAllUserFavorites();
      setFavorites(fetchedFavorites);

      // Cargar covers para los favoritos
      if (fetchedFavorites.length > 0) {
        await loadCoversForFavorites(fetchedFavorites);
      }
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
      toast.error("Error al cargar los favoritos");
    } finally {
      setLoading(false);
    }
  };

  const fetchLists = async (itemType: ItemType2) => {
    setLoading(true);
    try {
      const fetchedLists = await ListService.getUserLists(itemType);
      // Normalizar las listas agregando propiedades que faltan
      const normalizedLists = fetchedLists.map((list: any) => ({
        ...list,
        listItems: list.listItems || [],
        createdAt: list.createdAt || new Date().toISOString(),
      }));
      setLists(normalizedLists);
    } catch (error) {
      console.error("Error al cargar listas:", error);
      toast.error("Error al cargar las listas");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteList = async (listId: number, listName: string) => {
    try {
      await ListService.deleteList(listId);
      setLists((prev) => prev.filter((list) => list.id !== listId));
      toast.success(`Lista "${listName}" eliminada`);
    } catch (error) {
      console.error("Error al eliminar lista:", error);
      toast.error("Error al eliminar la lista");
    }
  };

  const handleCreateList = async (listName: string): Promise<boolean> => {
    try {
      if (activeTab === "favorites") return false; // No crear listas en favoritos
      const newList = await ListService.createList(
        listName,
        activeTab as ItemType2
      );
      setLists((prev) => [
        ...prev,
        { ...newList, listItems: [], createdAt: new Date().toISOString() },
      ]);
      toast.success(`Lista "${listName}" creada`);
      return true;
    } catch (error) {
      console.error("Error al crear lista:", error);
      toast.error("Error al crear la lista");
      return false;
    }
  };

  const handleRemoveFavorite = async (item: FavoriteItem) => {
    try {
      await FavoriteService.removeFavorite({
        type: item.type,
        name: item.item.name,
        artistName: item.item.artistName,
      });
      setFavorites((prev) => prev.filter((fav) => fav.itemId !== item.itemId));
      toast.success(`"${item.item.name}" eliminado de favoritos`);
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
      toast.error("Error al eliminar el favorito");
    }
  };

  return {
    activeTab,
    setActiveTab,
    lists,
    favorites,
    loading,
    itemCovers,
    fetchFavorites,
    fetchLists,
    handleDeleteList,
    handleCreateList,
    handleRemoveFavorite,
  };
}
