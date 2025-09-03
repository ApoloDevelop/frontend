// src/hooks/news/useTagPickerSearch.ts
"use client";

import { useEffect, useRef, useState } from "react";
import { SpotifyRepository } from "@/repositories/spotify.repository";

export function useTagPickerSearch(open: boolean) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [artists, setArtists] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<number | null>(null);

  // Reset state when modal opens
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

  // Search with debounce
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

  return {
    q,
    setQ,
    loading,
    artists,
    albums,
    tracks,
    inputRef,
  };
}
