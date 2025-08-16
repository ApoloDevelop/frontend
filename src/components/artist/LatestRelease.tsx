"use client";

import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { slugify } from "@/helpers/normalization";

interface LatestReleaseProps {
  release: {
    name: string;
    release_date: string;
    album_group: string; // Puede ser "single" o "album"
    images: Array<{ url: string }>;
    artists: Array<{ name: string }>; // Información del artista
  } | null;
}

export const LatestRelease: React.FC<LatestReleaseProps> = ({ release }) => {
  if (!release) {
    return (
      <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-3xl font-bold mb-4">Último lanzamiento</h2>
        <p className="text-gray-500">No disponible.</p>
      </section>
    );
  }
  console.log(release);

  const isSingle = release.album_group === "single";
  const artistSlug = slugify(release.artists[0]?.name);
  const albumSlug = slugify(release.name);
  const songSlug = slugify(release.name);

  const href = isSingle
    ? `/songs/${artistSlug}/${albumSlug}/${songSlug}`
    : `/albums/${artistSlug}/${albumSlug}`;

  return (
    <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-4">Último lanzamiento</h2>
      <Link href={href} scroll>
        <div className="flex items-center gap-4 cursor-pointer group transition-transform duration-200 hover:scale-105">
          <Image
            src={release.images[0]?.url || "/default-cover.png"}
            alt={release.name}
            width={64}
            height={64}
            className="rounded"
          />
          <div>
            <p className="font-bold group-hover:text-purple-600 transition-colors">
              {release.name}
            </p>
            <p className="text-sm text-gray-500">
              {dayjs(release.release_date).format("DD/MM/YYYY")}
            </p>
            <p className="text-xs text-gray-600 capitalize">
              {release.album_group}
            </p>
          </div>
        </div>
      </Link>
    </section>
  );
};
