// components/skeletons/ArticlePageSkeleton.tsx
import React from "react";

export default function ArticlePageSkeleton() {
  return (
    <div className="container mx-auto">
      {/* HERO */}
      <div className="relative h-56 sm:h-72 md:h-80 w-full mb-6">
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      </div>

      {/* Cabecera */}
      <header className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center mb-6 sm:mb-8 px-4">
        <div className="ml-0 sm:ml-6 mt-2 sm:mt-0 flex-1">
          <div className="h-9 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-4 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-4 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        <div className="ml-0 sm:ml-auto mt-3 sm:mt-2 flex flex-wrap items-center gap-2 pr-4">
          <div className="h-10 w-40 rounded-xl border bg-gray-100 animate-pulse" />
        </div>
      </header>

      {/* Contenido + Sidebar */}
      <div className="grid grid-cols-12 gap-6 px-4 pb-16">
        {/* MAIN */}
        <main className="col-span-12 lg:col-span-8 space-y-8">
          {/* Contenido (prose) */}
          <article className="prose max-w-none">
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="h-6 w-1/2 bg-gray-200 rounded animate-pulse"
                />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`p1-${i}`}
                  className="h-4 bg-gray-200 rounded animate-pulse"
                  style={{ width: `${95 - i * 4}%` }}
                />
              ))}
              <div className="h-64 w-full bg-gray-200 rounded-xl animate-pulse" />
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`p2-${i}`}
                  className="h-4 bg-gray-200 rounded animate-pulse"
                  style={{ width: `${92 - i * 3.5}%` }}
                />
              ))}
            </div>
          </article>

          {/* Tags */}
          <section className="pt-6 border-t">
            <div className="h-6 w-28 bg-gray-200 rounded animate-pulse mb-3" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-7 w-24 rounded-full bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          </section>

          {/* Comentarios */}
          <section className="pt-6 border-t">
            <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-3" />

            {/* Formulario (placeholder) */}
            <div className="rounded-2xl border bg-white p-4 mb-4">
              <div className="h-24 w-full bg-gray-200 rounded-lg animate-pulse mb-3" />
              <div className="flex items-center gap-3">
                <div className="h-10 w-28 bg-gray-200 rounded-xl animate-pulse" />
                <div className="h-10 w-24 bg-gray-200 rounded-xl animate-pulse" />
              </div>
            </div>

            {/* Lista de comentarios */}
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl border bg-white p-4">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-1" />
                      <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-11/12 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-10/12 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-8/12 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* SIDEBAR */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <div className="rounded-2xl border p-5 bg-white">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="space-y-2">
              <div className="h-4 w-10/12 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-8/12 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-7/12 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-16 w-full bg-gray-200 rounded-xl animate-pulse" />
              <div className="h-16 w-full bg-gray-200 rounded-xl animate-pulse" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
