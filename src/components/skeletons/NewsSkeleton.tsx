// components/skeletons/NewsPageSkeleton.tsx
"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";

function CardSkeleton() {
  return (
    <article className="min-w-0 rounded-xl overflow-hidden border bg-white">
      <div className="relative w-full aspect-[16/9]">
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      </div>
      <div className="p-4">
        <div className="h-5 w-5/6 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-4 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </article>
  );
}

export default function NewsSkeleton() {
  const sp = useSearchParams();
  const off = Number(sp?.get("offset") ?? 0);
  const hasHero = useMemo(() => !Number.isFinite(off) || off <= 0, [off]);
  const gridCount = hasHero ? 6 : 9;

  return (
    <div className="container mx-auto px-4 overflow-x-clip">
      {/* Cabecera + CTA */}
      <div className="flex items-center justify-between mt-6 mb-4">
        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse" />
      </div>

      {/* DESTACADO (sólo en primera página) */}
      {hasHero && (
        <section className="relative mb-8 rounded-2xl overflow-hidden">
          <div className="group block relative h-[360px] sm:h-[420px] md:h-[480px] rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="max-w-3xl space-y-3">
                <div className="h-8 sm:h-10 w-5/6 bg-white/40 rounded animate-pulse" />
                <div className="flex flex-wrap items-center gap-3">
                  <div className="h-4 w-24 bg-white/40 rounded animate-pulse" />
                  <div className="h-4 w-4 rounded-full bg-white/40 animate-pulse" />
                  <div className="h-4 w-32 bg-white/40 rounded animate-pulse" />
                  <div className="h-4 w-4 rounded-full bg-white/40 animate-pulse" />
                  <div className="h-4 w-28 bg-white/40 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* GRID */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="grid gap-6 grid-cols-1 sm:[grid-template-columns:repeat(2,minmax(0,1fr))] xl:[grid-template-columns:repeat(3,minmax(0,1fr))] 2xl:[grid-template-columns:repeat(3,minmax(0,1fr))]">
            {Array.from({ length: gridCount }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>

          {/* PAGINACIÓN */}
          <div className="flex items-center justify-center gap-3 my-8">
            {!hasHero && (
              <div className="px-10 py-3 rounded-lg border bg-gray-50">
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            )}
            <div className="px-10 py-3 rounded-lg border bg-gray-50">
              <div className="h-5 w-28 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
