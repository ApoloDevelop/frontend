import { ListRepository } from "@/repositories/lists.repository";

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
}
