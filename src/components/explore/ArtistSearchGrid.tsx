"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { slugify } from "@/utils/normalization";

type Props = {
  items: any[];
  data: {
    offset: number;
    limit: number;
    total: number;
    previous: string | null;
    next: string | null;
    _genreMatches?: number;
    _otherResults?: number;
  } | null;
  loading: boolean;
  setOffset: (offset: number) => void;
  genreFilter: string;
};

export default function ArtistSearchGrid({
  items,
  data,
  loading,
  setOffset,
  genreFilter,
}: Props) {
  // Separar los resultados para mostrar secciones
  const genreMatches: any[] = [];
  const otherResults: any[] = [];

  if (genreFilter.trim()) {
    items.forEach((artist) => {
      if (artist._isNoGenre) {
        otherResults.push(artist);
      } else {
        genreMatches.push(artist);
      }
    });
  }

  const showSections =
    genreFilter.trim() && (genreMatches.length > 0 || otherResults.length > 0);

  const renderArtistCard = (artist: any, isNoGenre = false) => {
    const pic = artist.images?.[0]?.url || "/default-cover.png";
    const href = `/artists/${slugify(artist.name)}`;

    return (
      <Link
        key={artist.id}
        href={href}
        className="group rounded-xl overflow-hidden bg-white border hover:shadow transition-shadow"
      >
        <div className="aspect-square relative">
          <Image src={pic} alt={artist.name} fill className="object-cover" />
        </div>
        <div className="p-3">
          <div className="font-semibold truncate">{artist.name}</div>
          <div className="text-xs mt-1 text-muted-foreground">
            {artist.genres?.length ? (
              <span className="truncate">
                {artist.genres.slice(0, 2).join(", ")}
              </span>
            ) : (
              isNoGenre && (
                <span className="italic text-gray-400">Género no definido</span>
              )
            )}
          </div>
          {artist.popularity && (
            <div className="text-xs mt-1">
              <span className="text-yellow-600">★</span>
              <span className="text-gray-500 ml-1">
                {artist.popularity}/100
              </span>
            </div>
          )}
        </div>
      </Link>
    );
  };

  return (
    <div className="space-y-6">
      {loading && <p className="text-sm text-muted-foreground">Buscando…</p>}

      {showSections ? (
        <>
          {/* Resultados que coinciden con el género */}
          {genreMatches.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Artistas de {genreFilter}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {genreMatches.map((artist) => renderArtistCard(artist))}
              </div>
            </div>
          )}

          {/* Otros resultados relevantes */}
          {otherResults.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-600">
                Otros resultados relevantes
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {otherResults.map((artist) => renderArtistCard(artist, true))}
              </div>
            </div>
          )}

          {genreMatches.length === 0 &&
            otherResults.length === 0 &&
            !loading && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron artistas para el género &quot;{genreFilter}
                &quot;
              </div>
            )}
        </>
      ) : (
        <>
          {/* Vista normal sin filtro de género */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((artist) => renderArtistCard(artist))}
          </div>

          {items.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No hay nada que ver por aquí
            </div>
          )}
        </>
      )}

      {/* Paginación */}
      {data && data.total > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {`${data.offset + 1}–${
              data.offset + items.length
            } de ${data.total}`}
          </span>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!data.previous}
              onClick={() => setOffset(Math.max(0, data.offset - data.limit))}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!data.next}
              onClick={() => setOffset(data.offset + data.limit)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
