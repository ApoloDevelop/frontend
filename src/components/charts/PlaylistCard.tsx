"use client";

import Image from "next/image";
import TrackRow from "./TrackRow";
import { PlaylistLite } from "@/types/charts";

type Props = {
  title: string;
  playlist: PlaylistLite | null;
  show: number;
  onMore: () => void;
  onLess: () => void;
  min?: number;
};

export default function PlaylistCard({
  title,
  playlist,
  show,
  onMore,
  onLess,
  min = 5,
}: Props) {
  const total = playlist?.tracks?.length ?? 0;
  const canMore = playlist ? show < total : false;
  const canLess = show > min;
  return (
    <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100/50 dark:border-purple-700/20 p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        {playlist?.images?.[0]?.url && (
          <div className="relative w-12 h-12">
            <Image
              src={playlist.images[0].url}
              alt={title}
              fill
              sizes="48px"
              className="rounded-lg object-cover border border-purple-100 dark:border-purple-700/30"
            />
          </div>
        )}
        <h3 className="text-xl font-bold bg-gradient-to-r from-black/60 to-black/90 bg-clip-text text-transparent">
          {title}
        </h3>
      </div>

      {!playlist ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-purple-600 dark:text-purple-300 mt-2">Cargando…</p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-purple-100 dark:divide-purple-700/30">
            {playlist.tracks.slice(0, show).map((t, idx) => (
              <TrackRow key={`${t.id}-${idx}`} track={t} index={idx + 1} />
            ))}
          </div>

          {/* Controles */}
          <div className="mt-6 flex flex-col gap-3">
            <div className="text-xs text-black/70 dark:text-purple-300/70 text-center font-medium">
              Mostrando {Math.min(show, total)} de {total}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onLess}
                disabled={!canLess}
                className="flex-1 rounded-lg border border-purple-200 dark:border-purple-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-black/80 dark:text-purple-300 font-medium shadow-sm hover:shadow-md"
              >
                Cargar 5 menos
              </button>

              <button
                onClick={onMore}
                disabled={!canMore}
                className="flex-1 rounded-lg border border-purple-200 dark:border-purple-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-black/80 dark:text-purple-300 font-medium shadow-sm hover:shadow-md"
              >
                Cargar 5 más
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
