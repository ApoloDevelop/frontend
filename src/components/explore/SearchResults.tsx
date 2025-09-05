import { useSearch, Kind } from "@/hooks/explore/useSearch";
import SearchGrid from "./SearchGrid";
import SearchResultsSkeleton from "../skeletons/SearchResultsSkeleton";

interface SearchResultsProps {
  query: string;
  type: Kind;
}

export default function SearchResults({ query, type }: SearchResultsProps) {
  const { data, loading, setOffset } = useSearch(query, type);

  if (loading && query.trim() && !data?.items?.length) {
    return <SearchResultsSkeleton count={12} />;
  }

  return (
    <SearchGrid
      items={data?.items ?? []}
      type={type}
      data={data}
      loading={loading}
      setOffset={setOffset}
    />
  );
}
