export class UserRepository {
  static async getUserByUsername(username: string): Promise<any> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/username/${username}`
    );
    if (!res.ok) {
      throw new Error("Usuario no encontrado");
    }
    return await res.json();
  }

  static async updateUser(id: number, data: any): Promise<any> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (!res.ok) {
      throw new Error("Error al actualizar el usuario");
    }
    return await res.json();
  }
}
