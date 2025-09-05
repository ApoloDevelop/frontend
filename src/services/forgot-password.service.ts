import { ForgotPasswordRepository } from "@/repositories/forgot-password.repository";

export class ForgotPasswordService {
  static async sendResetEmail(email: string) {
    try {
      const result = await ForgotPasswordRepository.sendResetEmail(email);
      return result;
    } catch (error: any) {
      throw new Error(
        error.message || "Error al enviar el email de recuperación"
      );
    }
  }
}
