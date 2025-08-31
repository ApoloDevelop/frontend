"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, User, ChevronDown, LogOut, Power } from "lucide-react";
import { GlobalSearch } from "./GlobalSearch";
import { useAuthUser } from "@/hooks/home/useAuthUser";
import { clearSession } from "@/lib/auth";
import { AuthUser } from "@/types/auth";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/news", label: "Noticias" },
  { href: "/explore", label: "Explorar" },
];

export function HeaderClient({
  initialUser,
}: {
  initialUser: AuthUser | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuthUser(initialUser); // 👈 hidrata con snapshot del servidor

  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Cerrar con ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setMenuOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const t = e.target as Node;
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(t) &&
        btnRef.current &&
        !btnRef.current.contains(t)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

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
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  const handleLogout = () => {
    clearSession(); // o: localStorage.removeItem("token"); localStorage.removeItem("user");
    setMenuOpen(false);
    setOpen(false);
    router.replace("/login");
    router.refresh();
  };

  return (
    <>
      {/* HEADER full-bleed */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-100">
        <div className="w-full">
          <div className="h-14 sm:h-16 grid grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center">
            {/* Brand IZQUIERDA */}
            <div className="pl-3 sm:pl-4 justify-self-start">
              <Link
                href="/"
                className="block font-extrabold text-xl sm:text-2xl tracking-tight"
                aria-label="Apolo - Inicio"
              >
                Apolo
              </Link>
            </div>

            {/* Nav centrado (desktop) */}
            <nav className="hidden md:flex justify-center gap-6 justify-self-center">
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

            {/* Acciones DERECHA */}
            <div className="pr-3 sm:pr-4 flex items-center justify-self-end">
              {/* Desktop actions */}
              <div className="hidden md:flex items-center gap-2">
                <GlobalSearch />

                {!user && (
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-md bg-black text-white px-3 py-2 text-sm hover:bg-purple-700 transition"
                  >
                    <User className="h-4 w-4" />
                    Acceder
                  </Link>
                )}

                {user && (
                  <div className="relative">
                    <button
                      ref={btnRef}
                      type="button"
                      onClick={() => setMenuOpen((v) => !v)}
                      aria-haspopup="menu"
                      aria-expanded={menuOpen}
                      className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition
                                  bg-black text-white hover:bg-purple-700 cursor-pointer`}
                    >
                      <User className="h-4 w-4" />
                      Mi perfil
                      <ChevronDown className="h-4 w-4 opacity-80" />
                    </button>

                    {menuOpen && (
                      <div
                        ref={menuRef}
                        role="menu"
                        className="absolute right-0 mt-2 w-44 rounded-md border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 overflow-hidden"
                      >
                        <Link
                          href={`/users/${user.username}`}
                          onClick={() => setMenuOpen(false)}
                          role="menuitem"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-800 hover:bg-gray-50"
                        >
                          <User className="h-4 w-4" />
                          Mi perfil
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          role="menuitem"
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          Cerrar sesión
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Botón hamburguesa (mobile) */}
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

      {/* OVERLAY (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-[60] md:hidden bg-black/40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* DRAWER (mobile) */}
      <aside
        id="mobile-drawer"
        className={`fixed top-0 left-0 z-[70] h-full w-80 max-w-[85vw] md:hidden
          bg-white shadow-xl transition-transform duration-300 transform-gpu
          ${open ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        {/* Cabecera del drawer */}
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
          {!user && (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-black text-white px-3 py-2 text-sm hover:bg-purple-700 transition"
            >
              <User className="h-4 w-4" />
              Acceder
            </Link>
          )}

          {user && (
            <>
              <Link
                href={`/users/${user.username}`}
                onClick={() => setOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-black text-white px-3 py-2 text-sm hover:bg-purple-700 transition"
              >
                <User className="h-4 w-4" />
                Mi perfil
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-red-200 text-red-700 px-3 py-2 text-sm hover:bg-red-50 transition"
              >
                <Power className="h-4 w-4" />
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
