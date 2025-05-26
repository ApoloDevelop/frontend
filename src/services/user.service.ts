import { UserRepository } from "@/repositories/user.repository";

export class UserService {
  static async fetchUserProfile(username: string): Promise<any> {
    return await UserRepository.getUserByUsername(username);
  }
}
