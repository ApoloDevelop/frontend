import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown, Plus } from "lucide-react";

interface SearchAndControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOrder: "asc" | "desc";
  onToggleSort: () => void;
  onCreateList?: () => void;
  placeholder: string;
  showCreateButton?: boolean;
}

export function SearchAndControls({
  searchQuery,
  onSearchChange,
  sortOrder,
  onToggleSort,
  onCreateList,
  placeholder,
  showCreateButton = true,
}: SearchAndControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleSort}
        className="flex items-center gap-2"
      >
        <ArrowUpDown className="w-4 h-4" />
        {sortOrder === "asc" ? "A-Z" : "Z-A"}
      </Button>
      {showCreateButton && onCreateList && (
        <Button
          onClick={onCreateList}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva lista
        </Button>
      )}
    </div>
  );
}
