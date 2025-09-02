import { useState } from "react";
import { Kind } from "./useSearch";

interface SearchQueries {
  artist: string;
  album: string;
  track: string;
}

interface UseTabSearchReturn {
  queries: SearchQueries;
  updateQuery: (type: Kind, value: string) => void;
  getQueryForType: (type: Kind) => string;
}

/**
 * Hook para manejar las queries de búsqueda por pestañas
 * @returns Estado de las queries y funciones para actualizarlas
 */
export function useTabSearch(): UseTabSearchReturn {
  const [queries, setQueries] = useState<SearchQueries>({
    artist: "",
    album: "",
    track: "",
  });

  const updateQuery = (type: Kind, value: string) => {
    setQueries((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const getQueryForType = (type: Kind): string => {
    return queries[type];
  };

  return {
    queries,
    updateQuery,
    getQueryForType,
  };
}
