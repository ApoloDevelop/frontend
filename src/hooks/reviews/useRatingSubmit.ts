"use client";
import { ReviewService } from "@/services/review.service";

type RateableType = "artist" | "album" | "track" | "venue";

interface SubmitRatingProps {
  type: RateableType;
  name: string;
  artistName?: string;
  location?: string;
}

interface UseRatingSubmitReturn {
  handleSubmit: (
    score: number,
    comment: string,
    title: string
  ) => Promise<void>;
}

export function useRatingSubmit(
  props: SubmitRatingProps
): UseRatingSubmitReturn {
  const handleSubmit = async (
    score: number,
    comment: string,
    title: string
  ) => {
    const { type, name } = props;
    const payload: any = { type, name, score, comment, title };

    const needsArtist = type === "album" || type === "track";

    if (needsArtist && props.artistName) {
      payload.artistName = props.artistName;
    } else if (type === "venue" && props.location) {
      payload.location = props.location;
    }

    await ReviewService.rate(payload);
    window.location.reload();
  };

  return {
    handleSubmit,
  };
}
