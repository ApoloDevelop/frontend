import React from "react";
import Image from "next/image";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { AddToListDialog } from "@/components/lists/AddToListDialog";
import { Rating } from "@/components/reviews";
import { SpotifyButton } from "./SpotifyButton";

interface AlbumSidebarProps {
  albumName: string;
  year?: number;
  cover: string;
  artistName: string;
  itemId: number | null;
  spotifyUrl?: string;
  user?: {
    id: number;
    role_id: number;
  } | null;
}

export function AlbumSidebar({
  albumName,
  year,
  cover,
  artistName,
  itemId,
  spotifyUrl,
  user,
}: AlbumSidebarProps) {
  return (
    <aside className="col-span-12 md:col-span-4 md:sticky md:top-24 space-y-4 self-start">
      <h1
        title={albumName}
        className="text-3xl md:text-4xl font-bold leading-tight"
      >
        {albumName}
        {year ? <span className="text-muted-foreground"> ({year})</span> : null}
      </h1>

      <div className="aspect-square w-full overflow-hidden rounded-2xl shadow-lg bg-white">
        <Image
          src={cover}
          alt={`Cover de ${albumName}`}
          width={800}
          height={800}
          className="h-full w-full object-cover"
          priority
        />
      </div>

      <Rating
        name={albumName}
        type="album"
        artistName={artistName}
        itemId={itemId}
      />

      <div className="flex flex-wrap items-center gap-3">
        {/* Mostrar solo si hay sesión */}
        {user && (
          <>
            <FavoriteButton
              type="album"
              name={albumName}
              artistName={artistName}
              userId={user.id}
            />
            <AddToListDialog
              userId={user.id}
              itemType="album"
              name={albumName}
              artistName={artistName}
            />
          </>
        )}

        {spotifyUrl && <SpotifyButton url={spotifyUrl} />}
      </div>
    </aside>
  );
}
