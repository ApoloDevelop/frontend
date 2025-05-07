// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [cred, setCred] = useState({ credential: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const API = process.env.NEXT_PUBLIC_BACKEND_URL;
  const OAUTH_GOOGLE = process.env.NEXT_PUBLIC_OAUTH_GOOGLE_URL;
  const OAUTH_SPOTIFY = process.env.NEXT_PUBLIC_OAUTH_SPOTIFY_URL;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cred),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Error al iniciar sesión");
      localStorage.setItem("token", body.token);
      router.push("/profile");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-full max-w-md text-center">
        <h2 className="text-2xl mb-4">Iniciar sesión</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex flex-col items-center"
        >
          <input
            type="text"
            placeholder="Email o usuario"
            value={cred.credential}
            onChange={(e) => setCred({ ...cred, credential: e.target.value })}
            required
            className="w-1/3 px-3 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={cred.password}
            onChange={(e) => setCred({ ...cred, password: e.target.value })}
            required
            className="w-1/3 px-3 py-2 border rounded"
          />
          <Button type="submit">Entrar</Button>
        </form>
        <div className="my-4 text-center">— o —</div>
        <div className="flex flex-col items-center">
          <Button onClick={() => (window.location.href = OAUTH_GOOGLE!)}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png"
              alt="Google"
              style={{
                width: "21px",
                height: "22px",
                marginRight: "8px",
                marginTop: "3px",
                marginBottom: "3px",
              }}
            />
            Entrar con Google
          </Button>
          <Button onClick={() => (window.location.href = OAUTH_SPOTIFY!)}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
              alt="Spotify"
              style={{
                width: "21px",
                height: "21px",
                marginRight: "8px",
                marginTop: "3px",
                marginBottom: "3px",
              }}
            />
            Entrar con Spotify
          </Button>
        </div>
        <p className="mt-4 text-center">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-blue-600">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
}
