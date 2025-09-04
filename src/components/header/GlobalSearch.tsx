"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { SpotifyRepository } from "@/repositories/spotify.repository";
import { UserService } from "@/services/user.service";
import { AnimatePresence, motion } from "framer-motion";
import { slugify } from "@/utils/normalization";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [artists, setArtists] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    users: true,
    artists: true,
    albums: true,
    tracks: true,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<number | null>(null);

  const resetState = () => {
    setQ("");
    setArtists([]);
    setAlbums([]);
    setTracks([]);
    setUsers([]);
    setLoading(false);
  };

  const closeSearch = () => {
    setOpen(false);
    resetState(); // ← limpia query y resultados al cerrar
  };

  const toggleFilter = (filterKey: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [filterKey]: !prev[filterKey] }));
  };

  const toggleAllFilters = () => {
    const allActive = Object.values(filters).every(Boolean);
    const newState = !allActive;
    setFilters({
      users: newState,
      artists: newState,
      albums: newState,
      tracks: newState,
    });
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
        setUsers([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [spotifyRes, usersRes] = await Promise.all([
          SpotifyRepository.searchAll(q, {
            limit: 4,
            market: "ES",
          }),
          UserService.searchUsers(q, 4),
        ]);

        setArtists(spotifyRes.artists ?? []);
        setAlbums(spotifyRes.albums ?? []);
        setTracks(spotifyRes.tracks ?? []);
        setUsers(usersRes ?? []);
      } catch {
        setArtists([]);
        setAlbums([]);
        setTracks([]);
        setUsers([]);
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

  const hasAny =
    (users.length > 0 && filters.users) ||
    (artists.length > 0 && filters.artists) ||
    (albums.length > 0 && filters.albums) ||
    (tracks.length > 0 && filters.tracks);

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
            <div className="p-2 divide-y max-h-[80vh] overflow-y-auto">
              {loading && (
                <div className="px-2 py-3 text-sm text-gray-500">Buscando…</div>
              )}

              {/* Filtros */}
              {!loading && q.trim().length >= 2 && (
                <div className="px-2 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-semibold uppercase text-gray-500">
                      Filtros
                    </div>
                    <button
                      onClick={toggleAllFilters}
                      className="text-xs text-purple-600 hover:text-purple-800 underline cursor-pointer"
                    >
                      {Object.values(filters).every(Boolean)
                        ? "Deseleccionar todo"
                        : "Seleccionar todo"}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      {
                        key: "artists" as const,
                        label: "Artistas",
                        count: artists.length,
                      },
                      {
                        key: "albums" as const,
                        label: "Álbumes",
                        count: albums.length,
                      },
                      {
                        key: "tracks" as const,
                        label: "Canciones",
                        count: tracks.length,
                      },
                      {
                        key: "users" as const,
                        label: "Usuarios",
                        count: users.length,
                      },
                    ].map(({ key, label, count }) => (
                      <button
                        key={key}
                        onClick={() => toggleFilter(key)}
                        className={`cursor-pointer px-3 py-1 text-xs rounded-full border transition-colors hover:bg-purple-300 ${
                          filters[key]
                            ? "bg-purple-100 border-purple-300 text-purple-700"
                            : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {label} {count > 0 && `(${count})`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!loading && !hasAny && q.trim().length >= 2 && (
                <div className="px-2 py-3 text-sm text-gray-500">
                  {users.length > 0 ||
                  artists.length > 0 ||
                  albums.length > 0 ||
                  tracks.length > 0
                    ? "Sin resultados con los filtros seleccionados"
                    : "Sin resultados"}
                </div>
              )}

              {artists.length > 0 && filters.artists && (
                <section className="py-2">
                  <div className="px-2 pb-1 text-xs font-semibold uppercase text-gray-500">
                    Artistas
                  </div>
                  <ul className="max-h-64 overflow-y-auto">
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

              {albums.length > 0 && filters.albums && (
                <section className="py-2">
                  <div className="px-2 pb-1 text-xs font-semibold uppercase text-gray-500">
                    Álbumes
                  </div>
                  <ul className="max-h-64 overflow-y-auto">
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

              {tracks.length > 0 && filters.tracks && (
                <section className="py-2">
                  <div className="px-2 pb-1 text-xs font-semibold uppercase text-gray-500">
                    Canciones
                  </div>
                  <ul className="max-h-64 overflow-y-auto">
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

              {users.length > 0 && filters.users && (
                <section className="py-2">
                  <div className="px-2 pb-1 text-xs font-semibold uppercase text-gray-500">
                    Usuarios
                  </div>
                  <ul className="max-h-64 overflow-y-auto">
                    {users.map((u) => (
                      <li key={u.id}>
                        <Link
                          href={`/users/${u.username}`}
                          className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-black/5"
                          onClick={closeSearch}
                        >
                          <Image
                            src={u.profile_pic || "/default-cover.png"}
                            alt=""
                            width={32}
                            height={32}
                            className="rounded-full object-cover"
                          />
                          <div className="min-w-0">
                            <div className="truncate font-medium">
                              @{u.username}
                            </div>
                            {u.fullname && (
                              <div className="text-xs text-gray-500 truncate">
                                {u.fullname}
                              </div>
                            )}
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
