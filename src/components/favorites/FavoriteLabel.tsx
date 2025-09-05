import React from "react";

interface FavoriteLabelProps {
  isFavorite: boolean;
  customLabels?: {
    favorite: string;
    notFavorite: string;
  };
}

export function FavoriteLabel({
  isFavorite,
  customLabels = { favorite: "Favorito", notFavorite: "Favorito" },
}: FavoriteLabelProps) {
  return (
    <span>{isFavorite ? customLabels.favorite : customLabels.notFavorite}</span>
  );
}
