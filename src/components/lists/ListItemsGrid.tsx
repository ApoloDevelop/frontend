import React from "react";
import { ListItem } from "@/types/lists";
import { ItemType2 } from "@/types/items";
import { ListItemCard } from "./ListItemCard";

interface ListItemsGridProps {
  items: ListItem[];
  itemType: ItemType2;
  searchQuery: string;
  getCoverUrl: (item: ListItem) => string;
  onRemoveItem: (itemId: number, itemName: string) => void;
}

export function ListItemsGrid({
  items,
  itemType,
  searchQuery,
  getCoverUrl,
  onRemoveItem,
}: ListItemsGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {searchQuery
          ? `No se encontraron elementos que coincidan con "${searchQuery}"`
          : "Esta lista está vacía"}
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto">
      {items.map((item) => (
        <ListItemCard
          key={item.itemId}
          item={item}
          itemType={itemType}
          coverUrl={getCoverUrl(item)}
          onRemove={onRemoveItem}
        />
      ))}
    </div>
  );
}
