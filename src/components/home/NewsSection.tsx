import Link from "next/link";
import { NewsCarousel } from "@/components/news/NewsCarousel";
import { Button } from "@/components/ui/button";
import { Article } from "@/types/article";

interface NewsSectionProps {
  articles: Article[];
  title?: string;
  subtitle?: string;
}

export function NewsSection({
  articles,
  title = "Últimas Noticias",
  subtitle = "Mantente al día con lo último del mundo musical",
}: NewsSectionProps) {
  return (
    <section className="container mx-auto px-4 pb-16">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
          {title}
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-300">
          {subtitle}
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-slate-800/50 rounded-xl"></div>
        <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-purple-100/50 dark:border-purple-700/20">
          <NewsCarousel articles={articles} />
          <div className="flex justify-center mt-8">
            <Button className="bg-gradient-to-r from-black/60 to-black/90 hover:from-black/70 hover:to-black/80 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <Link href="/news" className="flex items-center gap-2">
                Ver todas las noticias
                <span className="text-lg">→</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
