import { useMemo } from "react";

interface MediaItem {
  duration_ms?: number;
  explicit?: boolean;
  release_date?: string;
  images?: Array<{ url: string }>;
}

interface UseMediaMetadataProps {
  item: MediaItem;
  additionalGenres?: string[];
  defaultCover?: string;
}

export function useMediaMetadata({
  item,
  additionalGenres = [],
  defaultCover = "/default-cover.png",
}: UseMediaMetadataProps) {
  const metadata = useMemo(() => {
    const cover = item.images?.[0]?.url || defaultCover;
    const durationMs = item.duration_ms ?? 0;
    const explicit = !!item.explicit;
    const releaseDate = item.release_date ?? null;

    return {
      cover,
      durationMs,
      explicit,
      releaseDate,
      genres: additionalGenres,
    };
  }, [item, additionalGenres, defaultCover]);

  return metadata;
}
