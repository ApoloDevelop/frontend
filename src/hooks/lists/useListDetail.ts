import { useState, useEffect } from "react";
import { ListService } from "@/services/lists.service";
import { toast } from "sonner";
import { TagDraft } from "@/types/article";
import { ListDetail, ListItem } from "@/types/lists";

interface UseListDetailOptions {
  listId: number;
  open: boolean;
  onListUpdated: () => void;
}

export function useListDetail({ listId, open, onListUpdated }: UseListDetailOptions) {
  const [list, setList] = useState<ListDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [addingItem, setAddingItem] = useState(false);

  // Filtrar y ordenar elementos
  const filteredItems = list?.listItems.filter((item) => {
    const name = item.item?.name?.toLowerCase() || "";
    const artistName = item.item?.artistName?.toLowerCase() || "";
    const albumName = item.item?.albumName?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();

    return (
      name.includes(query) ||
      artistName.includes(query) ||
      albumName.includes(query)
    );
  }).sort((a, b) => {
    const aName = a.item?.name || "";
    const bName = b.item?.name || "";
    const comparison = aName.localeCompare(bName);
    return sortOrder === "asc" ? comparison : -comparison;
  }) || [];

  const fetchListDetails = async () => {
    setLoading(true);
    try {
      const details = await ListService.getListById(listId);
      setList(details);
      setNewName(details.name);
      return details;
    } catch (error) {
      console.error("Error al cargar detalles de la lista:", error);
      toast.error("Error al cargar la lista");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async () => {
    if (!newName.trim() || newName === list?.name) {
      setEditingName(false);
      setNewName(list?.name || "");
      return;
    }

    try {
      await ListService.updateListName(listId, newName.trim());
      setList((prev) => (prev ? { ...prev, name: newName.trim() } : null));
      setEditingName(false);
      toast.success("Nombre actualizado");
      onListUpdated();
    } catch (error) {
      console.error("Error al actualizar nombre:", error);
      toast.error("Error al actualizar el nombre");
    }
  };

  const handleRemoveItem = async (itemId: number, itemName: string) => {
    try {
      await ListService.removeItemFromList(listId, itemId);
      setList((prev) =>
        prev
          ? {
              ...prev,
              listItems: prev.listItems.filter(
                (item) => item.itemId !== itemId
              ),
            }
          : null
      );
      toast.success(`"${itemName}" eliminado de la lista`);
    } catch (error) {
      console.error("Error al eliminar item:", error);
      toast.error("Error al eliminar el elemento");
    }
  };

  const handleAddItem = async (tag: TagDraft) => {
    setAddingItem(true);
    try {
      const itemId = await ListService.resolveTagToItemId(tag);

      if (itemId) {
        await ListService.addItemToList(listId, itemId);
        toast.success(`"${tag.name}" añadido a la lista`);
        return await fetchListDetails(); // Retornar la lista actualizada
      } else {
        toast.error("No se pudo añadir el elemento a la lista");
      }
    } catch (error) {
      console.error("Error al añadir item:", error);
      toast.error("Error al añadir el elemento");
    } finally {
      setAddingItem(false);
    }
  };

  // Cargar detalles de la lista cuando se abre el diálogo
  useEffect(() => {
    if (open && listId) {
      fetchListDetails();
    }
  }, [open, listId]);

  return {
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
    fetchListDetails,
    handleUpdateName,
    handleRemoveItem,
    handleAddItem,
  };
}
