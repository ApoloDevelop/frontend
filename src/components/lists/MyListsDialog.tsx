"use client";

import React, { useState, useEffect } from "react";
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
import { FavoriteService } from "@/services/favorites.service";
import { SpotifyService } from "@/services/spotify.service";
import { toast } from "sonner";
import {
  Trash2,
  Plus,
  Search,
  ArrowUpDown,
  Music,
  User,
  Disc3,
  Heart,
} from "lucide-react";
import { ListDetailDialog } from "./ListDetailDialog";
import { CreateListDialog } from "./CreateListDialog";
import Image from "next/image";

type ItemType = "artist" | "album" | "track";
type TabType = ItemType | "favorites";

interface List {
  id: number;
  name: string;
  itemType?: ItemType;
  createdAt?: string;
  listItems?: Array<{ itemId: number }>;
}

interface FavoriteItem {
  itemId: number;
  type: ItemType;
  item: {
    id: number;
    name: string;
    artistName?: string;
    albumName?: string;
  };
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
  const [activeTab, setActiveTab] = useState<TabType>("artist");
  const [lists, setLists] = useState<List[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [filteredLists, setFilteredLists] = useState<List[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [itemCovers, setItemCovers] = useState<Record<number, string>>({});

  // Estados para modales
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState(""); 
  
  // Cargar listas cuando se abre el modal o cambia el tab
  useEffect(() => {
    if (open) {
      if (activeTab === "favorites") {
        fetchFavorites();
      } else {
        fetchLists(activeTab);
      }
    }
  }, [open, activeTab]);

  // Filtrar y ordenar listas y favoritos
  useEffect(() => {
    if (activeTab === "favorites") {
      let filtered = favorites.filter((favorite) =>
        favorite.item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (favorite.item.artistName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (favorite.item.albumName?.toLowerCase() || "").includes(searchQuery.toLowerCase())
      );

      filtered.sort((a, b) => {
        const comparison = a.item.name.localeCompare(b.item.name);
        return sortOrder === "asc" ? comparison : -comparison;
      });

      setFilteredFavorites(filtered);
    } else {
      let filtered = lists.filter((list) =>
        list.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      filtered.sort((a, b) => {
        const comparison = a.name.localeCompare(b.name);
        return sortOrder === "asc" ? comparison : -comparison;
      });

      setFilteredLists(filtered);
    }
  }, [lists, favorites, searchQuery, sortOrder, activeTab]);

  // Función para obtener el cover de un item
  const getCoverForItem = async (
    item: FavoriteItem,
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

  // Cargar covers para favoritos
  const loadCoversForFavorites = async (items: FavoriteItem[]) => {
    const newCovers: Record<number, string> = {};

    await Promise.all(
      items.map(async (item) => {
        const itemKey = item.item?.id || item.itemId;

        if (!itemCovers[itemKey]) {
          const cover = await getCoverForItem(item, item.type);
          newCovers[itemKey] = cover;
        }
      })
    );

    if (Object.keys(newCovers).length > 0) {
      setItemCovers((prev) => ({ ...prev, ...newCovers }));
    }
  };

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const fetchedFavorites = await FavoriteService.getAllUserFavorites();
      setFavorites(fetchedFavorites);
      
      // Cargar covers para los favoritos
      if (fetchedFavorites.length > 0) {
        await loadCoversForFavorites(fetchedFavorites);
      }
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
      toast.error("Error al cargar los favoritos");
    } finally {
      setLoading(false);
    }
  };

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
      if (activeTab === "favorites") return false; // No crear listas en favoritos
      const newList = await ListService.createList(listName, activeTab as ItemType);
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

  const handleRemoveFavorite = async (item: FavoriteItem) => {
    try {
      await FavoriteService.removeFavorite({
        type: item.type,
        name: item.item.name,
        artistName: item.item.artistName,
      });
      setFavorites((prev) => prev.filter((fav) => fav.itemId !== item.itemId));
      toast.success(`"${item.item.name}" eliminado de favoritos`);
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
      toast.error("Error al eliminar el favorito");
    }
  };

  const handleListClick = (listId: number) => {
    setSelectedListId(listId);
    setDetailDialogOpen(true);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const getTabIcon = (type: TabType) => {
    switch (type) {
      case "artist":
        return <User className="w-4 h-4" />;
      case "album":
        return <Disc3 className="w-4 h-4" />;
      case "track":
        return <Music className="w-4 h-4" />;
      case "favorites":
        return <Heart className="w-4 h-4" />;
    }
  };

  const getTabLabel = (type: TabType) => {
    switch (type) {
      case "artist":
        return "Artistas";
      case "album":
        return "Álbumes";
      case "track":
        return "Canciones";
      case "favorites":
        return "Favoritos";
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
            onValueChange={(value) => setActiveTab(value as TabType)}
          >
            <TabsList className="grid w-full grid-cols-4">
              {(["artist", "album", "track", "favorites"] as TabType[]).map((type) => (
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

            {/* Tab de Favoritos */}
            <TabsContent value="favorites" className="space-y-4">
              {/* Controles de búsqueda y ordenación para favoritos */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar favoritos..."
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
              </div>

              {/* Lista de favoritos */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    Cargando favoritos...
                  </div>
                ) : filteredFavorites.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchQuery
                      ? `No se encontraron favoritos que coincidan con "${searchQuery}"`
                      : "No tienes favoritos aún"}
                  </div>
                ) : (
                  filteredFavorites.map((favorite) => (
                    <div
                      key={favorite.itemId}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50/80 transition-all duration-200 hover:shadow-sm"
                    >
                      {/* Cover del item */}
                      <div className="relative w-20 h-20 shrink-0">
                        {(() => {
                          const coverKey = favorite.item?.id || favorite.itemId;
                          const coverUrl =
                            itemCovers[coverKey] || "/default-cover.png";
                          return (
                            <Image
                              src={coverUrl}
                              alt={favorite.item?.name || "Cover"}
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
                          {getTabIcon(favorite.type)}
                          <span className="uppercase text-xs font-medium text-muted-foreground tracking-wide">
                            {favorite.type}
                          </span>
                        </div>
                        <h3 className="font-semibold text-base mb-2 line-clamp-1 text-gray-900">
                          {favorite.item?.name || "Sin nombre"}
                        </h3>
                        {favorite.item?.artistName && (
                          <p className="text-muted-foreground text-sm line-clamp-1 mb-1 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{favorite.item.artistName}</span>
                          </p>
                        )}
                        {favorite.item?.albumName && (
                          <p className="text-muted-foreground text-sm line-clamp-1 flex items-center gap-1">
                            <Disc3 className="w-3 h-3" />
                            <span>{favorite.item.albumName}</span>
                          </p>
                        )}
                      </div>

                      {/* Botón eliminar */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFavorite(favorite)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>

              <div className="text-sm text-gray-500">
                {favorites.length} favorito
                {favorites.length !== 1 ? "s" : ""} en total
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Modal de detalle de lista */}
      {selectedListId && (
        <ListDetailDialog
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          listId={selectedListId}
          onListUpdated={() => {
            if (activeTab === "favorites") {
              fetchFavorites();
            } else {
              fetchLists(activeTab as ItemType);
            }
          }}
        />
      )}

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
