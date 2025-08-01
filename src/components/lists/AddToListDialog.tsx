// components/lists/AddToListDialog.tsx
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
// Si ya tienes un servicio para listas, impórtalo aquí:
// import { ListService } from "@/services/list.service";

interface CustomList {
  id: number;
  name: string;
}

interface AddToListDialogProps {
  userId: number;
  height?: number; // opcional, para personalizar el tamaño del botón
  itemType: string; // opcional, para filtrar por tipo de ítem
}

export function AddToListDialog({
  userId,
  height,
  itemType,
}: AddToListDialogProps) {
  const [open, setOpen] = useState(false);
  const [lists, setLists] = useState<CustomList[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      ListService.getUserLists(userId, itemType)
        .then((fetchedLists) => setLists(fetchedLists))
        .catch((error) => console.error("Error al cargar las listas:", error))
        .finally(() => setLoading(false));
    }
  }, [open, userId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={`ml-4 px-4 text-white transition" ${
            height ? `mt-${height}` : ""
          }`}
        >
          Añadir a lista
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir a una lista</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p>Cargando listas…</p>
        ) : lists.length > 0 ? (
          <ul className="max-h-60 overflow-y-auto divide-y">
            {lists.map((l) => (
              <li key={l.id} className="py-2">
                {l.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No tienes listas aún.</p>
        )}

        <DialogClose asChild>
          <Button className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition text-black">
            Cerrar
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
