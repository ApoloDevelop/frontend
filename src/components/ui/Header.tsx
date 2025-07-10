"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const pathname = usePathname();
  const isRegisterPage = pathname === "/register";

  return (
    <header className="p-4">
      <nav className="flex items-center justify-between space-x-8">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center">
            <h1
              className={`text-2xl font-bold ${
                isRegisterPage ? "text-white" : "text-black"
              }`}
            >
              Apolo
            </h1>
          </Link>
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/"
                className={`text-lg font-medium ${
                  isRegisterPage ? "text-white" : "text-black"
                } hover:underline`}
              >
                Artistas
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className={`text-lg font-medium ${
                  isRegisterPage ? "text-white" : "text-black"
                } hover:underline`}
              >
                Noticias
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className={`text-lg font-medium ${
                  isRegisterPage ? "text-white" : "text-black"
                } hover:underline`}
              >
                Géneros
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className={`text-lg font-medium ${
                  isRegisterPage ? "text-white" : "text-black"
                } hover:underline`}
              >
                Buscar
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className={`text-lg font-medium ${
                  isRegisterPage ? "text-white" : "text-black"
                } hover:underline`}
              >
                Conciertos
              </Link>
            </li>
          </ul>
        </div>
        <Link href="/users/williardo" className="ml-auto">
          {/* Icono de perfil SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-8 h-8 ${
              isRegisterPage ? "text-white" : "text-black"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle
              cx="12"
              cy="8"
              r="4"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              stroke="currentColor"
              strokeWidth="2"
              d="M4 20c0-4 4-6 8-6s8 2 8 6"
              fill="none"
            />
          </svg>
        </Link>
      </nav>
    </header>
  );
}
