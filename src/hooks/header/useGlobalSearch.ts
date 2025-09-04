import { useEffect, useRef, useState } from "react";
import { SpotifyRepository } from "@/repositories/spotify.repository";
import { UserService } from "@/services/user.service";

interface SearchResults {
  artists: any[];
  albums: any[];
  tracks: any[];
  users: any[];
}

export function useGlobalSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResults>({
    artists: [],
    albums: [],
    tracks: [],
    users: [],
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<number | null>(null);

  const resetState = () => {
    setQ("");
    setResults({
      artists: [],
      albums: [],
      tracks: [],
      users: [],
    });
    setLoading(false);
  };

  const closeSearch = () => {
    setOpen(false);
    resetState();
  };

  const openSearch = () => {
    setOpen(true);
    // Foco inmediato después de setState
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    });
  };

  // Auto-focus cuando se abre
  useEffect(() => {
    if (open) {
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
        setResults({
          artists: [],
          albums: [],
          tracks: [],
          users: [],
        });
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

        setResults({
          artists: spotifyRes.artists ?? [],
          albums: spotifyRes.albums ?? [],
          tracks: spotifyRes.tracks ?? [],
          users: usersRes ?? [],
        });
      } catch {
        setResults({
          artists: [],
          albums: [],
          tracks: [],
          users: [],
        });
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

  return {
    open,
    q,
    setQ,
    loading,
    results,
    inputRef,
    openSearch,
    closeSearch,
  };
}
