export class UserRepository {
  static async getUserByUsername(username: string): Promise<any> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${username}`
    );
    if (!res.ok) {
      throw new Error("Usuario no encontrado");
    }
    return await res.json();
  }
}
