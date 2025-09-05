import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { SearchAndControls } from "./SearchAndControls";
import { ListItem } from "./ListItem";
import { List } from "@/types/lists";
import { ItemType2 } from "@/types/items";

interface ListsTabProps {
  type: ItemType2;
  lists: List[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOrder: "asc" | "desc";
  onToggleSort: () => void;
  onCreateList: () => void;
  onListClick: (listId: number) => void;
  onDeleteList: (listId: number, listName: string) => void;
  getTabLabel: (type: string) => string;
}

export function ListsTab({
  type,
  lists,
  loading,
  searchQuery,
  onSearchChange,
  sortOrder,
  onToggleSort,
  onCreateList,
  onListClick,
  onDeleteList,
  getTabLabel,
}: ListsTabProps) {
  return (
    <TabsContent key={type} value={type} className="space-y-4">
      {/* Controles de búsqueda y ordenación */}
      <SearchAndControls
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        sortOrder={sortOrder}
        onToggleSort={onToggleSort}
        onCreateList={onCreateList}
        placeholder={`Buscar listas de ${getTabLabel(type).toLowerCase()}...`}
        showCreateButton={true}
      />

      {/* Lista de listas */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Cargando listas...
          </div>
        ) : lists.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchQuery
              ? `No se encontraron listas que coincidan con "${searchQuery}"`
              : `No tienes listas de ${getTabLabel(type).toLowerCase()} aún`}
          </div>
        ) : (
          lists.map((list) => (
            <ListItem
              key={list.id}
              list={list}
              onListClick={onListClick}
              onDeleteList={onDeleteList}
            />
          ))
        )}
      </div>
    </TabsContent>
  );
}
