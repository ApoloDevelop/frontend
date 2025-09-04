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

  static async getListById(listId: number): Promise<any> {
    return await ListRepository.getListById(listId);
  }

  static async deleteList(listId: number): Promise<void> {
    return await ListRepository.deleteList(listId);
  }

  static async updateListName(listId: number, name: string): Promise<any> {
    return await ListRepository.updateListName(listId, name);
  }

  static async resolveTagToItemId(tag: any): Promise<number | null> {
    // Esta función debería resolver un tag (artista, álbum, canción) a un itemId
    // Por ahora, retornamos null ya que necesitaríamos más información sobre cómo
    // se relacionan los tags con los items en el backend
    console.log("Resolving tag to itemId:", tag);
    return null;
  }
}
