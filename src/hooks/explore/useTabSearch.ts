import { useState } from "react";
import { Kind } from "./useSearch";

export type TabKind = Kind | "user";

interface SearchQueries {
  artist: string;
  album: string;
  track: string;
  user: string;
}

interface UseTabSearchReturn {
  queries: SearchQueries;
  updateQuery: (type: TabKind, value: string) => void;
  getQueryForType: (type: TabKind) => string;
}

export function useTabSearch(): UseTabSearchReturn {
  const [queries, setQueries] = useState<SearchQueries>({
    artist: "",
    album: "",
    track: "",
    user: "",
  });

  const updateQuery = (type: TabKind, value: string) => {
    setQueries((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const getQueryForType = (type: TabKind): string => {
    return queries[type];
  };

  return {
    queries,
    updateQuery,
    getQueryForType,
  };
}
