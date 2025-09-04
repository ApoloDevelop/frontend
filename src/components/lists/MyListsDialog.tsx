"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs } from "@/components/ui/tabs";
import { ListDetailDialog } from "./ListDetailDialog";
import { CreateListDialog } from "./CreateListDialog";
import { TabNavigation } from "./TabNavigation";
import { ListsTab } from "./ListsTab";
import { FavoritesTab } from "./FavoritesTab";
import { useMyLists } from "@/hooks/lists/useMyLists";
import { useFilterAndSort } from "@/hooks/lists/useFilterAndSort";
import { ItemType2 } from "@/types/items";
import { TabType } from "@/types/lists";

interface MyListsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number;
}

export function MyListsDialog({
  open,
  onOpenChange,
  userId,
}: MyListsDialogProps) {
  // Custom hooks
  const {
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
  } = useMyLists();

  const {
    searchQuery,
    setSearchQuery,
    sortOrder,
    filteredLists,
    filteredFavorites,
    toggleSortOrder,
  } = useFilterAndSort({ lists, favorites, activeTab });

  // Estados para modales
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState("");

  // Cargar listas cuando se abre el modal o cambia el tab
  useEffect(() => {
    if (open) {
      if (activeTab === "favorites") {
        fetchFavorites();
      } else {
        fetchLists(activeTab);
      }
    }
  }, [open, activeTab]);

  // Funciones auxiliares
  const handleListClick = (listId: number) => {
    setSelectedListId(listId);
    setDetailDialogOpen(true);
  };

  const getTabLabel = (type: string) => {
    switch (type) {
      case "artist":
        return "Artistas";
      case "album":
        return "Álbumes";
      case "track":
        return "Canciones";
      case "favorites":
        return "Favoritos";
      default:
        return type;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] w-[95vw] sm:w-full overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Mis Listas</DialogTitle>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as TabType)}
          >
            <TabNavigation
              activeTab={activeTab}
              onTabChange={(value) => setActiveTab(value)}
            />

            {/* Tabs de listas por tipo */}
            {(["artist", "album", "track"] as ItemType2[]).map((type) => (
              <ListsTab
                key={type}
                type={type}
                lists={filteredLists}
                loading={loading}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortOrder={sortOrder}
                onToggleSort={toggleSortOrder}
                onCreateList={() => setCreateDialogOpen(true)}
                onListClick={handleListClick}
                onDeleteList={handleDeleteList}
                getTabLabel={getTabLabel}
              />
            ))}

            {/* Tab de Favoritos */}
            <FavoritesTab
              favorites={filteredFavorites}
              loading={loading}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortOrder={sortOrder}
              onToggleSort={toggleSortOrder}
              onRemoveFavorite={handleRemoveFavorite}
              itemCovers={itemCovers}
            />
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Modal de detalle de lista */}
      {selectedListId && (
        <ListDetailDialog
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          listId={selectedListId}
          onListUpdated={() => {
            if (activeTab === "favorites") {
              fetchFavorites();
            } else {
              fetchLists(activeTab as ItemType2);
            }
          }}
        />
      )}

      {/* Modal de crear lista */}
      <CreateListDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        newListName={newListName}
        setNewListName={setNewListName}
        onCreateList={handleCreateList}
        loading={false}
      />
    </>
  );
}
