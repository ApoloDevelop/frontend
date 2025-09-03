"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { SpotifyRepository } from "@/repositories/spotify.repository";
import { AnimatePresence, motion } from "framer-motion";
import { slugify } from "@/utils/normalization";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [artists, setArtists] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<number | null>(null);

  const resetState = () => {
    setQ("");
    setArtists([]);
    setAlbums([]);
    setTracks([]);
    setLoading(false);
  };

  const closeSearch = () => {
    setOpen(false);
    resetState(); // ← limpia query y resultados al cerrar
  };

  useEffect(() => {
    if (open) {
      // Delay más largo para esperar que termine la animación
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [open]);

  // Buscar con debounce
  useEffect(() => {
    if (!open) return;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(async () => {
      if (!q.trim() || q.trim().length < 2) {
        setArtists([]);
        setAlbums([]);
        setTracks([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await SpotifyRepository.searchAll(q, {
          limit: 4,
          market: "ES",
        });
        setArtists(res.artists ?? []);
        setAlbums(res.albums ?? []);
        setTracks(res.tracks ?? []);
      } catch {
        setArtists([]);
        setAlbums([]);
        setTracks([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [q, open]);

  // Cerrar al click fuera
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const el = e.target as HTMLElement;
      if (!el.closest?.("[data-global-search]")) closeSearch();
    }
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  // Cerrar con ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeSearch();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const hasAny = artists.length + albums.length + tracks.length > 0;

  return (
    <div className="relative" data-global-search>
      <AnimatePresence initial={false} mode="wait">
        {!open ? (
          <motion.button
            key="icon"
            aria-label="Buscar"
            className="p-2 rounded-md hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setOpen(true);
              // Foco inmediato después de setState
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  inputRef.current?.focus();
                });
              });
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.12 }}
          >
            <Search size={18} />
          </motion.button>
        ) : (
          <motion.div
            key="input"
            className="flex items-center gap-2 rounded-md border bg-white px-2"
            initial={{ width: 40, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 34 }}
          >
            <Search size={16} className="text-gray-500 shrink-0" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar en Apolo…"
              className="flex-1 bg-transparent outline-none text-sm py-2"
              aria-label="Buscar en Apolo"
            />
            <button
              className="p-1 rounded hover:bg-gray-100 cursor-pointer"
              onClick={closeSearch}
              aria-label="Cerrar buscador"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (loading || hasAny || q.trim().length >= 2) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-[min(92vw,560px)] z-[60] rounded-xl border bg-white shadow-xl"
          >
            <div className="p-2 divide-y">
              {loading && (
                <div className="px-2 py-3 text-sm text-gray-500">Buscando…</div>
              )}

              {!loading && !hasAny && q.trim().length >= 2 && (
                <div className="px-2 py-3 text-sm text-gray-500">
                  Sin resultados
                </div>
              )}

              {artists.length > 0 && (
                <section className="py-2">
                  <div className="px-2 pb-1 text-xs font-semibold uppercase text-gray-500">
                    Artistas
                  </div>
                  <ul className="max-h-64 overflow-auto">
                    {artists.map((a) => (
                      <li key={a.id}>
                        <Link
                          href={`/artists/${slugify(a.name)}`}
                          className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-black/5"
                          onClick={closeSearch}
                        >
                          <Image
                            src={a.images?.[0]?.url || "/default-cover.png"}
                            alt=""
                            width={32}
                            height={32}
                            className="rounded object-cover"
                          />
                          <span className="truncate">{a.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {albums.length > 0 && (
                <section className="py-2">
                  <div className="px-2 pb-1 text-xs font-semibold uppercase text-gray-500">
                    Álbumes
                  </div>
                  <ul className="max-h-64 overflow-auto">
                    {albums.map((al) => (
                      <li key={al.id}>
                        <Link
                          href={`/albums/${slugify(
                            al.artists?.[0]?.name ?? ""
                          )}/${slugify(al.name)}`}
                          className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-black/5"
                          onClick={closeSearch}
                        >
                          <Image
                            src={al.images?.[0]?.url || "/default-cover.png"}
                            alt=""
                            width={32}
                            height={32}
                            className="rounded object-cover"
                          />
                          <div className="min-w-0">
                            <div className="truncate">{al.name}</div>
                            <div className="text-xs text-gray-500 truncate">
                              {(al.artists ?? [])
                                .map((x: any) => x.name)
                                .join(", ")}
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {tracks.length > 0 && (
                <section className="py-2">
                  <div className="px-2 pb-1 text-xs font-semibold uppercase text-gray-500">
                    Canciones
                  </div>
                  <ul className="max-h-64 overflow-auto">
                    {tracks.map((t) => (
                      <li key={t.id}>
                        <Link
                          href={`/songs/${slugify(
                            t.artists?.[0]?.name ?? ""
                          )}/${slugify(t.album?.name ?? "")}/${slugify(
                            t.name
                          )}`}
                          className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-black/5"
                          onClick={closeSearch}
                        >
                          <Image
                            src={
                              t.album?.images?.[0]?.url || "/default-cover.png"
                            }
                            alt=""
                            width={32}
                            height={32}
                            className="rounded object-cover"
                          />
                          <div className="min-w-0">
                            <div className="truncate">{t.name}</div>
                            <div className="text-xs text-gray-500 truncate">
                              {(t.artists ?? [])
                                .map((x: any) => x.name)
                                .join(", ")}{" "}
                              • {t.album?.name}
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
