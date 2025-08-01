import { ListRepository } from "@/repositories/lists.repository";

export class ListService {
  static async getUserLists(
    userId: number,
    itemType?: string
  ): Promise<{ id: number; name: string }[]> {
    return await ListRepository.getUserLists(userId, itemType);
  }
}
