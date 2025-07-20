"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArtistRatingModal } from "./ArtistRatingModal";
import { ArtistService } from "@/services/review.service";

export function ArtistRatingClient({
  artistName,
  artistBirthdate,
}: {
  artistName: string;
  artistBirthdate?: Date; // Opcional, si necesitas la fecha de nacimiento del artista
}) {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (score: number, comment: string) => {
    await ArtistService.rateArtist({
      artistName,
      score,
      comment,
      userId: 1, // Aquí deberías obtener el ID del usuario actual
      birthdate: artistBirthdate, // Aquí deberías obtener la fecha de nacimiento del usuario actual
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
