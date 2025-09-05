import React from "react";

export default function NewArticleSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Título + descripción */}
      <div className="mb-6">
        <div className="h-8 w-56 bg-gray-200 rounded animate-pulse mb-3" />
        <div className="h-4 w-80 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Card contenedora */}
      <div className="rounded-2xl border bg-white p-5">
        <div className="space-y-5">
          {/* Campo: Título */}
          <div className="space-y-2">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
          </div>

          {/* HeroImageUploader (16:9) */}
          <div className="space-y-2">
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="w-full overflow-hidden rounded-xl border bg-white p-3">
              <div className="aspect-[16/9] w-full rounded-lg bg-gray-200 animate-pulse" />
              <div className="mt-3 flex items-center gap-3">
                <div className="h-9 w-28 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-9 w-28 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-9 w-36 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>

          {/* Editor WYSIWYG: toolbar + área */}
          <div className="space-y-2">
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="rounded-lg border overflow-hidden bg-white">
              {/* Toolbar simulada */}
              <div className="flex flex-wrap items-center gap-2 p-2 border-b">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-7 w-7 bg-gray-200 rounded animate-pulse"
                  />
                ))}
                <div className="ml-auto h-7 w-28 bg-gray-200 rounded animate-pulse" />
              </div>
              {/* Área del editor */}
              <div className="p-4">
                <div className="space-y-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-4 bg-gray-200 rounded animate-pulse"
                      style={{ width: `${92 - i * 6}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="h-3 w-64 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Caja de error (placeholder) */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
            <div className="h-4 w-52 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Botones */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-10 w-28 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
