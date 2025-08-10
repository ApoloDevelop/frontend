import { ItemRepository } from "../repositories/item.repository";

export class ItemService {
  static async findItemByTypeAndName(
    type: "artist" | "album" | "track" | "venue",
    name: string,
    ctx?: { artistName?: string; location?: string }
  ): Promise<{ itemId: number } | null> {
    console.log("Resolviendo item:", { type, name, ctx });
    return ItemRepository.findItemByTypeAndName(type, name, ctx);
  }
}
