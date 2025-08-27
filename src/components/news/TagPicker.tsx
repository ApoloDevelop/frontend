"use client";

import { useEffect, useRef, useState } from "react";
import { SpotifyRepository } from "@/repositories/spotify.repository";
import Image from "next/image";
import { TagDraft } from "@/types/article";

export function TagPicker({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (t: TagDraft) => void;
}) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [artists, setArtists] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setArtists([]);
      setAlbums([]);
      setTracks([]);
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      const term = q.trim();
      if (term.length < 2) {
        setArtists([]);
        setAlbums([]);
        setTracks([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await SpotifyRepository.searchAll(term, {
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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* modal */}
      <div className="relative z-[201] w-[min(92vw,900px)] max-h-[85vh] rounded-2xl bg-white shadow-2xl border overflow-hidden">
        {/* header */}
        <div className="flex items-center gap-3 p-3 border-b">
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Busca artista, álbum o canción…"
            className="flex-1 rounded-md border px-3 py-2 outline-none"
            aria-label="Buscar para añadir tag"
          />
          <button
            className="rounded-md border px-3 py-2 hover:bg-black/5"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>

        {/* body */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-4 p-3 overflow-auto">
          {/* Artistas */}
          <div className="md:border-r md:pr-3">
            <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">
              Artistas
            </h4>
            {loading && <p className="text-sm text-gray-500">Buscando…</p>}
            {!loading && artists.length === 0 && q.trim().length >= 2 && (
              <p className="text-sm text-gray-500">Sin resultados</p>
            )}
            <ul className="space-y-2">
              {artists.map((a) => (
                <li key={a.id}>
                  <button
                    className="w-full flex items-center gap-3 rounded-lg border p-2 hover:bg-black/5 text-left"
                    onClick={() => {
                      onAdd({ type: "artist", name: a.name });
                      onClose();
                    }}
                  >
                    <Image
                      src={a.images?.[0]?.url || "/default-cover.png"}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded object-cover"
                    />
                    <div>
                      <div className="font-medium">{a.name}</div>
                      <div className="text-xs text-gray-500">Artista</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Álbumes */}
          <div className="md:border-r md:px-3">
            <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">
              Álbumes
            </h4>
            {loading && <p className="text-sm text-gray-500">Buscando…</p>}
            {!loading && albums.length === 0 && q.trim().length >= 2 && (
              <p className="text-sm text-gray-500">Sin resultados</p>
            )}
            <ul className="space-y-2">
              {albums.map((al) => (
                <li key={al.id}>
                  <button
                    className="w-full flex items-center gap-3 rounded-lg border p-2 hover:bg-black/5 text-left"
                    onClick={() => {
                      const mainArtist = al.artists?.[0]?.name ?? "";
                      onAdd({
                        type: "album",
                        name: al.name,
                        artistName: mainArtist,
                      });
                      onClose();
                    }}
                  >
                    <Image
                      src={al.images?.[0]?.url || "/default-cover.png"}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded object-cover"
                    />
                    <div className="min-w-0">
                      <div className="font-medium truncate">{al.name}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {(al.artists ?? []).map((x: any) => x.name).join(", ")}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Canciones */}
          <div className="md:pl-3">
            <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">
              Canciones
            </h4>
            {loading && <p className="text-sm text-gray-500">Buscando…</p>}
            {!loading && tracks.length === 0 && q.trim().length >= 2 && (
              <p className="text-sm text-gray-500">Sin resultados</p>
            )}
            <ul className="space-y-2">
              {tracks.map((t) => (
                <li key={t.id}>
                  <button
                    className="w-full flex items-center gap-3 rounded-lg border p-2 hover:bg-black/5 text-left"
                    onClick={() => {
                      const mainArtist = t.artists?.[0]?.name ?? "";
                      onAdd({
                        type: "track",
                        name: t.name,
                        artistName: mainArtist,
                        albumName: t.album?.name ?? undefined,
                      });
                      onClose();
                    }}
                  >
                    <Image
                      src={t.album?.images?.[0]?.url || "/default-cover.png"}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded object-cover"
                    />
                    <div className="min-w-0">
                      <div className="font-medium truncate">{t.name}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {(t.artists ?? []).map((x: any) => x.name).join(", ")}
                        {t.album?.name ? ` • ${t.album.name}` : ""}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
