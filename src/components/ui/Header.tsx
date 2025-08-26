"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, User } from "lucide-react";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/news", label: "Noticias" },
  { href: "/explore", label: "Explorar" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Cerrar con ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Bloquear scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  // Cerrar al navegar a otra ruta
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <>
      {/* HEADER full-bleed */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-100">
        {/* Full width sin container para poder pegar a las esquinas */}
        <div className="w-full">
          <div className="h-14 sm:h-16 grid grid-cols-[auto_1fr_auto] items-center">
            {/* Brand a la ESQUINA IZQUIERDA */}
            <div className="pl-3 sm:pl-4">
              <Link
                href="/"
                className="block font-extrabold text-xl sm:text-2xl tracking-tight"
                aria-label="Apolo - Inicio"
              >
                Apolo
              </Link>
            </div>

            {/* Nav centrado (solo desktop) */}
            <nav className="hidden md:flex justify-center gap-6">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`text-sm font-medium transition hover:opacity-90 ${
                    isActive(l.href) ? "text-black" : "text-gray-600"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Acciones a la ESQUINA DERECHA */}
            <div className="pr-3 sm:pr-4 flex items-center">
              {/* Desktop actions */}
              <div className="hidden md:flex items-center gap-2">
                {/* Sustituye por tu lógica real de sesión */}
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-md bg-black text-white px-3 py-2 text-sm hover:bg-purple-700 transition"
                >
                  <User className="h-4 w-4" />
                  Acceder
                </Link>
              </div>

              {/* Botón hamburguesa (mobile) pegado a la derecha */}
              <button
                type="button"
                className="md:hidden ml-auto inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100"
                aria-label="Abrir menú de navegación"
                aria-controls="mobile-drawer"
                aria-expanded={open}
                onClick={() => setOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* OVERLAY (fuera del header, opaco) */}
      {open && (
        <div
          className="fixed inset-0 z-[60] md:hidden bg-black/40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* DRAWER (fuera del header, fondo sólido sin blur) */}
      <aside
        id="mobile-drawer"
        className={`fixed top-0 left-0 z-[70] h-full w-80 max-w-[85vw] md:hidden
          bg-white shadow-xl transition-transform duration-300 transform-gpu
          ${open ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        {/* Cabecera del drawer con extremos pegados */}
        <div className="flex items-center justify-between px-3 py-3 border-b">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="font-extrabold text-xl tracking-tight"
          >
            Apolo
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Links de navegación */}
        <nav className="px-2 py-2">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block rounded-md px-3 py-2 text-base font-medium transition ${
                isActive(l.href)
                  ? "bg-gray-100 text-black"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Acciones del drawer */}
        <div className="mt-auto px-3 py-4 border-t space-y-2">
          {/* Sustituye por tu lógica real de sesión */}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-black text-white px-3 py-2 text-sm hover:bg-purple-700 transition"
          >
            <User className="h-4 w-4" />
            Acceder
          </Link>
        </div>
      </aside>
    </>
  );
}
