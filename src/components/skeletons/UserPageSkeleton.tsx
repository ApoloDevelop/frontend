import React from "react";

export default function UserPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cover Photo */}
      <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 bg-gray-200 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-100/10"></div>
      </div>

      {/* Botón Añadir post - Posicionado a la derecha, debajo del cover */}
      <div className="flex justify-end px-6 mt-4">
        <div className="h-8 w-28 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Profile Photo */}
      <div className="relative left-6 -top-30 -mb-30 w-[180px] h-[180px]">
        <div className="w-[180px] h-[180px] rounded-full border-4 border-white bg-gray-200 animate-pulse"></div>
      </div>

      {/* User Info */}
      <div className="flex flex-col items-start px-6 mt-4 space-y-4">
        {/* Fullname con badge de rol */}
        <div className="flex items-center gap-2 w-full">
          <div className="flex items-center">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
            {/* Badge placeholder */}
            <div className="ml-2 h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex-grow"></div>
          {/* Follow button placeholder */}
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 animate-pulse"></div>
          {/* Social media icons */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Username */}
        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>

        {/* Biography */}
        <div className="space-y-2 w-full">
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Joined date */}
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>

        {/* External URL si existe */}
        <div className="h-4 w-56 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Follow Counters */}
      <div className="px-6 mt-4">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Edit button */}
      <div className="flex px-6 mt-4">
        <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Activity Feed */}
      <div className="px-6 mt-8 space-y-6">
        {/* Activity Feed Header (invisible pero mantiene el espacio) */}
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>

        {/* Activity Posts */}
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 space-y-4">
            {/* Post Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Post Content */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-3/5 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Media (if present) */}
            {index % 2 === 0 && (
              <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center gap-4 pt-2">
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-18 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}

        {/* Load more button placeholder */}
        <div className="flex justify-center mt-8">
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Bottom padding */}
      <div className="pb-16"></div>
    </div>
  );
}
