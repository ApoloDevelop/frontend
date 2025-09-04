import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortOption } from "@/hooks/explore/useArtistSearch";
import { X } from "lucide-react";

interface ArtistFiltersProps {
  genreFilter: string;
  onGenreFilterChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}

export default function ArtistFilters({
  genreFilter,
  onGenreFilterChange,
  sortBy,
  onSortChange,
}: ArtistFiltersProps) {
  const handleClearGenre = () => {
    onGenreFilterChange("");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 rounded-lg border">
      {/* Filtro por género */}
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Filtrar por género
        </label>
        <div className="relative">
          <Input
            value={genreFilter}
            onChange={(e) => onGenreFilterChange(e.target.value)}
            placeholder="Ej: rock, pop, jazz..."
            className="pr-8"
          />
          {genreFilter && (
            <button
              onClick={handleClearGenre}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Limpiar filtro de género"
              type="button"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Ordenamiento */}
      <div className="sm:w-48">
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Ordenar por
        </label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevancia</SelectItem>
            <SelectItem value="popularity">Popularidad</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
