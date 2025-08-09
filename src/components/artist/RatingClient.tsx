"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RatingModal } from "./RatingModal";
import { ReviewService } from "@/services/review.service";

type RateableType = "artist" | "album" | "track" | "venue";

type BaseProps = {
  type: RateableType;
  name: string;
  userId: number; // Assuming you have a way to get the current user's ID
  defaultOpen?: boolean;
};

type ExtraProps =
  | { type: "artist" }
  | { type: "album"; artistName: string }
  | { type: "track"; artistName: string }
  | { type: "venue"; location: string };

type RatingClientProps = BaseProps & ExtraProps;

export function RatingClient(props: RatingClientProps) {
  console.log(props);
  const [open, setOpen] = useState(!!props.defaultOpen);

  const needsArtist = props.type === "album" || props.type === "track";

  const handleSubmit = async (
    score: number,
    comment: string,
    title: string
  ) => {
    const { type, name, userId } = props;
    const payload: any = { type, name, userId, score, comment, title };

    if (needsArtist) {
      payload.artistName = props.artistName;
    } else if (props.type === "venue") {
      payload.location = props.location;
    }

    await ReviewService.rate(payload);
    setOpen(false);
  };

  const buttonLabel =
    props.type === "artist"
      ? "Puntuar artista"
      : props.type === "album"
      ? "Puntuar álbum"
      : props.type === "track"
      ? "Puntuar canción"
      : "Puntuar sala";

  return (
    <>
      <Button onClick={() => setOpen(true)}>{buttonLabel}</Button>
      <RatingModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        name={props.name}
        type={props.type}
      />
    </>
  );
}
