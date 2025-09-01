"use client";
import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useFavoriteStatus } from "@/hooks/favorites/useFavoriteStatus";
import { useFavoriteActions } from "@/hooks/favorites/useFavoriteActions";
import { FavoriteIcon } from "./FavoriteIcon";
import { FavoriteLabel } from "./FavoriteLabel";

type FavType = "artist" | "album" | "track" | "venue";

interface FavoriteButtonProps {
  type: FavType;
  name: string;
  userId: number;
  artistName?: string;
  location?: string;
  className?: string;
  customLabels?: {
    favorite: string;
    notFavorite: string;
  };
  iconSize?: number;
}

export function FavoriteButton({
  type,
  name,
  userId,
  artistName,
  location,
  className,
  customLabels,
  iconSize = 18,
}: FavoriteButtonProps) {
  // Custom hooks
  const { isFavorite, setIsFavorite, loading, setLoading } = useFavoriteStatus({
    type,
    name,
    userId,
    artistName,
    location,
  });

  const { toggleFavorite } = useFavoriteActions({
    type,
    name,
    userId,
    artistName,
    location,
    isFavorite,
    setIsFavorite,
    setLoading,
  });

  return (
    <Button
      type="button"
      onClick={toggleFavorite}
      disabled={loading}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? "Eliminar de favoritos" : "Añadir a favoritos"}
      title={isFavorite ? "Eliminar de favoritos" : "Añadir a favoritos"}
      className={cn(
        "inline-flex items-center gap-2 rounded-md disabled:opacity-60",
        className
      )}
    >
      <FavoriteIcon isFavorite={isFavorite} size={iconSize} />
      <FavoriteLabel isFavorite={isFavorite} customLabels={customLabels} />
    </Button>
  );
}
