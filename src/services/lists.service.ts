import { ListRepository } from "@/repositories/lists.repository";
import { ItemService } from "./item.service";
import { TagDraft } from "@/types/article";

export class ListService {
  static async getUserLists(
    itemType?: string
  ): Promise<{ id: number; name: string }[]> {
    return await ListRepository.getUserLists(itemType);
  }

  static async createList(
    name: string,
    itemType?: string
  ): Promise<{ id: number; name: string }> {
    return await ListRepository.createList(name, itemType);
  }

  static async addItemToList(listId: number, itemId: number): Promise<void> {
    return await ListRepository.addItemToList(listId, itemId);
  }

  static async removeItemFromList(
    listId: number,
    itemId: number
  ): Promise<void> {
    return await ListRepository.removeItemFromList(listId, itemId);
  }

  static async getListById(listId: number): Promise<any> {
    return await ListRepository.getListById(listId);
  }

  static async deleteList(listId: number): Promise<void> {
    return await ListRepository.deleteList(listId);
  }

  static async updateListName(listId: number, name: string): Promise<any> {
    return await ListRepository.updateListName(listId, name);
  }

  static async resolveTagToItemId(tag: TagDraft): Promise<number | null> {
    try {
      // Convertir TagDraft a los parámetros que espera ItemService
      const result = await ItemService.findItemByTypeAndName(
        tag.type as "artist" | "album" | "track",
        tag.name,
        {
          artistName: tag.artistName,
          // albumName se podría añadir si ItemService lo soporta
        }
      );

      return result ? result.itemId : null;
    } catch (error) {
      console.error("Error resolving tag to itemId:", error);
      return null;
    }
  }
}
