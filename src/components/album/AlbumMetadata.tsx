import React from "react";
import Link from "next/link";
import { slugify } from "@/utils/normalization";

interface AlbumMetadataProps {
  album: any;
  artistName: string;
  releaseDate?: string | null;
  genre?: string | null;
}

export function AlbumMetadata({
  album,
  artistName,
  releaseDate,
  genre,
}: AlbumMetadataProps) {
  return (
    <header className="space-y-2">
      <p className="text-lg">
        <span className="font-semibold">Artista:</span>{" "}
        {album.artists?.map((artist: any, index: number) => (
          <span key={artist.id || artist.name}>
            <Link
              href={`/artists/${slugify(artist.name)}`}
              className="text-purple-600 hover:underline"
              scroll
            >
              {artist.name}
            </Link>
            {index < album.artists.length - 1 && ", "}
          </span>
        ))}
      </p>

      {releaseDate ? (
        <p className="text-lg">
          <span className="font-semibold">Lanzamiento:</span>{" "}
          <span title={releaseDate}>{releaseDate}</span>
        </p>
      ) : null}

      {genre ? (
        <p className="text-lg">
          <span className="font-semibold">Género:</span> {genre}
        </p>
      ) : null}
    </header>
  );
}
