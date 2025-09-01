import { useState, useEffect, useCallback } from "react";
import { ListService } from "@/services/lists.service";
import { ItemService } from "@/services/item.service";
import { toast } from "sonner";

type ItemType = "artist" | "album" | "track" | "venue";

interface ListItem {
  itemId: number;
}

interface CustomList {
  id: number;
  name: string;
  listItems: ListItem[];
}

interface UseListDialogProps {
  userId: number;
  itemType: ItemType;
  name: string;
  artistName?: string;
  location?: string;
  open: boolean;
}

export function useListDialog({
  userId,
  itemType,
  name,
  artistName,
  location,
  open,
}: UseListDialogProps) {
  const [lists, setLists] = useState<CustomList[]>([]);
  const [loading, setLoading] = useState(false);
  const [itemLists, setItemLists] = useState<number[]>([]);

  const niceType = useCallback(
    (t: ItemType) =>
      t === "artist"
        ? "El/la artista"
        : t === "album"
        ? "El álbum"
        : t === "track"
        ? "La canción"
        : "La sala",
    []
  );

  const resolveItem = useCallback(async () => {
    return ItemService.findItemByTypeAndName(itemType, name, {
      artistName,
      location,
    });
  }, [itemType, name, artistName, location]);

  const loadListsAndItemStatus = useCallback(async () => {
    if (!open) return;

    setLoading(true);
    try {
      const fetchedLists = await ListService.getUserLists(itemType);
      const normalized = fetchedLists.map((list: any) => ({
        ...list,
        listItems: list.listItems ?? [],
      })) as CustomList[];
      setLists(normalized);

      const item = await resolveItem();
      if (item) {
        const itemId = item.itemId;
        const listsWithItem = normalized
          .filter((l) => l.listItems.some((i) => i.itemId === itemId))
          .map((l) => l.id);
        setItemLists(listsWithItem);
      } else {
        setItemLists([]);
      }
    } catch (e) {
      console.error("Error al cargar listas/ítem:", e);
      toast.error("No se pudieron cargar tus listas");
    } finally {
      setLoading(false);
    }
  }, [open, userId, itemType, name, artistName, location, resolveItem]);

  useEffect(() => {
    loadListsAndItemStatus();
  }, [loadListsAndItemStatus]);

  return {
    lists,
    setLists,
    loading,
    itemLists,
    setItemLists,
    niceType,
    resolveItem,
  };
}
