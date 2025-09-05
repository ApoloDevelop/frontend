const B = process.env.NEXT_PUBLIC_BACKEND_URL;

export class LoginRepository {
  static async login(body: { credential: string; password: string }) {
    const res = await fetch(`${B}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Credenciales inválidas");
    }
    // Esperado: { token, user }
    return data as { token: string; user: any };
  }

  static async getProfile(token: string) {
    const res = await fetch(`${B}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "No autorizado");
    }
    return await res.json();
  }
}
