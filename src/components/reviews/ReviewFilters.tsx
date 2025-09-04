import { X as XIcon } from "lucide-react";
import { SortMode } from "@/types/reviews";

interface ReviewFiltersProps {
  filterScore: number | null;
  sortMode: SortMode;
  onFilterClear: () => void;
  onSortChange: (mode: SortMode) => void;
}

export function ReviewFilters({
  filterScore,
  sortMode,
  onFilterClear,
  onSortChange,
}: ReviewFiltersProps) {
  return (
    <div className="shrink-0 mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div>
        {filterScore != null && (
          <span className="inline-flex items-center gap-2 text-sm rounded-full border px-3 py-1">
            Filtrando por puntuación: <strong>{filterScore}</strong>
            <button
              className="p-1 rounded hover:bg-gray-100"
              onClick={onFilterClear}
              aria-label="Quitar filtro"
              title="Quitar filtro"
            >
              <XIcon className="h-4 w-4 cursor-pointer hover:text-red-600" />
            </button>
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm">
        <label
          htmlFor="order"
          className="text-muted-foreground whitespace-nowrap"
        >
          Orden:
        </label>
        <select
          id="order"
          value={sortMode}
          onChange={(e) => onSortChange(e.target.value as SortMode)}
          className="rounded-md border px-1 py-1.5 bg-white hover:bg-gray-50 min-w-0 flex-shrink"
        >
          <option value="recent_desc">Más recientes primero</option>
          <option value="recent_asc">Más antiguas primero</option>
          <option value="up_desc">Mejor valoradas primero</option>
          <option value="up_asc">Peor valoradas primero</option>
        </select>
      </div>
    </div>
  );
}
