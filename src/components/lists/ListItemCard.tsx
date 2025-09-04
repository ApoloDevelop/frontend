import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, User, Disc3 } from "lucide-react";
import Image from "next/image";
import { ListItem } from "@/types/lists";
import { ItemType2 } from "@/types/items";
import { getTypeIcon } from "@/utils/listItemUtils";

interface ListItemCardProps {
  item: ListItem;
  itemType: ItemType2;
  coverUrl: string;
  onRemove: (itemId: number, itemName: string) => void;
}

export function ListItemCard({
  item,
  itemType,
  coverUrl,
  onRemove,
}: ListItemCardProps) {
  const handleRemove = () => {
    onRemove(item.itemId, item.item?.name || "elemento");
  };

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50/80 transition-all duration-200 hover:shadow-sm">
      {/* Cover del item */}
      <div className="relative w-20 h-20 shrink-0">
        <Image
          src={coverUrl}
          alt={item.item?.name || "Cover"}
          fill
          className="object-cover rounded-lg shadow-sm"
          sizes="80px"
        />
      </div>

      {/* Información del item */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          {getTypeIcon(itemType)}
          <span className="uppercase text-xs font-medium text-muted-foreground tracking-wide">
            {itemType}
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
        onClick={handleRemove}
        className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0 opacity-70 hover:opacity-100 transition-opacity"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
