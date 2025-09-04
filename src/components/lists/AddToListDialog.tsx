"use client";
import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDialogStates } from "@/hooks/lists/useDialogStates";
import { useListDialog } from "@/hooks/lists/useListDialog";
import { useListActions } from "@/hooks/lists/useListActions";
import { CreateListDialog } from "./CreateListDialog";
import { RemoveFromListDialog } from "./RemoveFromListDialog";
import { ListContent } from "./ListContent";
import { AddToListDialogProps } from "@/types/lists";

export function AddToListDialog({
  userId,
  itemType,
  name,
  artistName,
  location,
  height,
  className,
}: AddToListDialogProps) {
  // Dialog states hook
  const {
    open,
    createDialogOpen,
    removeDialogOpen,
    selectedListId,
    newListName,
    loading,
    setOpen,
    setNewListName,
    openRemoveDialog,
    closeRemoveDialog,
    openCreateDialog,
    closeCreateDialog,
    setLoading,
  } = useDialogStates();

  // List data hook
  const { lists, setLists, itemLists, setItemLists, niceType, resolveItem } =
    useListDialog({
      userId,
      itemType,
      name,
      artistName,
      location,
      open,
    });

  // List actions hook
  const {
    handleAddItemToList,
    handleRemoveItemFromList,
    handleCreateListAndAddItem,
  } = useListActions({
    lists,
    setLists,
    itemLists,
    setItemLists,
    resolveItem,
    niceType,
    itemType,
    name,
    setOpen,
  });

  const handleCreateList = async (listName: string): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await handleCreateListAndAddItem(listName);
      if (success) {
        closeCreateDialog();
        return true;
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveConfirm = async () => {
    if (selectedListId) {
      await handleRemoveItemFromList(selectedListId);
      closeRemoveDialog();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            className={cn(
              "inline-flex items-center gap-2 rounded-md disabled:opacity-60",
              height ? `h-${height}` : "",
              className
            )}
            title="Añadir a lista"
          >
            <Plus className="h-4 w-4" />
            Añadir a lista
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir a una lista</DialogTitle>
          </DialogHeader>

          <ListContent
            lists={lists}
            itemLists={itemLists}
            loading={loading}
            onAddToList={handleAddItemToList}
            onRemoveFromList={openRemoveDialog}
            onCreateNew={openCreateDialog}
          />

          <DialogClose asChild>
            <Button className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition text-black">
              Cerrar
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      <CreateListDialog
        open={createDialogOpen}
        onOpenChange={closeCreateDialog}
        newListName={newListName}
        setNewListName={setNewListName}
        onCreateList={handleCreateList}
        loading={loading}
      />

      <RemoveFromListDialog
        open={removeDialogOpen}
        onOpenChange={closeRemoveDialog}
        onConfirm={handleRemoveConfirm}
        loading={loading}
      />
    </>
  );
}
