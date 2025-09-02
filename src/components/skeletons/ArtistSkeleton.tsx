import React from "react";

export default function ArtistSkeleton() {
  return (
    <div className="container mx-auto">
      {/* Hero Banner */}
      <div className="relative h-48 sm:h-64 md:h-72 lg:h-80 w-full mb-6">
        <div className="h-full bg-gray-200 animate-pulse"></div>
      </div>

      {/* Header: Avatar + Title */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center mb-6 sm:mb-8">
        {/* Artist Image */}
        <div className="relative -mt-14 sm:-mt-20 md:-mt-28 z-10">
          <div className="rounded-lg shadow-lg w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-gray-200 animate-pulse" />
        </div>

        {/* Artist Info */}
        <div className="ml-0 sm:ml-6 mt-2 sm:mt-0 flex-1">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="h-12 bg-gray-200 rounded w-64 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-28 animate-pulse" />
          </div>
          <div className="mt-2 h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>

        {/* Action Buttons */}
        <div className="ml-0 sm:ml-auto mt-3 sm:mt-2 flex flex-wrap items-center gap-2">
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-10 w-28 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 relative z-10">
        {/* Left Column - Main Content */}
        <div className="w-full lg:w-2/3 space-y-6 sm:space-y-8">
          {/* Ratings */}
          <div className="bg-white/80 p-4 sm:p-6 rounded-lg shadow animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>

          {/* Biography */}
          <div className="bg-white/80 p-4 sm:p-6 rounded-lg shadow space-y-3">
            <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full sm:w-2/3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 sm:w-1/2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 sm:w-1/3 animate-pulse"></div>
          </div>

          {/* Recent Albums */}
          <div className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
            <div className="flex gap-2 sm:gap-4 overflow-x-auto">
              <div className="h-20 w-20 sm:h-28 sm:w-28 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
              <div className="h-20 w-20 sm:h-28 sm:w-28 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
              <div className="h-20 w-20 sm:h-28 sm:w-28 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
              <div className="h-20 w-20 sm:h-28 sm:w-28 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
              <div className="h-20 w-20 sm:h-28 sm:w-28 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
            </div>
          </div>

          {/* Related Artists */}
          <div className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
            <div className="flex gap-2 overflow-x-auto">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 bg-gray-200 rounded w-16 animate-pulse flex-shrink-0"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6 sm:gap-8 lg:sticky lg:top-24">
          {/* Last Release */}
          <div className="bg-white/80 p-4 sm:p-6 rounded-lg shadow flex items-center gap-4 animate-pulse">
            <div className="h-16 w-16 bg-gray-200 rounded flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>

          {/* Popular Songs */}
          <div className="bg-white/80 p-4 sm:p-6 rounded-lg shadow space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Events Sidebar Skeleton */}
          <div className="bg-white/80 p-4 sm:p-6 rounded-lg shadow space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
