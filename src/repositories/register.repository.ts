export class RegisterRepository {
  static async registerUser(body: any): Promise<any> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error al crear la cuenta");
    }

    return await res.json();
  }

  static async checkIfExists(email: string, username: string): Promise<any> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/exists?email=${email}&username=${username}`
    );

    if (!res.ok) {
      throw new Error("Error al verificar los datos");
    }

    return await res.json();
  }
}
