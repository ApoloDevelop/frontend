import { Scores } from "@/components/reviews/Scores";
import { SongHeader } from "./SongHeader";
import { SongLyrics } from "./SongLyrics";
import { SongCredits } from "./SongCredits";
import { SongSourceInfo } from "./SongSourceInfo";
import { SongAlbumInfo } from "./SongAlbumInfo";
import { wrapWord } from "@/utils/normalization";

interface Artist {
  id?: string;
  name: string;
}

interface Album {
  name: string;
  artists: Array<{ name: string }>;
}

interface Track {
  name: string;
  artists: Artist[];
  album?: Album;
}

interface Collaborator {
  role: string;
  names: string[];
}

interface SongMainContentProps {
  track: Track;
  albumRelease: string | null;
  genres: string[];
  bpm: number | null;
  musicKey: string | null;
  lyrics: string;
  collaboratorsByRole: Collaborator[];
  label: string | null;
  distributor: string | null;
  cover: string;
  artistSlug: string;
  albumSlug: string;
  stats: {
    verified: number | null;
    unverified: number | null;
    verifiedCount: number;
    unverifiedCount: number;
  };
  itemId: number | null;
  currentUserId: number | null;
  canModerate: boolean;
}

export function SongMainContent({
  track,
  albumRelease,
  genres,
  bpm,
  musicKey,
  lyrics,
  collaboratorsByRole,
  label,
  distributor,
  cover,
  artistSlug,
  albumSlug,
  stats,
  itemId,
  currentUserId,
  canModerate,
}: SongMainContentProps) {
  return (
    <main className="col-span-12 md:col-span-8 space-y-8">
      <SongHeader
        artists={track.artists}
        albumRelease={albumRelease}
        genres={genres}
        bpm={bpm}
        musicKey={musicKey}
      />

      <section className="w-full lg:w-[737px]">
        <Scores
          verified={stats.verified}
          unverified={stats.unverified}
          verifiedCount={stats.verifiedCount}
          unverifiedCount={stats.unverifiedCount}
          itemId={itemId}
          name={wrapWord(track.name)}
          variant="card"
          currentUserId={currentUserId}
          canModerate={canModerate}
        />
      </section>

      <SongLyrics lyrics={lyrics} />

      <SongCredits collaboratorsByRole={collaboratorsByRole} />

      <SongSourceInfo label={label} distributor={distributor} />

      {track.album && (
        <SongAlbumInfo
          album={track.album}
          cover={cover}
          artistSlug={artistSlug}
          albumSlug={albumSlug}
        />
      )}
    </main>
  );
}
