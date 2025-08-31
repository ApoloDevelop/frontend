// src/services/login.service.ts
import { clearSession, getToken, setSession } from "@/lib/auth";
import { LoginRepository } from "@/repositories/login.repository";

export class LoginService {
  static async login(credential: string, password: string) {
    const { token, user } = await LoginRepository.login({
      credential,
      password,
    });
    setSession(token, user);
    return { token, user };
  }

  static async getProfileFromStorage() {
    const token = getToken();
    if (!token) throw new Error("No hay token");
    try {
      const user = await LoginRepository.getProfile(token);
      setSession(token, user); // refresca caché local
      return user;
    } catch (e) {
      clearSession();
      throw e;
    }
  }
}
