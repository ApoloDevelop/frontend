import React from "react";

interface SearchResultsSkeletonProps {
  count?: number;
}

export default function SearchResultsSkeleton({
  count = 12,
}: SearchResultsSkeletonProps) {
  return (
    <div className="space-y-4">
      {/* Grid de resultados */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="space-y-3 group">
            {/* Imagen */}
            <div className="aspect-square w-full bg-gray-200 rounded-lg animate-pulse shadow-sm" />

            {/* Contenido */}
            <div className="space-y-2">
              {/* Título principal */}
              <div
                className="h-4 bg-gray-200 rounded animate-pulse"
                style={{ width: `${Math.random() * 40 + 60}%` }}
              />

              {/* Subtítulo/descripción */}
              <div
                className="h-3 bg-gray-200 rounded animate-pulse"
                style={{ width: `${Math.random() * 30 + 40}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Botones de paginación skeleton */}
      <div className="flex justify-center items-center space-x-4 mt-8">
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}
