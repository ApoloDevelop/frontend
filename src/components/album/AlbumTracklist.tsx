"use client";
import { slugify } from "@/utils/normalization";
import { msToMinSec } from "@/utils/seconds";
import { useRouter } from "next/navigation";

interface AlbumTracklistProps {
  albumSlug: string;
  tracks: any[];
}

export function AlbumTracklist({ albumSlug, tracks }: AlbumTracklistProps) {
  const router = useRouter();
  return (
    <section>
      <h2 className="mb-3 text-2xl font-semibold">Tracklist</h2>
      <ol className="divide-y rounded-xl border">
        {tracks.map((t: any, idx: number) => {
          const name = t?.name ?? t?.track?.name ?? "Untitled";
          const artists = (t?.artists ?? t?.track?.artists ?? []) as any[];
          const durationMs = t?.duration_ms ?? t?.track?.duration_ms ?? 0;

          const songSlug = slugify(name);
          const artistSlug = slugify(artists[0]?.name);

          return (
            <li
              key={t.id || `${name}-${idx}`}
              className="grid grid-cols-[32px_1fr_auto] items-center gap-4 px-3 py-2 hover:bg-black/5 cursor-pointer"
              onClick={() =>
                router.push(`/songs/${artistSlug}/${albumSlug}/${songSlug}`)
              }
            >
              <span className="text-sm tabular-nums text-muted-foreground">
                {idx + 1}
              </span>

              <div className="min-w-0">
                <div className="truncate font-medium hover:underline">
                  {name}
                </div>
                <div className="truncate text-sm text-muted-foreground">
                  {artists.map((a: any, i: number) => (
                    <span
                      key={a.id || `${a.name}-${i}`}
                      className="hover:underline"
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que el clic en el artista active el enlace principal
                        router.push(`/artists/${slugify(a.name)}`);
                      }}
                    >
                      {a.name}
                      {i < artists.length - 1 && ", "}
                    </span>
                  ))}
                </div>
              </div>

              <span className="text-sm tabular-nums text-muted-foreground">
                {msToMinSec(durationMs)}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
