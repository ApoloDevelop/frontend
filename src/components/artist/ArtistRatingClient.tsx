"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArtistRatingModal } from "./ArtistRatingModal";
import { ReviewService } from "@/services/review.service";

export function ArtistRatingClient({ artistName }: { artistName: string }) {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (score: number, comment: string) => {
    await ReviewService.rateArtist({
      artistName,
      score,
      comment,
      userId: 1, // Aquí debería obtener el ID del usuario actual
    });
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Puntuar artista</Button>
      <ArtistRatingModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        artistName={artistName}
      />
    </>
  );
}
