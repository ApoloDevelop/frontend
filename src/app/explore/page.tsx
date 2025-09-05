"use client";

import { SearchTabs } from "@/components/explore";
import { useTabSearch } from "@/hooks/explore";
import { TabKind } from "@/hooks/explore/useTabSearch";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function ExplorePageContent() {
  const { queries, updateQuery } = useTabSearch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKind>("artist");

  // Leer el parámetro 'tab' de la URL al montar el componente
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["artist", "album", "track", "user"].includes(tabParam)) {
      setActiveTab(tabParam as TabKind);
    }
  }, [searchParams]);

  // Manejar el cambio de tab y actualizar la URL
  const handleTabChange = (newTab: TabKind) => {
    setActiveTab(newTab);

    // Actualizar la URL sin recargar la página
    const url = new URL(window.location.href);
    url.searchParams.set("tab", newTab);
    router.replace(url.pathname + url.search, { scroll: false });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold">Explorar</h1>

      <SearchTabs
        queries={queries}
        onQueryChange={updateQuery}
        value={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ExplorePageContent />
    </Suspense>
  );
}
