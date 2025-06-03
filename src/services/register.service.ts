import { RegisterRepository } from "@/repositories/register.repository";

export class RegisterService {
  static async uploadProfileImage(file: File): Promise<string> {
    return await RegisterRepository.uploadImage(file);
  }

  static async createAccount(
    formData: any,
    profilePicUrl: string
  ): Promise<any> {
    const { confirmPassword, phonePrefix, ...filteredFormData } = formData;

    const body = {
      ...filteredFormData,
      email: formData.email.toLowerCase(),
      username: formData.username.toLowerCase(),
      phone: `${formData.phonePrefix}${formData.phone}`,
      profile_pic: profilePicUrl,
      social_genre: formData.social_genre || null,
    };

    return await RegisterRepository.registerUser(body);
  }

  static async validateAndCheckIfExists(
    email: string,
    username: string,
    phone: string
  ): Promise<any> {
    return await RegisterRepository.checkIfExists(email, username, phone);
  }
}
