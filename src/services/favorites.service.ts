import { FavoriteRepository } from "@/repositories/favorites.repository";

export class FavoriteService {
  static async isFavorite(
    artistName: string,
    userId: number
  ): Promise<boolean> {
    return FavoriteRepository.fetchIsFavorite(artistName, userId);
  }

  static async addFavorite(artistName: string, userId: number): Promise<void> {
    return FavoriteRepository.postAddFavorite(artistName, userId);
  }

  static async removeFavorite(
    artistName: string,
    userId: number
  ): Promise<void> {
    return FavoriteRepository.deleteRemoveFavorite(artistName, userId);
  }
}
