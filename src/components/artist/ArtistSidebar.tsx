import { LatestRelease } from "@/components/artist/LatestRelease";
import { PopularSongs } from "@/components/artist/PopularSongs";

interface ArtistSidebarProps {
  lastRelease: any;
  topTracks: any[];
}

export function ArtistSidebar({ lastRelease, topTracks }: ArtistSidebarProps) {
  return (
    <div className="w-full lg:w-1/3 flex flex-col gap-6 sm:gap-8 lg:sticky lg:top-24">
      {/* Último lanzamiento */}
      <LatestRelease release={lastRelease} />

      {/* Canciones populares */}
      <PopularSongs topTracks={topTracks} />
    </div>
  );
}
