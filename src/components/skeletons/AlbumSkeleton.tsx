"use client";
import React from "react";

export default function AlbumSkeleton() {
  return (
    <div className="relative">
      {/* HERO */}
      <div className="relative h-72 mb-18 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/20 to-transparent pointer-events-none" />
      </div>

      {/* CONTENIDO */}
      <div className="relative -mt-16 pb-16">
        <div className="mx-auto max-w-6xl px-4">
          {/* Breadcrumb */}
          <div className="h-4 w-1/2 md:w-1/3 bg-gray-200 rounded animate-pulse mb-4" />

          <div className="grid grid-cols-12 gap-8 mt-6">
            {/* ASIDE STICKY */}
            <aside className="col-span-12 md:col-span-4 md:sticky md:top-24 space-y-4 self-start">
              {/* Título */}
              <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
              {/* Año */}
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />

              {/* Cover */}
              <div className="aspect-square w-full overflow-hidden rounded-2xl bg-gray-200 animate-pulse shadow-lg" />

              {/* Botón rate */}
              <div className="h-10 w-40 bg-gray-200 rounded-xl animate-pulse" />

              {/* Fila de acciones */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="h-10 w-28 bg-gray-200 rounded-xl animate-pulse" />
                <div className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse" />
                <div className="h-10 w-56 bg-gray-200 rounded-xl animate-pulse" />
              </div>
            </aside>

            {/* MAIN */}
            <main className="col-span-12 md:col-span-8 space-y-8">
              {/* Metadatos */}
              <header className="space-y-2">
                <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-1/3 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-1/4 bg-gray-200 rounded animate-pulse" />
              </header>

              {/* Pentagrama / Stats */}
              <div className="flex justify-end">
                <div className="h-36 w-full md:w-[460px] bg-gray-200 rounded-xl animate-pulse" />
              </div>

              {/* Tracklist */}
              <section>
                <div className="h-7 w-32 bg-gray-200 rounded animate-pulse mb-3" />
                <div className="rounded-xl border overflow-hidden">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[32px_1fr_auto] items-center gap-4 px-3 py-3 border-b last:border-b-0"
                    >
                      <div className="h-4 w-6 bg-gray-200 rounded animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
                      </div>
                      <div className="h-4 w-10 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </section>

              {/* Créditos */}
              <section className="pt-4 border-t">
                <div className="h-6 w-28 bg-gray-200 rounded animate-pulse mb-3" />
                <div className="space-y-2">
                  <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
