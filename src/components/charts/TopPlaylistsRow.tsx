"use client";

import { useEffect, useState } from "react";
import { SpotifyRepository } from "@/repositories/spotify.repository";
import PlaylistCard from "./PlaylistCard";
import { PlaylistLite } from "@/types/charts";

export function TopPlaylistsRow({
  esId,
  globalId,
}: {
  esId: string;
  globalId: string;
}) {
  const [es, setEs] = useState<PlaylistLite | null>(null);
  const [global, setGlobal] = useState<PlaylistLite | null>(null);
  const [showEs, setShowEs] = useState(5);
  const [showGlobal, setShowGlobal] = useState(5);
  const [error, setError] = useState<string | null>(null);

  const MIN_SHOW = 5;
  const STEP = 5;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [pEs, pGlobal] = await Promise.all([
          SpotifyRepository.fetchPlaylist(esId),
          SpotifyRepository.fetchPlaylist(globalId),
        ]);
        if (!mounted) return;
        setEs(pEs);
        setGlobal(pGlobal);
      } catch {
        if (!mounted) return;
        setError("No se pudieron cargar las listas de éxitos.");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [esId, globalId]);

  if (error) {
    return (
      <div className="container mx-auto px-4">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700/30 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <div className="self-start">
        <PlaylistCard
          title="Top 50: España"
          playlist={es}
          show={showEs}
          onMore={() => setShowEs((n) => n + STEP)}
          onLess={() => setShowEs((n) => Math.max(MIN_SHOW, n - STEP))}
        />
      </div>

      <div className="self-start">
        <PlaylistCard
          title="Top 50: Global"
          playlist={global}
          show={showGlobal}
          onMore={() => setShowGlobal((n) => n + STEP)}
          onLess={() => setShowGlobal((n) => Math.max(MIN_SHOW, n - STEP))}
        />
      </div>
    </div>
  );
}
