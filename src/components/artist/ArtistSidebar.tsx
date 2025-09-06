import { Suspense } from "react";
import { LatestRelease } from "@/components/artist/LatestRelease";
import { PopularSongs } from "@/components/artist/PopularSongs";
import { EventsSidebarSkeleton } from "@/components/skeletons/EventsSidebarSkeleton";
import EventsSidebar from "@/components/artist/EventsSidebar";

interface ArtistSidebarProps {
  lastRelease: any;
  topTracks: any[];
  artistId: string;
  slug: string;
  user: any;
  artistName: string;
}

export function ArtistSidebar({
  lastRelease,
  topTracks,
  artistId,
  slug,
  user,
  artistName,
}: ArtistSidebarProps) {
  return (
    <div className="w-full lg:w-1/3 flex flex-col gap-6 sm:gap-8 lg:sticky lg:top-24">
      {/* Último lanzamiento */}
      <LatestRelease release={lastRelease} />

      {/* Canciones populares */}
      <PopularSongs topTracks={topTracks} />

      <Suspense fallback={<EventsSidebarSkeleton />}>
        <EventsSidebar
          artistId={artistId}
          slug={slug}
          user={user}
          artistName={artistName}
        />
      </Suspense>
    </div>
  );
}
