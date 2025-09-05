import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, ArrowUpDown } from "lucide-react";

interface ListControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  onAddItem: () => void;
  addingItem: boolean;
}

export function ListControls({
  searchQuery,
  setSearchQuery,
  sortOrder,
  setSortOrder,
  onAddItem,
  addingItem,
}: ListControlsProps) {
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar en la lista..."
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
        onClick={onAddItem}
        size="sm"
        className="flex items-center gap-2"
        disabled={addingItem}
      >
        <Plus className="w-4 h-4" />
        {addingItem ? "Añadiendo..." : "Añadir"}
      </Button>
    </div>
  );
}
