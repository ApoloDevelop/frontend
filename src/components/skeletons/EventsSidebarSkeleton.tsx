export function EventsSidebarSkeleton() {
  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow animate-pulse">
        <div className="h-8 w-48 rounded mb-4 bg-gray-200" />
        <div className="h-5 w-2/3 rounded bg-gray-200" />
        <div className="h-5 w-1/2 rounded mt-2 bg-gray-200" />
      </section>
      <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow animate-pulse">
        <div className="h-8 w-40 rounded mb-4 bg-gray-200" />
        <div className="space-y-2">
          <div className="h-5 w-full rounded bg-gray-200" />
          <div className="h-5 w-5/6 rounded bg-gray-200" />
          <div className="h-5 w-2/3 rounded bg-gray-200" />
        </div>
      </section>
    </div>
  );
}
