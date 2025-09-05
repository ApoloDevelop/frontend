import { Hero } from "@/components/images/Hero";
import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";
import { SongSidebar } from "./SongSidebar";
import { SongMainContent } from "./SongMainContent";
import { Track } from "@/types/songs";

interface Collaborator {
  role: string;
  names: string[];
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface SongLayoutProps {
  track: Track;
  cover: string;
  breadcrumbItems: BreadcrumbItem[];
  durationMs: number;
  albumRelease: string | null;
  genres: string[];
  explicit: boolean;
  bpm: number | null;
  musicKey: string | null;
  lyrics: string;
  collaboratorsByRole: Collaborator[];
  label: string | null;
  distributor: string | null;
  artistSlug: string;
  albumSlug: string;
  albumName: string;
  primaryArtist: string;
  stats: {
    verified: number | null;
    unverified: number | null;
    verifiedCount: number;
    unverifiedCount: number;
  };
  itemId: number | null;
  user?: {
    id: number;
  } | null;
  canModerate: boolean;
}

export function SongLayout({
  track,
  cover,
  breadcrumbItems,
  durationMs,
  albumRelease,
  genres,
  explicit,
  bpm,
  musicKey,
  lyrics,
  collaboratorsByRole,
  label,
  distributor,
  artistSlug,
  albumSlug,
  albumName,
  primaryArtist,
  stats,
  itemId,
  user,
  canModerate,
}: SongLayoutProps) {
  const artistNameSure = track.artists[0]?.name || "";

  return (
    <>
      <Hero cover={cover} type="song" />

      <div className="relative -mt-12 pb-20">
        <div className="mx-auto max-w-6xl px-4">
          <CustomBreadcrumb items={breadcrumbItems} />
          <div className="grid grid-cols-12 gap-8 mt-4">
            <SongSidebar
              songName={track.name}
              cover={cover}
              durationMs={durationMs}
              albumRelease={albumRelease}
              genres={genres}
              explicit={explicit}
              itemId={itemId}
              artistName={artistNameSure}
              albumName={albumName}
              primaryArtist={primaryArtist}
              spotifyUrl={track.external_urls?.spotify}
              user={user}
            />

            <SongMainContent
              track={track}
              albumRelease={albumRelease}
              genres={genres}
              bpm={bpm}
              musicKey={musicKey}
              lyrics={lyrics}
              collaboratorsByRole={collaboratorsByRole}
              label={label}
              distributor={distributor}
              cover={cover}
              artistSlug={artistSlug}
              albumSlug={albumSlug}
              stats={stats}
              itemId={itemId}
              currentUserId={user?.id ?? null}
              canModerate={canModerate}
            />
          </div>
        </div>
      </div>
    </>
  );
}
