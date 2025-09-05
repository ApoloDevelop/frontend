import { useState } from "react";

export function useDialogStates() {
  const [open, setOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [newListName, setNewListName] = useState("");
  const [loading, setLoading] = useState(false);

  const openRemoveDialog = (listId: number) => {
    setSelectedListId(listId);
    setRemoveDialogOpen(true);
  };

  const closeRemoveDialog = () => {
    setRemoveDialogOpen(false);
    setSelectedListId(null);
  };

  const openCreateDialog = () => {
    setCreateDialogOpen(true);
  };

  const closeCreateDialog = () => {
    setCreateDialogOpen(false);
    setNewListName("");
  };

  return {
    // States
    open,
    createDialogOpen,
    removeDialogOpen,
    selectedListId,
    newListName,
    loading,

    // Setters
    setOpen,
    setCreateDialogOpen,
    setRemoveDialogOpen,
    setSelectedListId,
    setNewListName,
    setLoading,

    // Actions
    openRemoveDialog,
    closeRemoveDialog,
    openCreateDialog,
    closeCreateDialog,
  };
}
