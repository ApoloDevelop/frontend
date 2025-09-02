// src/components/reviews/Rating.tsx  (SERVER)
import { RatingClient } from "./RatingClient";
import { getRatingAuth } from "@/hooks/reviews/useRatingAuth";
import { getInitialReview } from "@/hooks/reviews/useInitialReview";

type RateableType = "artist" | "album" | "track" | "venue";

type BaseProps = {
  type: RateableType;
  name: string;
  defaultOpen?: boolean;
  itemId?: number | null;
};

type ExtraProps =
  | { type: "artist" }
  | { type: "album"; artistName: string }
  | { type: "track"; artistName: string }
  | { type: "venue"; location: string };

export default async function Rating(props: BaseProps & ExtraProps) {
  const { user, isVerifiedUser, isAuthenticated, token } =
    await getRatingAuth();

  // Get initial review if user is authenticated and itemId exists
  const initialReview = await getInitialReview(props.itemId ?? null, token);

  return (
    <RatingClient
      {...props}
      isAuthenticated={isAuthenticated}
      initialReview={initialReview}
      itemId={props.itemId ?? null}
      isVerifiedUser={isVerifiedUser}
    />
  );
}
