import { UserRepository } from "@/repositories/user.repository";

export class UserService {
  static async fetchUserProfile(username: string): Promise<any> {
    return await UserRepository.getUserByUsername(username);
  }

  static async getUserById(id: number): Promise<any> {
    return await UserRepository.getUserById(id);
  }

  static async updateUser(id: number, data: any): Promise<any> {
    return await UserRepository.updateUser(id, data);
  }
}
