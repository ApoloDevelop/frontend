interface SearchFiltersProps {
  filters: {
    users: boolean;
    artists: boolean;
    albums: boolean;
    tracks: boolean;
  };
  results: {
    users: any[];
    artists: any[];
    albums: any[];
    tracks: any[];
  };
  onToggleFilter: (filterKey: keyof SearchFiltersProps["filters"]) => void;
  onToggleAllFilters: () => void;
}

export function SearchFilters({
  filters,
  results,
  onToggleFilter,
  onToggleAllFilters,
}: SearchFiltersProps) {
  const filterOptions = [
    {
      key: "artists" as const,
      label: "Artistas",
      count: results.artists.length,
    },
    {
      key: "albums" as const,
      label: "Álbumes",
      count: results.albums.length,
    },
    {
      key: "tracks" as const,
      label: "Canciones",
      count: results.tracks.length,
    },
    {
      key: "users" as const,
      label: "Usuarios",
      count: results.users.length,
    },
  ];

  return (
    <div className="px-2 py-3 border-b border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-semibold uppercase text-gray-500">
          Filtros
        </div>
        <button
          onClick={onToggleAllFilters}
          className="text-xs text-purple-600 hover:text-purple-800 underline cursor-pointer"
        >
          {Object.values(filters).every(Boolean)
            ? "Deseleccionar todo"
            : "Seleccionar todo"}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {filterOptions.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => onToggleFilter(key)}
            className={`cursor-pointer px-3 py-1 text-xs rounded-full border transition-colors hover:bg-purple-300 ${
              filters[key]
                ? "bg-purple-100 border-purple-300 text-purple-700"
                : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label} {count > 0 && `(${count})`}
          </button>
        ))}
      </div>
    </div>
  );
}
