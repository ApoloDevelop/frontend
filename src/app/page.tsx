import { useLatestArticles } from "@/hooks/home";
import {
  HeroSection,
  NewsSection,
  TopChartsSection,
  ExploreSection,
} from "@/components/home";
import { PLAYLIST_IDS } from "@/constants/homeConstants";

export default async function Home() {
  // Trae las 5 últimas noticias
  const latest = await useLatestArticles(5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-white dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative">
        <div className="relative">
          <HeroSection />
          <NewsSection articles={latest} />
        </div>
      </div>

      {/* Sección de charts */}
      <TopChartsSection
        esId={PLAYLIST_IDS.SPAIN}
        globalId={PLAYLIST_IDS.GLOBAL}
      />

      {/* Sección de exploración */}
      <ExploreSection />
    </div>
  );
}
