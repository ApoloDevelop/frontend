import { useState } from "react";

interface SearchFilters {
  users: boolean;
  artists: boolean;
  albums: boolean;
  tracks: boolean;
}

export function useSearchFilters(
  initialFilters: SearchFilters = {
    users: true,
    artists: true,
    albums: true,
    tracks: true,
  }
) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  const toggleFilter = (filterKey: keyof SearchFilters) => {
    setFilters((prev) => ({ ...prev, [filterKey]: !prev[filterKey] }));
  };

  const toggleAllFilters = () => {
    const allActive = Object.values(filters).every(Boolean);
    const newState = !allActive;
    setFilters({
      users: newState,
      artists: newState,
      albums: newState,
      tracks: newState,
    });
  };

  const hasActiveFilters = (results: {
    users: any[];
    artists: any[];
    albums: any[];
    tracks: any[];
  }) => {
    return (
      (results.users.length > 0 && filters.users) ||
      (results.artists.length > 0 && filters.artists) ||
      (results.albums.length > 0 && filters.albums) ||
      (results.tracks.length > 0 && filters.tracks)
    );
  };

  return {
    filters,
    toggleFilter,
    toggleAllFilters,
    hasActiveFilters,
  };
}
