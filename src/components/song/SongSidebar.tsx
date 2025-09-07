import Image from "next/image";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { AddToListDialog } from "@/components/lists/AddToListDialog";
import { Rating } from "@/components/reviews";
import { SpotifyButton } from "@/components/ui/SpotifyButton";
import { SongMetadata } from "./SongMetadata";

interface SongSidebarProps {
  songName: string;
  cover: string;
  durationMs: number;
  albumRelease: string | null;
  genres: string[];
  explicit: boolean;
  itemId: number | null;
  artistName: string;
  albumName: string;
  primaryArtist: string;
  spotifyUrl?: string;
  user?: {
    id: number;
  } | null;
}

export function SongSidebar({
  songName,
  cover,
  durationMs,
  albumRelease,
  genres,
  explicit,
  itemId,
  artistName,
  albumName,
  primaryArtist,
  spotifyUrl,
  user,
}: SongSidebarProps) {
  return (
    <aside className="col-span-12 md:col-span-4 md:sticky md:top-24 self-start space-y-4">
      <h1 className="text-3xl md:text-4xl font-bold leading-tight clamp-3">
        {songName}
      </h1>

      <div className="aspect-square w-full overflow-hidden rounded-2xl shadow-lg bg-white">
        <Image
          src={cover}
          alt={`Cover de ${songName}`}
          width={800}
          height={800}
          className="h-full w-full object-cover"
          priority
        />
      </div>

      <SongMetadata
        durationMs={durationMs}
        albumRelease={albumRelease}
        genres={genres}
        explicit={explicit}
      />

      <Rating
        name={songName}
        type="track"
        itemId={itemId}
        artistName={artistName}
        albumName={albumName}
      />

      {user && (
        <div className="flex flex-wrap items-center gap-3">
          <FavoriteButton
            type="track"
            name={songName}
            artistName={primaryArtist}
            albumName={albumName}
            userId={user.id}
          />
          <AddToListDialog
            itemType="track"
            name={songName}
            artistName={primaryArtist}
            userId={user.id}
          />
          <SpotifyButton url={spotifyUrl} />
        </div>
      )}

      {!user && <SpotifyButton url={spotifyUrl} />}
    </aside>
  );
}
