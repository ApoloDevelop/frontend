import { useState, useEffect, useMemo } from "react";
import { SpotifyService } from "@/services/spotify.service";
import { useDebounced } from "./useDebounced";

export type SortOption = "relevance" | "popularity";

export type PageRes<T> = {
  href?: string;
  items: T[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
};

interface UseArtistSearchReturn {
  data: PageRes<any> | null;
  loading: boolean;
  offset: number;
  setOffset: (offset: number) => void;
  genreFilter: string;
  setGenreFilter: (genre: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
}

export function useArtistSearch(
  query: string,
  debounceDelay = 400
): UseArtistSearchReturn {
  const debouncedQuery = useDebounced(query, debounceDelay);

  const [rawData, setRawData] = useState<PageRes<any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [genreFilter, setGenreFilter] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");

  const debouncedGenre = useDebounced(genreFilter, debounceDelay);

  // Reset offset cuando cambia la query, género o ordenamiento
  useEffect(() => {
    setOffset(0);
  }, [debouncedQuery, debouncedGenre, sortBy]);

  // Ejecutar búsqueda
  useEffect(() => {
    let cancelled = false;

    async function executeSearch() {
      if (!debouncedQuery.trim()) {
        setRawData(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await SpotifyService.search(debouncedQuery, "artist", {
          limit: 50, // Obtenemos más resultados para filtrar mejor
          offset: 0, // Siempre comenzamos desde 0 para aplicar filtros
        });

        if (!cancelled) {
          setRawData(response);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Search error:", error);
          setRawData(null);
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

  // Procesar y filtrar los datos
  const processedData = useMemo(() => {
    if (!rawData) return null;

    let items = [...rawData.items];

    // Filtrar por género si está especificado
    let genreMatches: any[] = [];
    let otherResults: any[] = [];

    if (debouncedGenre.trim()) {
      const genreQuery = debouncedGenre.toLowerCase();

      items.forEach((artist) => {
        const genres = artist.genres || [];
        const hasMatchingGenre = genres.some((genre: string) =>
          genre.toLowerCase().includes(genreQuery)
        );

        if (hasMatchingGenre) {
          genreMatches.push(artist);
        } else if (genres.length === 0) {
          // Artistas sin género definido
          otherResults.push({ ...artist, _isNoGenre: true });
        }
      });

      // Ordenar cada grupo
      if (sortBy === "popularity") {
        genreMatches.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        otherResults.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      }

      // Combinar: primero los que coinciden con género, luego "otros resultados"
      items = [...genreMatches, ...otherResults];
    } else {
      // Sin filtro de género, solo ordenar
      if (sortBy === "popularity") {
        items.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      }
    }

    // Aplicar paginación
    const limit = 12;
    const start = offset;
    const end = start + limit;
    const paginatedItems = items.slice(start, end);

    return {
      ...rawData,
      items: paginatedItems,
      total: items.length,
      offset: offset,
      limit: limit,
      next: end < items.length ? "next" : null,
      previous: start > 0 ? "previous" : null,
      _genreMatches: genreMatches.length,
      _otherResults: otherResults.length,
    };
  }, [rawData, debouncedGenre, sortBy, offset]);

  return {
    data: processedData,
    loading,
    offset,
    setOffset,
    genreFilter,
    setGenreFilter,
    sortBy,
    setSortBy,
  };
}
