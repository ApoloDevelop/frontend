"use client";

import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/utils/normalization";
import { TrackLite } from "@/types/charts";

type Props = {
  track: TrackLite;
  index: number;
};

export default function TrackRow({ track, index }: Props) {
  const coverOf = (track: TrackLite) => {
    const imgs = track.album?.images ?? [];
    return imgs[2]?.url || imgs[1]?.url || imgs[0]?.url || "/default-cover.png";
  };

  const songHref = (t: TrackLite) => {
    const artistName = t.artists?.[0]?.name || "artista";
    const albumName = t.album?.name || "album";
    return `/songs/${slugify(artistName)}/${slugify(albumName)}/${slugify(
      t.name
    )}`;
  };

  const artistHref = (name: string) => `/artists/${slugify(name)}`;

  return (
    <div className="flex items-center gap-3 py-2 px-2 rounded hover:bg-black/5 transition">
      <span className="w-6 text-sm tabular-nums text-gray-500">{index}</span>

      <div className="relative w-12 h-12 shrink-0">
        <Image
          src={coverOf(track)}
          alt={track.name}
          fill
          className="object-cover rounded"
          sizes="48px"
        />
      </div>

      <div className="min-w-0">
        <Link
          href={songHref(track)}
          className="block font-medium truncate hover:underline"
        >
          {track.name}
        </Link>
        <div className="text-sm text-gray-600 truncate">
          {track.artists.map((a, i) => (
            <span key={`${a.name}-${i}`}>
              <Link href={artistHref(a.name)} className="hover:underline">
                {a.name}
              </Link>
              {i < track.artists.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
