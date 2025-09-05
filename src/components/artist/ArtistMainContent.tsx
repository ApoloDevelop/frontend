import { ArtistBio } from "@/components/artist/ArtistBio";
import { LatestAlbums } from "@/components/artist/LatestAlbums";
import { RelatedArtists } from "@/components/artist/RelatedArtists";
import { ArtistRatings } from "@/components/artist/ArtistRatings";
import { ArtistDetails } from "@/types/musicbrainz";

interface ArtistMainContentProps {
  averages: { verified: number | null; unverified: number | null };
  reviewCounts: { verifiedCount: number; unverifiedCount: number };
  item: { itemId: number } | null;
  artistName: string;
  authUser: { id: number; role_id: number } | null;
  details: ArtistDetails | null;
  genres: string[];
  bio: string | null;
  albums: any[];
  slug: string;
  relatedArtists: any[];
}

export function ArtistMainContent({
  averages,
  reviewCounts,
  item,
  artistName,
  authUser,
  details,
  genres,
  bio,
  albums,
  slug,
  relatedArtists,
}: ArtistMainContentProps) {
  return (
    <div className="w-full lg:w-2/3 space-y-6 sm:space-y-8">
      <ArtistRatings
        averages={averages}
        reviewCounts={reviewCounts}
        item={item}
        artistName={artistName}
        authUser={authUser}
      />

      {/* Biografía */}
      <ArtistBio details={details} genres={genres} bio={bio} />

      {/* Álbumes */}
      <LatestAlbums albums={albums} artistSlug={slug} />

      {/* Artistas relacionados */}
      <RelatedArtists artists={relatedArtists} />
    </div>
  );
}
