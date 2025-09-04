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

  static async followUser(targetUserId: number) {
    return UserRepository.follow(targetUserId);
  }

  static async unfollowUser(targetUserId: number) {
    return UserRepository.unfollow(targetUserId);
  }

  static async getFollowSummary(profileUserId: number) {
    return UserRepository.getFollowSummary(profileUserId);
  }

  static async listFollowers(profileUserId: number, skip = 0, take = 20) {
    return UserRepository.listFollowers(profileUserId, skip, take);
  }

  static async listFollowing(profileUserId: number, skip = 0, take = 20) {
    return UserRepository.listFollowing(profileUserId, skip, take);
  }

  static async searchUsers(query: string, limit = 10) {
    return UserRepository.searchUsers(query, limit);
  }
}
