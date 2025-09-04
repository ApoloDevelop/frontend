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
      const name = item.item.name.toLowerCase();
      const artistName = item.item.artistName?.toLowerCase() || "";
      const albumName = item.item.albumName?.toLowerCase() || "";
      const query = searchQuery.toLowerCase();
      
      return name.includes(query) || artistName.includes(query) || albumName.includes(query);
    });

    filtered.sort((a, b) => {
      const comparison = a.item.name.localeCompare(b.item.name);
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
      setList(prev => prev ? { ...prev, name: newName.trim() } : null);
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
      setList(prev => prev ? {
        ...prev,
        listItems: prev.listItems.filter(item => item.itemId !== itemId)
      } : null);
      toast.success(`"${itemName}" eliminado de la lista`);
    } catch (error) {
      console.error("Error al eliminar item:", error);
      toast.error("Error al eliminar el elemento");
    }
  };

  const handleAddItem = async (tag: TagDraft) => {
    try {
      // Intentar resolver el tag a un itemId
      const itemId = await ListService.resolveTagToItemId(tag);
      
      if (itemId) {
        await ListService.addItemToList(listId, itemId);
        toast.success(`"${tag.name}" añadido a la lista`);
        fetchListDetails(); // Recargar la lista
      } else {
        toast.error("No se pudo añadir el elemento a la lista");
      }
    } catch (error) {
      console.error("Error al añadir item:", error);
      toast.error("Error al añadir el elemento");
    }
    setTagPickerOpen(false);
  };

  const getTypeIcon = (type: ItemType) => {
    switch (type) {
      case "artist": return <User className="w-4 h-4" />;
      case "album": return <Disc3 className="w-4 h-4" />;
      case "track": return <Music className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: ItemType) => {
    switch (type) {
      case "artist": return "Artistas";
      case "album": return "Álbumes";
      case "track": return "Canciones";
    }
  };

  const formatItemInfo = (item: ListItem) => {
    const { name, artistName, albumName } = item.item;
    
    switch (list?.itemType) {
      case "artist":
        return name;
      case "album":
        return artistName ? `${name} - ${artistName}` : name;
      case "track":
        return `${name}${artistName ? ` - ${artistName}` : ""}${albumName ? ` (${albumName})` : ""}`;
      default:
        return name;
    }
  };

  if (!list && !loading) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
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
                  onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                  className="flex items-center gap-2"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  {sortOrder === "asc" ? "A-Z" : "Z-A"}
                </Button>
                <Button
                  onClick={() => setTagPickerOpen(true)}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Añadir
                </Button>
              </div>

              {/* Lista de elementos */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchQuery 
                      ? `No se encontraron elementos que coincidan con "${searchQuery}"`
                      : "Esta lista está vacía"
                    }
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <div
                      key={item.itemId}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium">{formatItemInfo(item)}</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.itemId, item.item.name)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>

              <div className="text-sm text-gray-500">
                {list.listItems.length} elemento{list.listItems.length !== 1 ? 's' : ''} en total
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
      />
    </>
  );
}
