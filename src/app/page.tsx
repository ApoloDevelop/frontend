// app/page.tsx
import Link from "next/link";
import { ArticlesService } from "@/services/articles.service";
import { NewsCarousel } from "@/components/news/NewsCarousel";
import { TopPlaylistsRow } from "@/components/charts/TopPlaylistsRow";

export default async function Home() {
  // Trae las 5 últimas (orden ya es por fecha desc en tu backend)
  const { data: latest } = await ArticlesService.list({ offset: 0, limit: 5 });

  return (
    <div className="min-h-screen">
      {/* Carrusel de noticias */}
      <section className="container mx-auto px-4 pb-16">
        <NewsCarousel articles={latest} />
        <div className="mt-6 text-center">
          <Link
            href="/news"
            className="inline-block px-4 py-2 rounded-lg border hover:bg-black/5 transition"
          >
            Ver todas las noticias →
          </Link>
        </div>
      </section>

      {/* Top charts */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-4 text-center">Lo más sonado</h2>
        <TopPlaylistsRow
          esId="67Le7CMLY1hcfBpkHabEKb"
          globalId="5dokIeip4KXANkIm4JRwNx"
        />
      </section>
    </div>
  );
}
