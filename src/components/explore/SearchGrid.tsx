"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { slugify } from "@/utils/normalization";

type Props = {
  items: any[];
  type: "artist" | "album" | "track";
  data: {
    offset: number;
    limit: number;
    total: number;
    previous: string | null;
    next: string | null;
  } | null;
  loading: boolean;
  setOffset: (offset: number) => void;
};

export default function SearchGrid({
  items,
  type,
  data,
  loading,
  setOffset,
}: Props) {
  return (
    <div className="space-y-4">
      {loading && <p className="text-sm text-muted-foreground">Buscando…</p>}

      {/* GRID de resultados */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((it: any) => {
          if (type === "artist") {
            const pic = it.images?.[0]?.url || "/default-cover.png";
            const href = `/artists/${slugify(it.name)}`;
            return (
              <Link
                key={it.id}
                href={href}
                className="group rounded-xl overflow-hidden bg-white border hover:shadow"
              >
                <div className="aspect-square relative">
                  <Image
                    src={pic}
                    alt={it.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <div className="font-semibold truncate">{it.name}</div>
                  {it.genres?.length ? (
                    <div className="text-xs mt-1 text-muted-foreground truncate">
                      {it.genres.slice(0, 2).join(", ")}
                    </div>
                  ) : null}
                </div>
              </Link>
            );
          }

          if (type === "album") {
            const pic = it.images?.[0]?.url || "/default-cover.png";
            const primary = it.artists?.[0]?.name ?? "—";
            const href = `/albums/${slugify(primary)}/${slugify(it.name)}`;
            return (
              <Link
                key={it.id}
                href={href}
                className="group rounded-xl overflow-hidden bg-white border hover:shadow"
              >
                <div className="aspect-square relative">
                  <Image
                    src={pic}
                    alt={it.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <div className="font-semibold truncate">{it.name}</div>
                  <div className="text-xs mt-1 text-muted-foreground truncate">
                    {primary}
                  </div>
                </div>
              </Link>
            );
          }

          // track
          const pic = it.album?.images?.[0]?.url || "/default-cover.png";
          const primary = it.artists?.[0]?.name ?? "—";
          const href = `/songs/${slugify(primary)}/${slugify(
            it.album?.name ?? ""
          )}/${slugify(it.name)}`;
          return (
            <Link
              key={it.id}
              href={href}
              className="group rounded-xl overflow-hidden bg-white border hover:shadow"
            >
              <div className="aspect-square relative">
                <Image
                  src={pic}
                  alt={it.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <div className="font-semibold truncate">{it.name}</div>
                <div className="text-xs mt-1 text-muted-foreground truncate">
                  {primary} • {it.album?.name}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Paginación simple */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {items.length
            ? `${(data?.offset ?? 0) + 1}–${
                (data?.offset ?? 0) + items.length
              } de ${data?.total ?? 0}`
            : "No hay nada que ver por aquí"}
        </span>
        {items.length > 0 && (data?.previous || data?.next) && (
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!data?.previous}
              onClick={() =>
                setOffset(
                  Math.max(0, (data?.offset ?? 0) - (data?.limit ?? 12))
                )
              }
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!data?.next}
              onClick={() =>
                setOffset((data?.offset ?? 0) + (data?.limit ?? 12))
              }
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
