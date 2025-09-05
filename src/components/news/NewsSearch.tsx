"use client";

import { useEffect, useMemo, useState, useRef, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

function NewsSearchContent({ placeholder = "Buscar por título o tag…" }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const initial = sp.get("q") ?? "";
  const [open, setOpen] = useState(Boolean(initial));
  const [value, setValue] = useState(initial);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(sp?.toString());
      if (value.trim()) {
        params.set("q", value.trim());
        params.delete("offset");
      } else {
        params.delete("q");
        params.delete("offset");
      }
      router.replace(`${pathname}?${params.toString()}`);
    }, 300);
    return () => clearTimeout(t);
  }, [value, pathname]);

  // Focus automático cuando se abre el buscador
  useEffect(() => {
    if (open) {
      // Delay para esperar que termine la animación
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [open]);

  const clear = () => setValue("");

  return (
    <div className="flex items-center gap-2 mt-4">
      <div
        className={`relative flex items-center transition-all duration-300 ${
          open ? "w-64 md:w-80" : "w-10"
        }`}
      >
        <button
          type="button"
          aria-label="Abrir buscador"
          className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer"
          onClick={() => {
            setOpen(true);
            // Foco inmediato después de setState
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                inputRef.current?.focus();
              });
            });
          }}
        >
          <Search className="h-4 w-4" />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className={`w-full rounded-full border pl-8 pr-8 py-1.5 text-sm transition-opacity ${
            open
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          aria-label="Buscar noticias"
        />

        {open && value && (
          <button
            type="button"
            aria-label="Limpiar búsqueda"
            onClick={clear}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && (
        <button
          type="button"
          className="text-sm text-gray-600 hover:underline cursor-pointer"
          onClick={() => {
            setValue("");
            setOpen(false);
            const params = new URLSearchParams(sp?.toString());
            params.delete("q");
            params.delete("offset");
            router.replace(`${pathname}?${params.toString()}`);
          }}
        >
          Cancelar
        </button>
      )}
    </div>
  );
}

export function NewsSearch({ placeholder = "Buscar por título o tag…" }) {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md">
          <div className="animate-pulse h-10 bg-gray-200 rounded"></div>
        </div>
      }
    >
      <NewsSearchContent placeholder={placeholder} />
    </Suspense>
  );
}
