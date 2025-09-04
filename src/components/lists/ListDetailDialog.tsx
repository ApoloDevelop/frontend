"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListService } from "@/services/lists.service";
import { SpotifyService } from "@/services/spotify.service";
import { toast } from "sonner";
import {
  Trash2,
  Plus,
  Search,
  ArrowUpDown,
  Edit2,
  Check,
  X,
  Music,
  User,
  Disc3,
} from "lucide-react";
import { TagPicker } from "@/components/news/TagPicker";
import { ListTagPicker } from "./ListTagPicker";
import { TagDraft } from "@/types/article";
import Image from "next/image";

type ItemType = "artist" | "album" | "track";

interface ListItem {
  itemId: number;
  item: {
    id: number;
    name: string;
    artistName?: string;
    albumName?: string;
  };
}

interface ListDetail {
  id: number;
  name: string;
  itemType: ItemType;
  createdAt: string;
  listItems: ListItem[];
}

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
  const [list, setList] = useState<ListDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [tagPickerOpen, setTagPickerOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState<ListItem[]>([]);
  const [itemCovers, setItemCovers] = useState<Record<number, string>>({});
  const [addingItem, setAddingItem] = useState(false);

  // Función para obtener el cover de un item
  const getCoverForItem = async (
    item: ListItem,
    itemType: ItemType
  ): Promise<string> => {
    try {
      const { name, artistName, albumName } = item.item || {};

      if (itemType === "artist") {
        const artist = await SpotifyService.fetchArtistByName(name || "");
        return artist?.images?.[0]?.url || "/default-cover.png";
      }

      if (itemType === "album" && artistName) {
        const album = await SpotifyService.fetchAlbumByName(
          name || "",
          artistName
        );
        return album?.images?.[0]?.url || "/default-cover.png";
      }

      if (itemType === "track" && artistName) {
        const track = await SpotifyService.fetchSongByName(
          name || "",
          albumName,
          artistName
        );
        return track?.album?.images?.[0]?.url || "/default-cover.png";
      }

      return "/default-cover.png";
    } catch (error) {
      console.warn("Error loading cover for item:", error);
      return "/default-cover.png";
    }
  };

  // Cargar covers para los items
  const loadCovers = async (items: ListItem[], itemType: ItemType) => {
    const newCovers: Record<number, string> = {};

    await Promise.all(
      items.map(async (item) => {
        const itemKey = item.item?.id || item.itemId;

        if (!itemCovers[itemKey]) {
          const cover = await getCoverForItem(item, itemType);
          newCovers[itemKey] = cover;
        } else {
        }
      })
    );

    if (Object.keys(newCovers).length > 0) {
      setItemCovers((prev) => {
        const updated = { ...prev, ...newCovers };
        return updated;
      });
    }
  };

  // Cargar detalles de la lista
  useEffect(() => {
    if (open && listId) {
      fetchListDetails();
    }
  }, [open, listId]);

  // Filtrar y ordenar elementos
  useEffect(() => {
    if (!list) return;

    let filtered = list.listItems.filter((item) => {
      // Validación defensiva para evitar errores con datos undefined
      const name = item.item?.name?.toLowerCase() || "";
      const artistName = item.item?.artistName?.toLowerCase() || "";
      const albumName = item.item?.albumName?.toLowerCase() || "";
      const query = searchQuery.toLowerCase();

      return (
        name.includes(query) ||
        artistName.includes(query) ||
        albumName.includes(query)
      );
    });

    filtered.sort((a, b) => {
      const aName = a.item?.name || "";
      const bName = b.item?.name || "";
      const comparison = aName.localeCompare(bName);
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredItems(filtered);
  }, [list, searchQuery, sortOrder]);

  const fetchListDetails = async () => {
    setLoading(true);
    try {
      const details = await ListService.getListById(listId);
      setList(details);
      setNewName(details.name);

      // Cargar covers para los items
      if (details.listItems.length > 0) {
        await loadCovers(details.listItems, details.itemType);
      }
    } catch (error) {
      console.error("Error al cargar detalles de la lista:", error);
      toast.error("Error al cargar la lista");
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
      // Intentar resolver el tag a un itemId
      const itemId = await ListService.resolveTagToItemId(tag);

      if (itemId) {
        await ListService.addItemToList(listId, itemId);
        toast.success(`"${tag.name}" añadido a la lista`);
        await fetchListDetails(); // Recargar la lista con los covers
      } else {
        toast.error("No se pudo añadir el elemento a la lista");
      }
    } catch (error) {
      console.error("Error al añadir item:", error);
      toast.error("Error al añadir el elemento");
    } finally {
      setAddingItem(false);
    }
    setTagPickerOpen(false);
  };

  const getTypeIcon = (type: ItemType) => {
    switch (type) {
      case "artist":
        return <User className="w-4 h-4" />;
      case "album":
        return <Disc3 className="w-4 h-4" />;
      case "track":
        return <Music className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: ItemType) => {
    switch (type) {
      case "artist":
        return "Artistas";
      case "album":
        return "Álbumes";
      case "track":
        return "Canciones";
    }
  };

  const formatItemInfo = (item: ListItem) => {
    const { name, artistName, albumName } = item.item || {};

    switch (list?.itemType) {
      case "artist":
        return name || "Nombre no disponible";
      case "album":
        return artistName
          ? `${name || "Sin nombre"} - ${artistName}`
          : name || "Sin nombre";
      case "track":
        return `${name || "Sin nombre"}${artistName ? ` - ${artistName}` : ""}${
          albumName ? ` (${albumName})` : ""
        }`;
      default:
        return name || "Sin nombre";
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
              <div className="flex items-center gap-2">
                {editingName ? (
                  <>
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="text-xl font-bold"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdateName();
                        if (e.key === "Escape") {
                          setEditingName(false);
                          setNewName(list.name);
                        }
                      }}
                    />
                    <Button size="sm" onClick={handleUpdateName}>
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingName(false);
                        setNewName(list.name);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold">{list.name}</h2>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingName(true)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>

              {/* Controles */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder={`Buscar en la lista...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                  }
                  className="flex items-center gap-2"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  {sortOrder === "asc" ? "A-Z" : "Z-A"}
                </Button>
                <Button
                  onClick={() => setTagPickerOpen(true)}
                  size="sm"
                  className="flex items-center gap-2"
                  disabled={addingItem}
                >
                  <Plus className="w-4 h-4" />
                  {addingItem ? "Añadiendo..." : "Añadir"}
                </Button>
              </div>

              {/* Lista de elementos */}
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchQuery
                      ? `No se encontraron elementos que coincidan con "${searchQuery}"`
                      : "Esta lista está vacía"}
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <div
                      key={item.itemId}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50/80 transition-all duration-200 hover:shadow-sm"
                    >
                      {/* Cover del item */}
                      <div className="relative w-20 h-20 shrink-0">
                        {(() => {
                          const coverKey = item.item?.id || item.itemId;
                          const coverUrl =
                            itemCovers[coverKey] || "/default-cover.png";
                          return (
                            <Image
                              src={coverUrl}
                              alt={item.item?.name || "Cover"}
                              fill
                              className="object-cover rounded-lg shadow-sm"
                              sizes="80px"
                            />
                          );
                        })()}
                      </div>

                      {/* Información del item */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(list?.itemType || "artist")}
                          <span className="uppercase text-xs font-medium text-muted-foreground tracking-wide">
                            {list?.itemType}
                          </span>
                        </div>
                        <h3 className="font-semibold text-base mb-2 line-clamp-1 text-gray-900">
                          {item.item?.name || "Sin nombre"}
                        </h3>
                        {item.item?.artistName && (
                          <p className="text-muted-foreground text-sm line-clamp-1 mb-1 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{item.item.artistName}</span>
                          </p>
                        )}
                        {item.item?.albumName && (
                          <p className="text-muted-foreground text-sm line-clamp-1 flex items-center gap-1">
                            <Disc3 className="w-3 h-3" />
                            <span>{item.item.albumName}</span>
                          </p>
                        )}
                      </div>

                      {/* Botón eliminar */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleRemoveItem(
                            item.itemId,
                            item.item?.name || "elemento"
                          )
                        }
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>

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
        onAdd={handleAddItem}
        itemType={list?.itemType || "artist"}
        disabled={addingItem}
      />
    </>
  );
}
