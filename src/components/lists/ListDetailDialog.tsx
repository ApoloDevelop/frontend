"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ListTagPicker } from "./ListTagPicker";
import { EditableListHeader } from "./EditableListHeader";
import { ListControls } from "./ListControls";
import { ListItemsGrid } from "./ListItemsGrid";
import { useListDetail, useItemCovers } from "@/hooks/lists";
import { getTypeIcon, getTypeLabel } from "@/utils/listItemUtils";
import { TagDraft } from "@/types/article";

interface ListDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listId: number;
  onListUpdated: () => void;
}

export function ListDetailDialog({
  open,
  onOpenChange,
  listId,
  onListUpdated,
}: ListDetailDialogProps) {
  const [tagPickerOpen, setTagPickerOpen] = useState(false);

  // Custom hooks
  const {
    list,
    loading,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    editingName,
    setEditingName,
    newName,
    setNewName,
    addingItem,
    filteredItems,
    handleUpdateName,
    handleRemoveItem,
    handleAddItem,
  } = useListDetail({ listId, open, onListUpdated });

  const { loadCovers, getCoverUrl } = useItemCovers();

  // Cargar covers cuando la lista cambie
  useEffect(() => {
    if (list?.listItems.length) {
      loadCovers(list.listItems, list.itemType);
    }
  }, [list?.listItems, list?.itemType]);

  const handleCancelEdit = () => {
    setEditingName(false);
    setNewName(list?.name || "");
  };

  const handleTagPickerAdd = async (tag: TagDraft) => {
    const updatedList = await handleAddItem(tag);
    setTagPickerOpen(false);
    
    // Cargar covers para la lista actualizada
    if (updatedList?.listItems.length) {
      await loadCovers(updatedList.listItems, updatedList.itemType);
    }
  };

  if (!list && !loading) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {list && getTypeIcon(list.itemType)}
              <span>Lista de {list && getTypeLabel(list.itemType)}</span>
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="text-center py-8">Cargando...</div>
          ) : list ? (
            <div className="space-y-4">
              {/* Nombre de la lista */}
              <EditableListHeader
                name={list.name}
                editingName={editingName}
                newName={newName}
                setNewName={setNewName}
                setEditingName={setEditingName}
                onUpdateName={handleUpdateName}
                onCancelEdit={handleCancelEdit}
              />

              {/* Controles */}
              <ListControls
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                onAddItem={() => setTagPickerOpen(true)}
                addingItem={addingItem}
              />

              {/* Lista de elementos */}
              <ListItemsGrid
                items={filteredItems}
                itemType={list.itemType}
                searchQuery={searchQuery}
                getCoverUrl={getCoverUrl}
                onRemoveItem={handleRemoveItem}
              />

              <div className="text-sm text-gray-500">
                {list.listItems.length} elemento
                {list.listItems.length !== 1 ? "s" : ""} en total
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* TagPicker para añadir elementos */}
      <ListTagPicker
        open={tagPickerOpen}
        onClose={() => setTagPickerOpen(false)}
        onAdd={handleTagPickerAdd}
        itemType={list?.itemType || "artist"}
        disabled={addingItem}
      />
    </>
  );
}
