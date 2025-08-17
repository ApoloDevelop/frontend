import { FavoriteRepository } from "@/repositories/favorites.repository";

type FavPayload = {
  type: "artist" | "album" | "track" | "venue";
  name: string;
  userId: number;
  artistName?: string;
  location?: string;
};

export class FavoriteService {
  static async isFavorite(payload: FavPayload): Promise<boolean> {
    return FavoriteRepository.isFavorite(payload);
  }

  static async addFavorite(payload: FavPayload): Promise<void> {
    return FavoriteRepository.addFavorite(payload);
  }

  static async removeFavorite(payload: FavPayload): Promise<void> {
    return FavoriteRepository.removeFavorite(payload);
  }
}
