"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Welcome from "@/components/home/Welcome";
import SpotifyLogo from "@/components/icons/SpotifyLogo";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { LoginService } from "@/services/login.service";
import { isAuthenticated } from "@/lib/auth";

function sanitizeNext(n: string | null): string {
  if (!n) return "/";
  try {
    const decoded = decodeURIComponent(n);
    // Debe ser ruta relativa del sitio y no puede apuntar a /login
    if (!decoded.startsWith("/") || decoded.startsWith("//")) return "/";
    if (decoded.startsWith("/login")) return "/";
    return decoded;
  } catch {
    return "/";
  }
}

function withNext(base: string | undefined, next: string | null) {
  if (!base) return undefined;
  const url = new URL(base);
  if (next) url.searchParams.set("next", next);
  return url.toString();
}

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const nextRaw = sp.get("next");
  const nextSafe = useMemo(() => sanitizeNext(nextRaw), [nextRaw]);

  const [cred, setCred] = useState({ credential: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const OAUTH_GOOGLE = process.env.NEXT_PUBLIC_OAUTH_GOOGLE_URL;
  const OAUTH_SPOTIFY = process.env.NEXT_PUBLIC_OAUTH_SPOTIFY_URL;

  const oauthError = sp.get("oauth") === "error";

  // Si ya hay sesión, redirige al destino (o a /)
  useEffect(() => {
    if (isAuthenticated()) {
      router.replace(nextSafe);
    }
  }, [router, nextSafe]);

  useEffect(() => {
    if (oauthError) {
      setError(
        "No se pudo completar el inicio de sesión con el proveedor. Inténtalo de nuevo."
      );
      // Mantén el `next` en la URL al limpiar la bandera de error
      router.replace(
        nextRaw ? `/login?next=${encodeURIComponent(nextRaw)}` : "/login"
      );
    }
  }, [oauthError, router, nextRaw]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await LoginService.login(cred.credential, cred.password);
      // Recarga completa y respeta `next`
      window.location.href = nextSafe;
    } catch (err: any) {
      setError(err?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  const googleUrl = withNext(OAUTH_GOOGLE, nextRaw);
  const spotifyUrl = withNext(OAUTH_SPOTIFY, nextRaw);

  return (
    <div className="min-h-screen w-full bg-[#f3f3f3] text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden border border-zinc-200 shadow-xl bg-white">
          {/* Columna izquierda: Login */}
          <div className="p-8 sm:p-10 md:p-12">
            <div className="mb-8">
              <h2 className="text-3xl font-semibold">Entra en Apolo</h2>
              <p className="text-zinc-600 mt-2">
                Accede para guardar favoritos, puntuar y descubrir música a tu
                medida.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Credential */}
              <div>
                <label className="mb-1 block text-sm text-zinc-700">
                  Email o usuario
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                    <Mail size={18} />
                  </span>
                  <input
                    type="text"
                    placeholder="tu@correo.com o usuario"
                    value={cred.credential}
                    onChange={(e) =>
                      setCred({ ...cred, credential: e.target.value })
                    }
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-1 block text-sm text-zinc-700">
                  Contraseña
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={cred.password}
                    onChange={(e) =>
                      setCred({ ...cred, password: e.target.value })
                    }
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    aria-label={
                      showPass ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-purple-700 hover:bg-purple-600 focus-visible:ring-purple-400 text-white"
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 text-center text-sm text-zinc-500">— o —</div>

            {/* OAuth */}
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => googleUrl && (window.location.href = googleUrl)}
                className="w-full justify-center rounded-xl bg-white text-zinc-900 hover:bg-zinc-50 border border-zinc-300"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png"
                  alt="Google"
                  className="w-[18px] h-[18px] mr-2"
                />
                Entrar con Google
              </Button>

              <Button
                onClick={() =>
                  spotifyUrl && (window.location.href = spotifyUrl)
                }
                className="w-full justify-center rounded-xl bg-black hover:bg-zinc-900 text-white"
              >
                <span className="mr-2 inline-flex">
                  <SpotifyLogo />
                </span>
                Entrar con Spotify
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-zinc-600">
              ¿No tienes cuenta?{" "}
              <a
                href={
                  nextRaw
                    ? `/register?next=${encodeURIComponent(nextRaw)}`
                    : "/register"
                }
                className="text-purple-700 underline underline-offset-4 hover:text-purple-600"
              >
                Regístrate
              </a>
            </p>
          </div>

          {/* Columna derecha */}
          <div className="relative p-8 sm:p-10 md:p-12 bg-gradient-to-br from-purple-50 via-white to-purple-50 border-l border-zinc-200">
            <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-purple-300/30 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />

            <Welcome
              variant="panel"
              title="Descubre Apolo"
              subtitle="Explora rankings, noticias, reseñas verificadas y recomendaciones según tus gustos."
              showLogin={false}
              showRegister
              className="relative z-10"
            />

            <ul className="relative z-10 mt-8 space-y-3 text-sm text-zinc-700">
              <li>
                • Puntúa artistas, álbumes y canciones con reseñas verificadas.
              </li>
              <li>• Sigue giras cerca de ti y guarda favoritos.</li>
              <li>• Descubre datos de tus canciones preferidas.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
