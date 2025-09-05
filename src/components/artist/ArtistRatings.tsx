import { Scores } from "@/components/reviews/Scores";

interface ArtistRatingsProps {
  averages: { verified: number | null; unverified: number | null };
  reviewCounts: { verifiedCount: number; unverifiedCount: number };
  item: { itemId: number } | null;
  artistName: string;
  authUser: { id: number; role_id: number } | null;
}

export function ArtistRatings({
  averages,
  reviewCounts,
  item,
  artistName,
  authUser,
}: ArtistRatingsProps) {
  return (
    <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-2">Valoraciones</h2>
      <Scores
        verified={averages.verified}
        unverified={averages.unverified}
        verifiedCount={reviewCounts.verifiedCount}
        unverifiedCount={reviewCounts.unverifiedCount}
        itemId={item?.itemId ?? null}
        name={artistName}
        variant="inline"
        currentUserId={authUser?.id ?? null}
        canModerate={
          authUser ? [1, 2].includes(Number(authUser.role_id)) : false
        }
      />
    </section>
  );
}
