import { useCallback } from "react";
import { ListService } from "@/services/lists.service";
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

interface UseListActionsProps {
  lists: CustomList[];
  setLists: React.Dispatch<React.SetStateAction<CustomList[]>>;
  itemLists: number[];
  setItemLists: React.Dispatch<React.SetStateAction<number[]>>;
  resolveItem: () => Promise<any>;
  niceType: (t: ItemType) => string;
  itemType: ItemType;
  name: string;
  setOpen: (open: boolean) => void;
}

export function useListActions({
  lists,
  setLists,
  itemLists,
  setItemLists,
  resolveItem,
  niceType,
  itemType,
  name,
  setOpen,
}: UseListActionsProps) {
  const handleAddItemToList = useCallback(
    async (listId: number) => {
      try {
        const item = await resolveItem();
        if (!item) {
          console.error("No se encontró el ítem");
          return;
        }

        await ListService.addItemToList(listId, item.itemId);

        const list = lists.find((l) => l.id === listId);
        const listName = list?.name ?? `Lista ${listId}`;

        // Marca local
        setItemLists((prev) =>
          prev.includes(listId) ? prev : [...prev, listId]
        );

        toast.success("Añadido a la lista", {
          description: `${niceType(
            itemType
          )} "${name}" se ha añadido a "${listName}".`,
          action: {
            label: "Deshacer",
            onClick: async () => {
              try {
                await ListService.removeItemFromList(listId, item.itemId);
                setItemLists((prev) => prev.filter((id) => id !== listId));
                toast.success("Acción revertida");
              } catch (e) {
                console.error(e);
                toast.error("No se pudo deshacer");
              }
            },
          },
        });

        setOpen(false);
      } catch (error) {
        console.error("Error al añadir el ítem a la lista:", error);
        toast.error("No se pudo añadir a la lista");
      }
    },
    [lists, resolveItem, niceType, itemType, name, setItemLists, setOpen]
  );

  const handleRemoveItemFromList = useCallback(
    async (listId: number) => {
      try {
        const item = await resolveItem();
        if (!item) {
          console.error("No se encontró el ítem");
          return;
        }

        await ListService.removeItemFromList(listId, item.itemId);
        setItemLists((prev) => prev.filter((id) => id !== listId));

        const list = lists.find((l) => l.id === listId);
        const listName = list?.name ?? `Lista ${listId}`;

        toast("Eliminado de la lista", {
          description: `${niceType(
            itemType
          )} "${name}" se eliminó de "${listName}".`,
          action: {
            label: "Deshacer",
            onClick: async () => {
              try {
                await ListService.addItemToList(listId, item.itemId);
                setItemLists((prev) =>
                  prev.includes(listId) ? prev : [...prev, listId]
                );
                toast.success("Acción revertida");
              } catch (e) {
                console.error(e);
                toast.error("No se pudo deshacer");
              }
            },
          },
        });
      } catch (error) {
        console.error("Error al eliminar el ítem de la lista:", error);
        toast.error("No se pudo eliminar de la lista");
      }
    },
    [lists, resolveItem, niceType, itemType, name, setItemLists]
  );

  const handleCreateListAndAddItem = useCallback(
    async (newListName: string): Promise<boolean> => {
      if (!newListName) return false;

      try {
        const newList = await ListService.createList(newListName, itemType);
        setLists((prev) => [...prev, { ...newList, listItems: [] }]);

        const item = await resolveItem();
        if (item) {
          await ListService.addItemToList(newList.id, item.itemId);
          setItemLists((prev) => [...prev, newList.id]);

          toast.success("Lista creada", {
            description: `${niceType(
              itemType
            )} "${name}" se añadió a "${newListName}".`,
            action: {
              label: "Deshacer",
              onClick: async () => {
                try {
                  await ListService.removeItemFromList(newList.id, item.itemId);
                  setItemLists((prev) =>
                    prev.filter((id) => id !== newList.id)
                  );
                  toast.success("Acción revertida");
                } catch (e) {
                  console.error(e);
                  toast.error("No se pudo deshacer");
                }
              },
            },
          });
        }

        setOpen(false);
        return true;
      } catch (error) {
        console.error("Error al crear la lista o añadir el ítem:", error);
        toast.error("No se pudo crear la lista");
        return false;
      }
    },
    [resolveItem, niceType, itemType, name, setLists, setItemLists, setOpen]
  );

  return {
    handleAddItemToList,
    handleRemoveItemFromList,
    handleCreateListAndAddItem,
  };
}
