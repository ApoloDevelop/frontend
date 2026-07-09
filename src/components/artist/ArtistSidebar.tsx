import { Suspense } from "react";
import { LatestRelease } from "@/components/artist/LatestRelease";
import { PopularSongs } from "@/components/artist/PopularSongs";
import { EventsSidebarSkeleton } from "@/components/skeletons/EventsSidebarSkeleton";
import EventsSidebar from "@/components/artist/EventsSidebar";

interface ArtistSidebarProps {
  lastRelease: any;
  topTracks: any[];
  artistName: string;
  slug: string;
  user: any;
}

export function ArtistSidebar({
  lastRelease,
  topTracks,
  artistName,
  slug,
  user,
}: ArtistSidebarProps) {
  return (
    <div className="w-full lg:w-1/3 flex flex-col gap-6 sm:gap-8 lg:sticky lg:top-24">
      <LatestRelease release={lastRelease} />

      <PopularSongs topTracks={topTracks} />

      <Suspense fallback={<EventsSidebarSkeleton />}>
        <EventsSidebar
          artistName={artistName}
          slug={slug}
          user={user}
        />
      </Suspense>
    </div>
  );
}
