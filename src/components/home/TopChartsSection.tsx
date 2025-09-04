import { TopPlaylistsRow } from "@/components/charts/TopPlaylistsRow";

interface TopChartsSectionProps {
  esId: string;
  globalId: string;
  title?: string;
  subtitle?: string;
}

export function TopChartsSection({
  esId,
  globalId,
  title = "Lo más sonado",
  subtitle = "Descubre las canciones que están arrasando en España y el mundo",
}: TopChartsSectionProps) {
  return (
    <section className="relative py-16">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/30 to-transparent dark:via-purple-900/20"></div>
      <div className="relative container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-black/60 to-black/90 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-purple-100/50 dark:border-purple-700/20">
          <TopPlaylistsRow esId={esId} globalId={globalId} />
        </div>
      </div>
    </section>
  );
}
