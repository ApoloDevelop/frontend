"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { ListService } from "@/services/lists.service";
import { Input } from "../ui/input";
import { ItemService } from "@/services/item.service";
import { useAlert } from "@/hooks/register/useAlert";
import { AlertMessage } from "../ui/AlertMessage";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type ItemType = "artist" | "album" | "track" | "venue";

interface ListItem {
  itemId: number;
}

interface CustomList {
  id: number;
  name: string;
  listItems: ListItem[];
}

interface AddToListDialogProps {
  userId: number;
  itemType: ItemType;
  name: string; // nombre del ítem (artista/álbum/canción/sala)
  artistName?: string; // requerido para album/track
  location?: string; // opcional para venue
  height?: number;
  className?: string; // para estilos personalizados
}

export function AddToListDialog({
  userId,
  itemType,
  name,
  artistName,
  location,
  height,
  className,
}: AddToListDialogProps) {
  console.log({ userId, itemType, name, artistName, location, height });
  const { alertMsgs, setAlertMsgs, showAlert } = useAlert();
  const [open, setOpen] = useState(false);
  const [lists, setLists] = useState<CustomList[]>([]);
  const [loading, setLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [itemLists, setItemLists] = useState<number[]>([]); // IDs de las listas que contienen el ítem
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);

  const niceType = (t: ItemType) =>
    t === "artist"
      ? "El/la artista"
      : t === "album"
      ? "El álbum"
      : t === "track"
      ? "La canción"
      : "La sala";

  const resolveItem = async () => {
    // Este método asume que ItemService soporta el contexto opcional { artistName, location }
    return ItemService.findItemByTypeAndName(itemType, name, {
      artistName,
      location,
    });
  };

  const handleAddItemToList = async (listId: number) => {
    try {
      const item = await resolveItem();
      if (!item) {
        console.error("No se encontró el ítem");
        return;
      }

      await ListService.addItemToList(listId, item.itemId);

      // Obtener el nombre de la lista
      const list = lists.find((l) => l.id === listId);
      if (list) {
        setAlertMsgs((prev) => [
          ...prev,
          `${niceType(itemType)} "${name}" se ha añadido a la lista "${
            list.name
          }".`,
        ]);
      }

      console.log(`Ítem añadido a la lista con ID ${listId}`);
      setOpen(false); // Cerrar el diálogo
    } catch (error) {
      console.error("Error al añadir el ítem a la lista:", error);
    }
  };

  const handleCreateListAndAddItem = async () => {
    if (!newListName) return;

    try {
      setLoading(true);
      const newList = await ListService.createList(
        userId,
        newListName,
        itemType
      );
      setLists((prev) => [...prev, { ...newList, listItems: [] }]);

      // Añadir el ítem a la nueva lista
      const item = await resolveItem();
      if (item) {
        await ListService.addItemToList(newList.id, item.itemId);
        setAlertMsgs((prev) => [
          ...prev,
          `${niceType(
            itemType
          )} "${name}" se ha añadido a la nueva lista "${newListName}".`,
        ]);
      }

      setCreateDialogOpen(false); // Cerrar el diálogo
      setOpen(false); // Cerrar el diálogo principal
      setNewListName(""); // Limpiar el nombre de la lista
    } catch (error) {
      console.error("Error al crear la lista o añadir el ítem:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItemDialog = (listId: number) => {
    setSelectedListId(listId);
    setRemoveDialogOpen(true);
  };

  const handleRemoveItemFromList = async () => {
    if (!selectedListId) return;

    try {
      const item = await resolveItem();
      if (!item) {
        console.error("No se encontró el ítem");
        return;
      }

      await ListService.removeItemFromList(selectedListId, item.itemId);
      console.log(`Ítem eliminado de la lista con ID ${selectedListId}`);
      setItemLists((prev) => prev.filter((id) => id !== selectedListId));
      setRemoveDialogOpen(false);
    } catch (error) {
      console.error("Error al eliminar el ítem de la lista:", error);
    }
  };

  useEffect(() => {
    if (!open) return;
    setLoading(true);

    (async () => {
      try {
        // 1) Traer listas del usuario (filtradas por tipo)
        const fetchedLists = await ListService.getUserLists(userId, itemType);
        const normalized = fetchedLists.map((list) => ({
          ...list,
          listItems: (list as any).listItems ?? [],
        })) as CustomList[];
        setLists(normalized);

        // 2) Saber en qué listas está el ítem actual
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
      } finally {
        setLoading(false);
      }
    })();
  }, [open, userId, itemType, name, artistName, location]);

  return (
    <>
      {showAlert && alertMsgs.length > 0 && (
        <AlertMessage
          alertMsgs={alertMsgs}
          showAlert={showAlert}
          topSize="-4rem"
        />
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            className={cn(
              "inline-flex items-center rounded-md disabled:opacity-60",
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

          {loading ? (
            <p>Cargando listas…</p>
          ) : (
            <ul className="max-h-60 overflow-y-auto divide-y">
              <li
                className="py-2 px-4 border rounded bg-pink-100 hover:bg-blue-200 cursor-pointer transition font-semibold"
                onClick={() => setCreateDialogOpen(true)}
              >
                + Crear nueva lista
              </li>
              {lists.length > 0 ? (
                lists.map((l) => (
                  <li
                    key={l.id}
                    className={`py-2 px-4 border rounded hover:bg-gray-200 cursor-pointer transition ${
                      itemLists.includes(l.id) ? "bg-green-100" : ""
                    }`}
                    onClick={() =>
                      itemLists.includes(l.id)
                        ? handleRemoveItemDialog(l.id)
                        : handleAddItemToList(l.id)
                    }
                  >
                    {l.name}
                    {itemLists.includes(l.id) && (
                      <span className="ml-2 text-green-600 font-bold">✔</span>
                    )}
                  </li>
                ))
              ) : (
                <p className="py-2 px-4 text-gray-500">No tienes listas aún.</p>
              )}
            </ul>
          )}

          <DialogClose asChild>
            <Button className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition text-black">
              Cerrar
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear nueva lista</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Nombre de la lista"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="border rounded px-2 py-1"
            />

            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setCreateDialogOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 text-black"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateListAndAddItem}
                className=" text-white"
              >
                Crear
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar de la lista</DialogTitle>
          </DialogHeader>
          <p>¿Estás seguro de que deseas eliminar este ítem de la lista?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => setRemoveDialogOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 text-black"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleRemoveItemFromList}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
