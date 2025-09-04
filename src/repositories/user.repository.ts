import { FollowSummary, UserLite } from "@/types/users";
import { authHeaders } from "@/utils/auth";

const B = process.env.NEXT_PUBLIC_BACKEND_URL;

export class UserRepository {
  static async getUserByUsername(username: string): Promise<any> {
    const res = await fetch(`${B}/users/username/${username}`);
    if (!res.ok) {
      throw new Error("Usuario no encontrado");
    }
    return await res.json();
  }

  static async getUserById(id: number): Promise<any> {
    const res = await fetch(`${B}/users/${id}`);
    if (!res.ok) {
      throw new Error("Usuario no encontrado");
    }
    return await res.json();
  }

  static async updateUser(id: number, data: any): Promise<any> {
    const res = await fetch(`${B}/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error("Error al actualizar el usuario");
    }
    return await res.json();
  }

  static async follow(targetUserId: number) {
    const res = await fetch(`${B}/users/${targetUserId}/follow`, {
      method: "POST",
      headers: authHeaders(),
    });
    if (!res.ok)
      throw new Error(
        await res.text().catch(() => "No se pudo seguir a este usuario")
      );
    return res.json() as Promise<{ following: true }>;
  }

  static async unfollow(targetUserId: number) {
    const res = await fetch(`${B}/users/${targetUserId}/follow`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok)
      throw new Error(
        await res
          .text()
          .catch(() => "No se pudo dejar de seguir a este usuario")
      );
    return res.json() as Promise<{ following: false }>;
  }

  static async getFollowSummary(profileUserId: number) {
    const res = await fetch(`${B}/users/${profileUserId}/follow-summary`, {
      headers: authHeaders(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Error al obtener el resumen de seguidores");
    return res.json() as Promise<FollowSummary>;
  }

  static async listFollowers(profileUserId: number, skip = 0, take = 20) {
    const q = new URLSearchParams({
      skip: String(skip),
      take: String(take),
    });
    const res = await fetch(`${B}/users/${profileUserId}/followers?${q}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Error al obtener la lista de seguidores");
    return res.json() as Promise<UserLite[]>;
  }

  static async listFollowing(profileUserId: number, skip = 0, take = 20) {
    const q = new URLSearchParams({
      skip: String(skip),
      take: String(take),
    });
    const res = await fetch(`${B}/users/${profileUserId}/following?${q}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Error al obtener la lista de seguidos");
    return res.json() as Promise<UserLite[]>;
  }

  static async deleteUser(userId: number): Promise<any> {
    const res = await fetch(`${B}/users/${userId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) {
      const errorText = await res
        .text()
        .catch(() => "Error al eliminar la cuenta");
      throw new Error(errorText);
    }
    return await res.json();
  }
}
