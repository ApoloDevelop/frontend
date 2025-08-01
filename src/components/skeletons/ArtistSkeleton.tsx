import React from "react";

export default function ArtistSkeleton() {
  return (
    <div className="container mx-auto relative px-2 md:px-8 lg:px-4">
      {/* Banner */}
      <div className="h-80 bg-white/60 rounded-md animate-pulse"></div>

      {/* Header: Avatar + Title */}
      <div className="flex items-center mt-[-32px] mb-8 relative">
        <div className="h-48 w-48 bg-gray-200 rounded-lg shadow-lg animate-pulse" />
        <div className="ml-6 flex-1">
          <div className="flex items-center space-x-4">
            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-28 animate-pulse" />
          </div>
          <div className="mt-2 h-4 bg-gray-200 rounded w-1/6 animate-pulse"></div>
        </div>
        <div className="ml-auto">
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        <div className="ml-4">
          <div className="h-10 w-28 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Main Columns */}
      <div className="flex gap-12">
        {/* Left Column */}
        <div className="w-2/3 space-y-8">
          {/* Ratings */}
          <div className="bg-white/80 p-6 rounded-lg shadow animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>

          {/* Biography */}
          <div className="bg-white/80 p-6 rounded-lg shadow space-y-3">
            <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          </div>

          {/* Recent Albums */}
          <div className="bg-white/80 p-6 rounded-lg shadow">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
            <div className="flex gap-4">
              <div className="h-28 w-28 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-28 w-28 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-28 w-28 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-28 w-28 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-28 w-28 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Related Artists */}
          <div className="bg-white/80 p-6 rounded-lg shadow">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
            <div className="flex gap-2 overflow-x-auto">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 bg-gray-200 rounded w-16 animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-1/3 flex flex-col gap-8">
          {/* Last Release */}
          <div className="bg-white/80 p-6 rounded-lg shadow flex items-center gap-4 animate-pulse">
            <div className="h-16 w-16 bg-gray-200 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>

          {/* Popular Songs */}
          <div className="bg-white/80 p-6 rounded-lg shadow space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
