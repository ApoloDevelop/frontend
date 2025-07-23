import { ItemRepository } from "../repositories/item.repository";

export class ItemService {
  static async findItemByTypeAndName(
    type: string,
    name: string
  ): Promise<{ itemId: number }> {
    return ItemRepository.findItemByTypeAndName(type, name);
  }
}
