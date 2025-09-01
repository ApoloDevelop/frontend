import React from "react";
import { Heart } from "lucide-react";

interface FavoriteIconProps {
  isFavorite: boolean;
  size?: number;
}

export function FavoriteIcon({ isFavorite, size = 18 }: FavoriteIconProps) {
  return (
    <Heart
      size={size}
      className={isFavorite ? "text-red-500" : "text-white"}
      fill={isFavorite ? "currentColor" : "none"}
    />
  );
}
