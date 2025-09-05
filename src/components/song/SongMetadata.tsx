import { msToMinSec } from "@/utils/seconds";

interface SongMetadataProps {
  durationMs: number;
  albumRelease: string | null;
  genres: string[];
  explicit: boolean;
}

export function SongMetadata({
  durationMs,
  albumRelease,
  genres,
  explicit,
}: SongMetadataProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-muted-foreground">
      <span>{msToMinSec(durationMs)}</span>
      <span aria-hidden>•</span>
      <time dateTime={albumRelease || ""}>
        {albumRelease ? new Date(albumRelease).toLocaleDateString() : ""}
      </time>
      {!!genres.length && (
        <>
          <span aria-hidden>•</span>
          <span className="capitalize">{genres[0]}</span>
        </>
      )}
      {explicit && (
        <>
          <span aria-hidden>•</span>
          <span
            className="inline-flex items-center rounded-md bg-black/5 px-2 py-0.5 cursor-pointer"
            title="Contenido explícito"
          >
            E
          </span>
        </>
      )}
    </div>
  );
}
