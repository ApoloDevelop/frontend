"use client";

import Link from "next/link";

type Props = {
  title?: string;
  subtitle?: string;
  variant?: "full" | "panel";
  showLogin?: boolean;
  showRegister?: boolean;
  className?: string;
};

export default function Welcome({
  title = "Bienvenido a Apolo",
  subtitle = "Tu plataforma musical para descubrir, compartir y conectar.",
  variant = "full",
  showLogin = true,
  showRegister = true,
  className = "",
}: Props) {
  const Wrapper: any = variant === "full" ? "section" : "div";
  const wrapperClasses =
    variant === "full"
      ? `container mx-auto px-4 py-16 ${className}`
      : className;

  return (
    <Wrapper className={wrapperClasses}>
      <div
        className={
          variant === "full" ? "text-center max-w-2xl mx-auto" : "max-w-xl"
        }
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-zinc-900">
          {title}
        </h1>
        <p className="text-lg text-zinc-600 mb-8">{subtitle}</p>

        <div
          className={
            variant === "full"
              ? "flex gap-3 justify-center flex-wrap"
              : "flex gap-3 flex-wrap"
          }
        >
          {showLogin && (
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-600 text-white transition focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Iniciar sesión
            </Link>
          )}

          {showRegister && (
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-2xl bg-black hover:bg-zinc-900 text-white border border-black/10 transition focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Crear cuenta
            </Link>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
