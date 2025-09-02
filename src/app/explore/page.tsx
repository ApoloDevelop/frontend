"use client";

import { SearchTabs } from "@/components/explore";
import { useTabSearch, usePageLoading } from "@/hooks/explore";

export default function ExplorePage() {
  const { queries, updateQuery } = useTabSearch();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold">Explorar</h1>

      <SearchTabs
        queries={queries}
        onQueryChange={updateQuery}
        defaultValue="artist"
      />
    </div>
  );
}
