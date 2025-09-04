import { useState, useEffect } from "react";
import { UserService } from "@/services/user.service";
import { useDebounced } from "./useDebounced";

interface UseUserSearchReturn {
  data: any[] | null;
  loading: boolean;
}

/**
 * Hook para buscar usuarios
 */
export function useUserSearch(query: string): UseUserSearchReturn {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounced(query, 500);

  useEffect(() => {
    let cancelled = false;

    async function executeSearch() {
      if (!debouncedQuery.trim()) {
        setData(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await UserService.searchUsers(debouncedQuery, 20);

        if (!cancelled) {
          setData(response);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("User search error:", error);
          setData(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    executeSearch();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  return {
    data,
    loading,
  };
}
