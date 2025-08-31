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
}
