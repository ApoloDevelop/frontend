"use client";

import { LoginContent, LoginWelcomePanel } from "@/components/auth";
import { useLogin, useLoginNavigation } from "@/hooks/auth";

export default function LoginPage() {
  const {
    nextRaw,
    nextSafe,
    oauthError,
    googleUrl,
    spotifyUrl,
    redirectToNext,
    getRegisterUrl,
  } = useLoginNavigation();

  const {
    credentials,
    setCredentials,
    error,
    setError,
    loading,
    showPassword,
    setShowPassword,
    handleLogin,
  } = useLogin((nextUrl) => redirectToNext(nextSafe));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await handleLogin(credentials.credential, credentials.password);
  }

  // Set OAuth error when detected
  if (oauthError && !error) {
    setError(
      "No se pudo completar el inicio de sesión con el proveedor. Inténtalo de nuevo."
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f3f3f3] text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden border border-zinc-200 shadow-xl bg-white">
          {/* Columna izquierda: Login */}
          <LoginContent
            credentials={credentials}
            onCredentialsChange={setCredentials}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword((s) => !s)}
            loading={loading}
            error={error}
            oauthError={oauthError}
            googleUrl={googleUrl}
            spotifyUrl={spotifyUrl}
            registerUrl={getRegisterUrl()}
            onSubmit={handleSubmit}
            onRedirect={redirectToNext}
          />

          {/* Columna derecha */}
          <LoginWelcomePanel />
        </div>
      </div>
    </div>
  );
}
