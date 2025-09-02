import { useMemo } from "react";

interface Track {
  duration_ms?: number;
  explicit?: boolean;
  album?: {
    release_date?: string;
    images?: Array<{ url: string }>;
  };
}

interface SongInfo {
  bpm?: number | null;
  key?: string | null;
  genres?: string[];
  label?: string | null;
  distributor?: string | null;
}

interface UseSongMetadataProps {
  track: Track;
  info: SongInfo;
}

export function useSongMetadata({ track, info }: UseSongMetadataProps) {
  const metadata = useMemo(() => {
    const cover = track.album?.images?.[0]?.url || "/default-cover.png";
    const durationMs = track.duration_ms ?? 0;
    const explicit = !!track.explicit;
    const albumRelease = track.album?.release_date ?? null;
    const bpm = info?.bpm ?? null;
    const key = info?.key ?? null;
    const genres = info?.genres ?? [];
    const label = info?.label ?? null;
    const distributor = info?.distributor ?? null;

    return {
      cover,
      durationMs,
      explicit,
      albumRelease,
      bpm,
      key,
      genres,
      label,
      distributor,
    };
  }, [track, info]);

  return metadata;
}
