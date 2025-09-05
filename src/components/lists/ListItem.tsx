import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { List } from "@/types/lists";

interface ListItemProps {
  list: List;
  onListClick: (listId: number) => void;
  onDeleteList: (listId: number, listName: string) => void;
}

export function ListItem({ list, onListClick, onDeleteList }: ListItemProps) {
  return (
    <div
      key={list.id}
      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
      onClick={() => onListClick(list.id)}
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
          onDeleteList(list.id, list.name);
        }}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
