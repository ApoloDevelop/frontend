const B = process.env.NEXT_PUBLIC_BACKEND_URL;

export class ForgotPasswordRepository {
  static async sendResetEmail(email: string) {
    const res = await fetch(`${B}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al enviar el email");
    }

    return data;
  }
}
