import { useUserSearch } from "@/hooks/explore/useUserSearch";
import UserSearchGrid from "./UserSearchGrid";
import SearchResultsSkeleton from "../skeletons/SearchResultsSkeleton";

interface UserSearchResultsProps {
  query: string;
}

export default function UserSearchResults({ query }: UserSearchResultsProps) {
  const { data, loading } = useUserSearch(query);

  // Mostrar skeleton mientras carga y hay query
  if (loading && query.trim() && !data?.length) {
    return <SearchResultsSkeleton count={12} />;
  }

  return <UserSearchGrid users={data ?? []} loading={loading} />;
}
