import Link from "next/link";
import { slugify } from "@/utils/normalization";
import { InfoBadge } from "@/components/ui/InfoBadge";

interface Artist {
  id?: string;
  name: string;
}

interface SongHeaderProps {
  artists: Artist[];
  albumRelease: string | null;
  genres: string[];
  bpm: number | null;
  musicKey: string | null;
}

export function SongHeader({
  artists,
  albumRelease,
  genres,
  bpm,
  musicKey,
}: SongHeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-1">
        <p className="text-lg">
          <span className="font-semibold">Artista/s:</span>{" "}
          {artists?.map((a: Artist, i: number) => (
            <span key={a.id || a.name}>
              <Link
                href={`/artists/${slugify(a.name)}`}
                className="text-purple-600 hover:underline"
                scroll
              >
                {a.name}
              </Link>
              {i < artists.length - 1 && ", "}
            </span>
          ))}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Fecha de salida:</span>{" "}
          <time dateTime={albumRelease || ""}>
            {albumRelease ? new Date(albumRelease).toLocaleDateString() : ""}
          </time>
        </p>
        {!!genres.length && (
          <p className="text-lg">
            <span className="font-semibold">Género/s:</span>{" "}
            <span className="capitalize">{genres.join(", ")}</span>
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <InfoBadge label="BPM" value={bpm} variant="purple" />
        <InfoBadge label="Key" value={musicKey} variant="gray" />
      </div>
    </header>
  );
}
