"use client";

import { useState, useEffect } from "react";
import { List, FavoriteItem, TabType } from "@/types/lists";
import { ItemType2 } from "@/types/items";

interface UseFilterAndSortOptions {
  lists: List[];
  favorites: FavoriteItem[];
  activeTab: TabType;
}

export function useFilterAndSort({
  lists,
  favorites,
  activeTab,
}: UseFilterAndSortOptions) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filteredLists, setFilteredLists] = useState<List[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<FavoriteItem[]>(
    []
  );

  // Filtrar y ordenar listas y favoritos
  useEffect(() => {
    if (activeTab === "favorites") {
      let filtered = favorites.filter(
        (favorite) =>
          favorite.item.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (favorite.item.artistName?.toLowerCase() || "").includes(
            searchQuery.toLowerCase()
          ) ||
          (favorite.item.albumName?.toLowerCase() || "").includes(
            searchQuery.toLowerCase()
          )
      );

      filtered.sort((a, b) => {
        const comparison = a.item.name.localeCompare(b.item.name);
        return sortOrder === "asc" ? comparison : -comparison;
      });

      setFilteredFavorites(filtered);
    } else {
      let filtered = lists.filter((list) =>
        list.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      filtered.sort((a, b) => {
        const comparison = a.name.localeCompare(b.name);
        return sortOrder === "asc" ? comparison : -comparison;
      });

      setFilteredLists(filtered);
    }
  }, [lists, favorites, searchQuery, sortOrder, activeTab]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return {
    searchQuery,
    setSearchQuery,
    sortOrder,
    filteredLists,
    filteredFavorites,
    toggleSortOrder,
  };
}
