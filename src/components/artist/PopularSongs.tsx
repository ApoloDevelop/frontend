"use client";

import { slugify } from "@/utils/normalization";
import Image from "next/image";
import Link from "next/link";

interface PopularSongsProps {
  topTracks: Array<{
    id: string;
    name: string;
    album?: {
      name: string;
      images: Array<{ url: string }>;
    };
    artists: Array<{ name: string }>;
  }>;
}

export const PopularSongs: React.FC<PopularSongsProps> = ({ topTracks }) => {
  return (
    <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-4">Canciones populares</h2>
      {topTracks.length ? (
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          {topTracks.map((track) => {
            const artistSlug = slugify(track.artists[0]?.name || "unknown");
            const albumSlug = slugify(track.album?.name || "unknown");
            const songSlug = slugify(track.name);

            return (
              <li key={track.id} className="flex items-center gap-3">
                <Link
                  href={`/songs/${artistSlug}/${albumSlug}/${songSlug}`}
                  className="flex items-center gap-3 group hover:bg-gray-100 px-1 rounded transition hover:scale-105"
                >
                  <Image
                    src={track.album?.images[0]?.url || "/default-cover.png"}
                    alt={track.name}
                    width={40}
                    height={40}
                    className="rounded"
                  />
                  <span className="group-hover:text-purple-600 transition-colors">
                    {track.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="text-gray-500">No disponible.</p>
      )}
    </section>
  );
};
