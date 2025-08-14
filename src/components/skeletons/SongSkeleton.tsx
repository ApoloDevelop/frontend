// components/skeletons/SongSkeleton.tsx
"use client";
import React from "react";

export default function SongSkeleton() {
  return (
    <div className="relative">
      {/* HERO (versión song: altura baja) */}
      <div className="relative h-50 mb-18 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/20 to-transparent pointer-events-none" />
      </div>

      {/* CONTENIDO */}
      <div className="relative -mt-12 pb-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-12 gap-8">
            {/* ASIDE: portada + CTAs */}
            <aside className="col-span-12 md:col-span-4 md:sticky md:top-24 self-start space-y-4">
              {/* Título */}
              <div className="h-8 w-5/6 bg-gray-200 rounded animate-pulse" />

              {/* Cover */}
              <div className="aspect-square w-full overflow-hidden rounded-2xl bg-gray-200 animate-pulse shadow-lg" />

              {/* Metainformación comprimida (chips/lineas cortas) */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="h-4 w-14 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-5 rounded bg-gray-200 animate-pulse" />
              </div>

              {/* Botón de rate */}
              <div className="h-10 w-40 bg-gray-200 rounded-xl animate-pulse" />

              {/* Fila de acciones: favorito / añadir a lista / abrir en Spotify */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="h-10 w-28 bg-gray-200 rounded-xl animate-pulse" />
                <div className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse" />
                <div className="h-10 w-56 bg-gray-200 rounded-xl animate-pulse" />
              </div>
            </aside>

            {/* MAIN */}
            <main className="col-span-12 md:col-span-8 space-y-8">
              {/* Encabezado: artistas/fecha/géneros + badges BPM/Key */}
              <header className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="h-5 w-64 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 w-56 bg-gray-200 rounded animate-pulse" />
                </div>

                <div className="flex items-center gap-3">
                  {/* Badge BPM */}
                  <div className="min-w-16 rounded-xl bg-gray-100 px-3 py-2 text-center">
                    <div className="h-3 w-8 mx-auto mb-1 bg-gray-200 rounded animate-pulse" />
                    <div className="h-6 w-10 mx-auto bg-gray-200 rounded animate-pulse" />
                  </div>
                  {/* Badge Key */}
                  <div className="min-w-16 rounded-xl bg-gray-100 px-3 py-2 text-center">
                    <div className="h-3 w-8 mx-auto mb-1 bg-gray-200 rounded animate-pulse" />
                    <div className="h-6 w-10 mx-auto bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </header>

              {/* Scores (ancho fijado como en tu página) */}
              <section className="w-full lg:w-[737px]">
                <div className="h-36 w-full bg-gray-200 rounded-xl animate-pulse" />
              </section>

              {/* Letra */}
              <section>
                <div className="h-7 w-24 bg-gray-200 rounded animate-pulse mb-3" />
                <div className="min-h-48 w-full rounded-xl border bg-white p-4">
                  <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-4 w-full bg-gray-200 rounded animate-pulse"
                        style={{ width: `${85 - i * 7}%` }}
                      />
                    ))}
                  </div>
                </div>
              </section>

              {/* Créditos */}
              <section>
                <div className="h-7 w-28 bg-gray-200 rounded animate-pulse mb-3" />
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Compositores */}
                  <div className="rounded-xl border p-4 bg-white">
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-3" />
                    <div className="space-y-2">
                      <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                  {/* Productores */}
                  <div className="rounded-xl border p-4 bg-white">
                    <div className="h-5 w-28 bg-gray-200 rounded animate-pulse mb-3" />
                    <div className="space-y-2">
                      <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                  {/* Autores (span 2) */}
                  <div className="rounded-xl border p-4 bg-white md:col-span-2">
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-3" />
                    <div className="space-y-2">
                      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                  {/* Label / Distribuidora (span 2) */}
                  <div className="rounded-xl border p-4 bg-white md:col-span-2">
                    <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-3" />
                    <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </section>

              {/* En el álbum */}
              <section>
                <div className="h-7 w-32 bg-gray-200 rounded animate-pulse mb-3" />
                <div className="inline-flex items-center gap-4 rounded-xl border p-3 pr-5 bg-white">
                  <div className="h-16 w-16 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="min-w-0 space-y-2">
                    <div className="h-4 w-56 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-44 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
