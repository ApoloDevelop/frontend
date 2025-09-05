"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { ForgotPasswordService } from "@/services/forgot-password.service";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await ForgotPasswordService.sendResetEmail(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Error al enviar el email de recuperación");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen w-full bg-[#f3f3f3] text-zinc-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-zinc-200 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Email enviado</h2>
            <p className="text-zinc-600 mb-6 text-sm leading-relaxed">
              Hemos enviado las instrucciones para restablecer tu contraseña a{" "}
              <span className="font-semibold text-zinc-900">{email}</span>
            </p>
            <p className="text-zinc-500 text-xs mb-6">
              Revisa tu bandeja de entrada y también la carpeta de spam. El
              enlace expirará en 1 hora.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => setSuccess(false)}
                variant="outline"
                className="w-full"
              >
                Enviar otro email
              </Button>
              <Link href="/login" className="block">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f3f3f3] text-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-zinc-200 p-8">
        <div className="mb-8">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver al login
          </Link>
          <h2 className="text-3xl font-semibold">¿Olvidaste tu contraseña?</h2>
          <p className="text-zinc-600 mt-2">
            No te preocupes, te enviaremos las instrucciones para restablecerla.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-zinc-700">
              Correo electrónico
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Enviando..." : "Enviar instrucciones"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-zinc-600">
            ¿Recordaste tu contraseña?{" "}
            <Link
              href="/login"
              className="text-purple-700 underline underline-offset-4 hover:text-purple-600"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
