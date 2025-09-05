import { TabsContent } from "@/components/ui/tabs";
import SearchInput from "./SearchInput";
import ArtistFilters from "./ArtistFilters";
import ArtistSearchGrid from "./ArtistSearchGrid";
import { useArtistSearch } from "@/hooks/explore/useArtistSearch";
import SearchResultsSkeleton from "../skeletons/SearchResultsSkeleton";

interface ArtistSearchTabProps {
  value: string;
  onValueChange: (value: string) => void;
}

export default function ArtistSearchTab({
  value,
  onValueChange,
}: ArtistSearchTabProps) {
  const {
    data,
    loading,
    offset,
    setOffset,
    genreFilter,
    setGenreFilter,
    sortBy,
    setSortBy,
  } = useArtistSearch(value);

  if (loading && value.trim() && !data?.items?.length) {
    return (
      <TabsContent value="artist" className="mt-4 space-y-4">
        <SearchInput value={value} onChange={onValueChange} type="artist" />
        <ArtistFilters
          genreFilter={genreFilter}
          onGenreFilterChange={setGenreFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        <SearchResultsSkeleton count={12} />
      </TabsContent>
    );
  }

  return (
    <TabsContent value="artist" className="mt-4 space-y-4">
      <SearchInput value={value} onChange={onValueChange} type="artist" />

      {/* Mostrar filtros solo si hay una búsqueda activa */}
      {value.trim() && (
        <ArtistFilters
          genreFilter={genreFilter}
          onGenreFilterChange={setGenreFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      )}

      <ArtistSearchGrid
        items={data?.items ?? []}
        data={data}
        loading={loading}
        setOffset={setOffset}
        genreFilter={genreFilter}
      />
    </TabsContent>
  );
}
