import React from "react";
import { AlbumMetadata } from "./AlbumMetadata";
import { Scores } from "@/components/reviews/Scores";
import { AlbumTracklist } from "./AlbumTracklist";
import { AlbumCredits } from "./AlbumCredits";

interface AlbumMainContentProps {
  album: any;
  artistName: string;
  albumMetadata: {
    releaseDate?: string | null;
    genre?: string | null;
  };
  stats: any;
  tracks: any[];
  albumSlug: string;
  user?: {
    id: number;
    role_id: number;
  } | null;
}

export function AlbumMainContent({
  album,
  artistName,
  albumMetadata,
  stats,
  tracks,
  albumSlug,
  user,
}: AlbumMainContentProps) {
  return (
    <main className="col-span-12 md:col-span-8 space-y-8">
      {/* Título + metadatos */}
      <AlbumMetadata
        album={album}
        artistName={artistName}
        releaseDate={albumMetadata.releaseDate}
        genre={albumMetadata.genre}
      />

      {/* Scores */}
      <div className="w-full lg:w-[737px] justify-self-start">
        <Scores
          verified={stats.verified}
          unverified={stats.unverified}
          verifiedCount={stats.verifiedCount}
          unverifiedCount={stats.unverifiedCount}
          itemId={stats.itemId}
          name={album.name}
          variant="card"
          currentUserId={user?.id ?? null}
          canModerate={user ? [1, 2].includes(Number(user.role_id)) : false}
        />
      </div>

      {/* Tracklist */}
      <AlbumTracklist albumSlug={albumSlug} tracks={tracks} />

      {/* Créditos */}
      <AlbumCredits album={album} />
    </main>
  );
}
