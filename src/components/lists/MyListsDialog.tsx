"use client";

import React, { useState, useEffect } from "react"; // Estados para modales
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListService } from "@/services/lists.service";
import { toast } from "sonner";
import {
  Trash2,
  Plus,
  Search,
  ArrowUpDown,
  Music,
  User,
  Disc3,
} from "lucide-react";
// // import { ListDetailDialog } from "./ListDetailDialog";
import { CreateListDialog } from "./CreateListDialog";

type ItemType = "artist" | "album" | "track";

interface List {
  id: number;
  name: string;
  itemType?: ItemType;
  createdAt?: string;
  listItems?: Array<{ itemId: number }>;
}

interface MyListsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number;
}

export function MyListsDialog({
  open,
  onOpenChange,
  userId,
}: MyListsDialogProps) {
  const [activeTab, setActiveTab] = useState<ItemType>("artist");
  const [lists, setLists] = useState<List[]>([]);
  const [filteredLists, setFilteredLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Estados para modales
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState(""); // Cargar listas cuando se abre el modal o cambia el tab
  useEffect(() => {
    if (open) {
      fetchLists(activeTab);
    }
  }, [open, activeTab]);

  // Filtrar y ordenar listas
  useEffect(() => {
    let filtered = lists.filter((list) =>
      list.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredLists(filtered);
  }, [lists, searchQuery, sortOrder]);

  const fetchLists = async (itemType: ItemType) => {
    setLoading(true);
    try {
      const fetchedLists = await ListService.getUserLists(itemType);
      // Normalizar las listas agregando propiedades que faltan
      const normalizedLists = fetchedLists.map((list: any) => ({
        ...list,
        listItems: list.listItems || [],
        createdAt: list.createdAt || new Date().toISOString(),
      }));
      setLists(normalizedLists);
    } catch (error) {
      console.error("Error al cargar listas:", error);
      toast.error("Error al cargar las listas");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteList = async (listId: number, listName: string) => {
    try {
      await ListService.deleteList(listId);
      setLists((prev) => prev.filter((list) => list.id !== listId));
      toast.success(`Lista "${listName}" eliminada`);
    } catch (error) {
      console.error("Error al eliminar lista:", error);
      toast.error("Error al eliminar la lista");
    }
  };

  const handleCreateList = async (listName: string): Promise<boolean> => {
    try {
      const newList = await ListService.createList(listName, activeTab);
      setLists((prev) => [
        ...prev,
        { ...newList, listItems: [], createdAt: new Date().toISOString() },
      ]);
      toast.success(`Lista "${listName}" creada`);
      return true;
    } catch (error) {
      console.error("Error al crear lista:", error);
      toast.error("Error al crear la lista");
      return false;
    }
  };

  const handleListClick = (listId: number) => {
    // setSelectedListId(listId);
    // setDetailDialogOpen(true);
    console.log("Lista clickeada:", listId);
    toast.info("Funcionalidad de detalle de lista en desarrollo");
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const getTabIcon = (type: ItemType) => {
    switch (type) {
      case "artist":
        return <User className="w-4 h-4" />;
      case "album":
        return <Disc3 className="w-4 h-4" />;
      case "track":
        return <Music className="w-4 h-4" />;
    }
  };

  const getTabLabel = (type: ItemType) => {
    switch (type) {
      case "artist":
        return "Artistas";
      case "album":
        return "Álbumes";
      case "track":
        return "Canciones";
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Mis Listas</DialogTitle>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as ItemType)}
          >
            <TabsList className="grid w-full grid-cols-3">
              {(["artist", "album", "track"] as ItemType[]).map((type) => (
                <TabsTrigger
                  key={type}
                  value={type}
                  className="flex items-center gap-2"
                >
                  {getTabIcon(type)}
                  {getTabLabel(type)}
                </TabsTrigger>
              ))}
            </TabsList>

            {(["artist", "album", "track"] as ItemType[]).map((type) => (
              <TabsContent key={type} value={type} className="space-y-4">
                {/* Controles de búsqueda y ordenación */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder={`Buscar listas de ${getTabLabel(
                        type
                      ).toLowerCase()}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleSortOrder}
                    className="flex items-center gap-2"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    {sortOrder === "asc" ? "A-Z" : "Z-A"}
                  </Button>
                  <Button
                    onClick={() => setCreateDialogOpen(true)}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Nueva lista
                  </Button>
                </div>

                {/* Lista de listas */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">
                      Cargando listas...
                    </div>
                  ) : filteredLists.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {searchQuery
                        ? `No se encontraron listas que coincidan con "${searchQuery}"`
                        : `No tienes listas de ${getTabLabel(
                            type
                          ).toLowerCase()} aún`}
                    </div>
                  ) : (
                    filteredLists.map((list) => (
                      <div
                        key={list.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleListClick(list.id)}
                      >
                        <div className="flex-1">
                          <h3 className="font-medium">{list.name}</h3>
                          <p className="text-sm text-gray-500">
                            {list.listItems?.length || 0} elemento
                            {(list.listItems?.length || 0) !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteList(list.id, list.name);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Modal de detalle de lista */}
      {/*selectedListId && (
        <ListDetailDialog
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          listId={selectedListId}
          onListUpdated={() => fetchLists(activeTab)}
        />
      )*/}

      {/* Modal de crear lista */}
      <CreateListDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        newListName={newListName}
        setNewListName={setNewListName}
        onCreateList={handleCreateList}
        loading={false}
      />
    </>
  );
}
