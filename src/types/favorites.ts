import { ItemType } from "./items";

export type FavoriteButtonProps = {
  type: ItemType;
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
};
