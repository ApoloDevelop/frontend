import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { SearchAndControls } from "./SearchAndControls";
import { FavoriteItemComponent } from "./FavoriteItemComponent";
import { FavoriteItem } from "@/types/lists";
import { User, Disc3, Music, Heart } from "lucide-react";

interface FavoritesTabProps {
  favorites: FavoriteItem[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOrder: "asc" | "desc";
  onToggleSort: () => void;
  onRemoveFavorite: (item: FavoriteItem) => void;
  itemCovers: Record<number, string>;
}

export function FavoritesTab({
  favorites,
  loading,
  searchQuery,
  onSearchChange,
  sortOrder,
  onToggleSort,
  onRemoveFavorite,
  itemCovers,
}: FavoritesTabProps) {
  const getTabIcon = (type: string) => {
    switch (type) {
      case "artist":
        return <User className="w-4 h-4" />;
      case "album":
        return <Disc3 className="w-4 h-4" />;
      case "track":
        return <Music className="w-4 h-4" />;
      case "favorites":
        return <Heart className="w-4 h-4" />;
      default:
        return <Music className="w-4 h-4" />;
    }
  };

  return (
    <TabsContent value="favorites" className="space-y-4">
      {/* Controles de búsqueda y ordenación para favoritos */}
      <SearchAndControls
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        sortOrder={sortOrder}
        onToggleSort={onToggleSort}
        placeholder="Buscar favoritos..."
        showCreateButton={false}
      />

      {/* Lista de favoritos */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Cargando favoritos...
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchQuery
              ? `No se encontraron favoritos que coincidan con "${searchQuery}"`
              : "No tienes favoritos aún"}
          </div>
        ) : (
          favorites.map((favorite) => (
            <FavoriteItemComponent
              key={favorite.itemId}
              favorite={favorite}
              itemCovers={itemCovers}
              onRemoveFavorite={onRemoveFavorite}
              getTabIcon={getTabIcon}
            />
          ))
        )}
      </div>

      <div className="text-sm text-gray-500">
        {favorites.length} favorito
        {favorites.length !== 1 ? "s" : ""} en total
      </div>
    </TabsContent>
  );
}
