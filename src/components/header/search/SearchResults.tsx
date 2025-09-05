import { SearchResultItem } from "./SearchResultItem";

interface SearchResultsProps {
  results: {
    artists: any[];
    albums: any[];
    tracks: any[];
    users: any[];
  };
  filters: {
    users: boolean;
    artists: boolean;
    albums: boolean;
    tracks: boolean;
  };
  loading: boolean;
  query: string;
  hasActiveFilters: boolean;
  onItemClick: () => void;
}

export function SearchResults({
  results,
  filters,
  loading,
  query,
  hasActiveFilters,
  onItemClick,
}: SearchResultsProps) {
  if (loading) {
    return <div className="px-2 py-3 text-sm text-gray-500">Buscando…</div>;
  }

  if (!hasActiveFilters && query.trim().length >= 2) {
    const hasAnyResults =
      results.users.length > 0 ||
      results.artists.length > 0 ||
      results.albums.length > 0 ||
      results.tracks.length > 0;

    return (
      <div className="px-2 py-3 text-sm text-gray-500">
        {hasAnyResults
          ? "Sin resultados con los filtros seleccionados"
          : "Sin resultados"}
      </div>
    );
  }

  return (
    <>
      {results.artists.length > 0 && filters.artists && (
        <section className="py-2">
          <div className="px-2 pb-1 text-xs font-semibold uppercase text-gray-500">
            Artistas
          </div>
          <ul className="max-h-64 overflow-y-auto">
            {results.artists.map((artist) => (
              <SearchResultItem
                key={artist.id}
                item={artist}
                type="artist"
                onItemClick={onItemClick}
              />
            ))}
          </ul>
        </section>
      )}

      {results.albums.length > 0 && filters.albums && (
        <section className="py-2">
          <div className="px-2 pb-1 text-xs font-semibold uppercase text-gray-500">
            Álbumes
          </div>
          <ul className="max-h-64 overflow-y-auto">
            {results.albums.map((album) => (
              <SearchResultItem
                key={album.id}
                item={album}
                type="album"
                onItemClick={onItemClick}
              />
            ))}
          </ul>
        </section>
      )}

      {results.tracks.length > 0 && filters.tracks && (
        <section className="py-2">
          <div className="px-2 pb-1 text-xs font-semibold uppercase text-gray-500">
            Canciones
          </div>
          <ul className="max-h-64 overflow-y-auto">
            {results.tracks.map((track) => (
              <SearchResultItem
                key={track.id}
                item={track}
                type="track"
                onItemClick={onItemClick}
              />
            ))}
          </ul>
        </section>
      )}

      {results.users.length > 0 && filters.users && (
        <section className="py-2">
          <div className="px-2 pb-1 text-xs font-semibold uppercase text-gray-500">
            Usuarios
          </div>
          <ul className="max-h-64 overflow-y-auto">
            {results.users.map((user) => (
              <SearchResultItem
                key={user.id}
                item={user}
                type="user"
                onItemClick={onItemClick}
              />
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
