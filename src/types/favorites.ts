import { ItemType } from "./items";

export type FavoriteButtonProps = {
  type: ItemType;
  name: string;
  userId: number;
  artistName?: string;
  albumName?: string;
  location?: string;
  className?: string;
  customLabels?: {
    favorite: string;
    notFavorite: string;
  };
  iconSize?: number;
};
