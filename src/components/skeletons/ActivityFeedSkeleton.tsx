import React from "react";

export default function ActivityFeedSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {/* Activity Card Skeletons */}
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow overflow-hidden h-fit"
        >
          {/* Card Header */}
          <div className="p-4 pb-2">
            <div className="flex items-center gap-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Card Content */}
          <div className="px-4 pb-4 text-sm">
            {/* Item info section */}
            <div className="mb-3 flex items-center gap-3 p-2 -m-2">
              {/* Cover placeholder */}
              <div className="w-16 h-16 bg-gray-200 rounded-md animate-pulse shrink-0"></div>

              {/* Item details */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                {index % 3 === 0 && (
                  <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                )}
              </div>
            </div>

            {/* Content text (no es obligatorio) */}
            {index % 2 === 0 && (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg space-y-2">
                <div className="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-4/5 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-3/5 bg-gray-200 rounded animate-pulse"></div>
              </div>
            )}

            {/* Delete button (no es fijo) */}
            {index % 4 === 0 && (
              <div className="mt-3">
                <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
