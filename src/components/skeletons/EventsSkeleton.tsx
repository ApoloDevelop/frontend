import React from "react";

export default function EventsSkeleton() {
  return (
    <div className="container mx-auto">
      {/* HERO */}
      <div className="relative h-48 sm:h-64 md:h-72 lg:h-80 w-full mb-6 bg-gray-200 rounded-md animate-pulse" />

      {/* HEADER con avatar + título */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center mb-6 sm:mb-8">
        <div className="relative -mt-14 sm:-mt-20 md:-mt-28 z-10">
          <div className="rounded-lg shadow-lg w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-gray-200 animate-pulse" />
        </div>

        <div className="ml-0 sm:ml-6 mt-2 sm:mt-0 flex-1">
          <div className="h-10 bg-gray-200 rounded w-2/3 sm:w-1/3 animate-pulse" />
          <div className="mt-2 h-4 bg-gray-200 rounded w-24 animate-pulse" />
        </div>
      </div>

      {/* CONTENEDOR DE TABS + BUSCADOR + LISTA */}
      <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow mb-10">
        {/* Buscador */}
        <div className="mb-4">
          <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Tabs header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-24 rounded-md bg-gray-200 animate-pulse" />
          <div className="h-8 w-24 rounded-md bg-gray-200 animate-pulse" />
          <div className="ml-auto h-4 w-16 rounded bg-gray-200 animate-pulse" />
        </div>

        {/* Lista en una columna */}
        <ul className="space-y-3">
          {/* Card skeleton - Próximo */}
          <li>
            <article className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse" />
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-8 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="mt-2 h-3 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="shrink-0">
                  <div className="h-8 w-32 bg-gray-200 rounded-lg animate-pulse" />
                </div>
              </div>
            </article>
          </li>

          {/* Card skeleton - Próximo */}
          <li>
            <article className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse" />
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-8 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="mt-2 h-3 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="shrink-0">
                  <div className="h-8 w-28 bg-gray-200 rounded-lg animate-pulse" />
                </div>
              </div>
            </article>
          </li>

          {/* Card skeleton - Pasado (disabled: sin botón, atenuado) */}
          <li>
            <article className="bg-white/80 p-4 sm:p-6 rounded-lg shadow opacity-60 grayscale">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse" />
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-4 w-44 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-8 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="mt-2 h-3 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
                {/* sin botón de entradas */}
              </div>
            </article>
          </li>

          {/* Card skeleton - Pasado (disabled) */}
          <li>
            <article className="bg-white/80 p-4 sm:p-6 rounded-lg shadow opacity-60 grayscale">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="h-5 w-1/3 bg-gray-200 rounded animate-pulse" />
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-8 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="mt-2 h-3 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </article>
          </li>
        </ul>
      </section>
    </div>
  );
}
