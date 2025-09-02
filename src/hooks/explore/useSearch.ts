import { useState, useEffect } from "react";
import { SpotifyService } from "@/services/spotify.service";
import { useDebounced } from "./useDebounced";

export type Kind = "artist" | "album" | "track";

export type PageRes<T> = {
  href?: string;
  items: T[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
};

interface UseSearchReturn {
  data: PageRes<any> | null;
  loading: boolean;
  offset: number;
  setOffset: (offset: number) => void;
}

/**
 * Hook para manejar búsquedas con Spotify API
 * @param query - Término de búsqueda
 * @param type - Tipo de búsqueda (artist, album, track)
 * @param debounceDelay - Retraso para debounce (default: 400ms)
 * @returns Estado de la búsqueda y funciones de control
 */
export function useSearch(
  query: string,
  type: Kind,
  debounceDelay = 400
): UseSearchReturn {
  const debouncedQuery = useDebounced(query, debounceDelay);
  const [data, setData] = useState<PageRes<any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  // Reset offset cuando cambia la query o el tipo
  useEffect(() => {
    setOffset(0);
  }, [debouncedQuery, type]);

  // Ejecutar búsqueda
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
        const response = await SpotifyService.search(debouncedQuery, type, {
          limit: 12,
          offset,
        });

        if (!cancelled) {
          setData(response);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Search error:", error);
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
  }, [debouncedQuery, type, offset]);

  return {
    data,
    loading,
    offset,
    setOffset,
  };
}
