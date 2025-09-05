import { RegisterRepository } from "@/repositories/register.repository";
import { normalizeUser } from "@/lib/auth";

export class RegisterService {
  static async createAccount(
    formData: any,
    profilePicUrl: string
  ): Promise<any> {
    const { confirmPassword, ...filteredFormData } = formData;

    const body = {
      ...filteredFormData,
      email: formData.email.toLowerCase(),
      username: formData.username.toLowerCase(),
      profile_pic: profilePicUrl,
      social_genre: formData.social_genre || null,
    };

    const response = await RegisterRepository.registerUser(body);

    // Si la respuesta incluye un usuario, normalizarlo
    if (response.user) {
      response.user = normalizeUser(response.user);
    }

    return response;
  }

  static async validateAndCheckIfExists(
    email: string,
    username: string
  ): Promise<any> {
    return await RegisterRepository.checkIfExists(email, username);
  }
}
