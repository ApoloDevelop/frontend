import React from "react";

export default function ExploreSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      {/* Título */}
      <div className="h-8 md:h-10 w-48 bg-gray-200 rounded animate-pulse" />

      {/* Pestañas */}
      <div className="w-full space-y-4">
        {/* TabsList */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-9 w-20 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </div>

        {/* Input de búsqueda */}
        <div className="relative w-full">
          <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
        </div>

        {/* Grid de resultados skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-3">
              {/* Imagen */}
              <div className="aspect-square w-full bg-gray-200 rounded-lg animate-pulse" />
              {/* Título */}
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              {/* Subtítulo */}
              <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
