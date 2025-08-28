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
    <div className="bg-white/80 rounded-2xl shadow p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4">
        {playlist?.images?.[0]?.url && (
          <div className="relative w-12 h-12">
            <Image
              src={playlist.images[0].url}
              alt={title}
              fill
              sizes="48px"
              className="rounded object-cover"
            />
          </div>
        )}
        <h3 className="text-xl font-bold">{title}</h3>
      </div>

      {!playlist ? (
        <p className="text-gray-500 text-center">Cargando…</p>
      ) : (
        <>
          <div className="divide-y">
            {playlist.tracks.slice(0, show).map((t, idx) => (
              <TrackRow key={`${t.id}-${idx}`} track={t} index={idx + 1} />
            ))}
          </div>

          {/* Controles */}
          <div className="mt-4 flex flex-col gap-3">
            <div className="text-xs text-gray-500 text-center">
              Mostrando {Math.min(show, total)} de {total}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onLess}
                disabled={!canLess}
                className="flex-1 rounded-lg border px-2 py-0.5 text-sm cursor-pointer hover:bg-black/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cargar 5 menos
              </button>

              <button
                onClick={onMore}
                disabled={!canMore}
                className="flex-1 rounded-lg border px-2 py-0.5 text-sm cursor-pointer hover:bg-black/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
