// app/page.tsx
import Link from "next/link";
import { ArticlesService } from "@/services/articles.service";
import { NewsCarousel } from "@/components/news/NewsCarousel";
import { TopPlaylistsRow } from "@/components/charts/TopPlaylistsRow";
import { Button } from "@/components/ui/button";

export default async function Home() {
  // Trae las 5 últimas (orden ya es por fecha desc en tu backend)
  const { data: latest } = await ArticlesService.list({ offset: 0, limit: 5 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-white dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-900">
      {/* Hero Section con gradiente */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-purple-400/10 to-purple-600/5 dark:from-purple-400/10 dark:via-purple-300/15 dark:to-purple-400/10"></div>
        <div className="relative">
          {/* Header de bienvenida */}
          <section className="container mx-auto px-4 pt-12 pb-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 bg-clip-text text-transparent">
                Descubre tu música
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Explora las últimas noticias musicales y descubre qué está
                sonando en todo el mundo
              </p>
            </div>
          </section>

          {/* Carrusel de noticias */}
          <section className="container mx-auto px-4 pb-16">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
                Últimas Noticias
              </h2>
              <p className="text-center text-slate-600 dark:text-slate-300">
                Mantente al día con lo último del mundo musical
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-slate-800/50 rounded-xl"></div>
              <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-purple-100/50 dark:border-purple-700/20">
                <NewsCarousel articles={latest} />
                <div className="flex justify-center mt-8">
                  <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <Link href="/news" className="flex items-center gap-2">
                      Ver todas las noticias
                      <span className="text-lg">→</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Sección de charts con diseño mejorado */}
      <section className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/30 to-transparent dark:via-purple-900/20"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
              Lo más sonado
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              Descubre las canciones que están arrasando en España y el mundo
            </p>
          </div>

          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-purple-100/50 dark:border-purple-700/20">
            <TopPlaylistsRow
              esId="67Le7CMLY1hcfBpkHabEKb"
              globalId="5dokIeip4KXANkIm4JRwNx"
            />
          </div>
        </div>
      </section>

      {/* Sección de exploración */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
            Explora más contenido
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Descubre todo lo que tenemos para ofrecerte
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-800/30 rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="text-4xl mb-4">🎤</div>
            <h3 className="text-xl font-semibold mb-2 text-purple-700 dark:text-purple-300">
              Artistas
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Explora perfiles de tus artistas favoritos
            </p>
            <Button
              variant="outline"
              className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/20"
            >
              <Link href="/explore">Explorar artistas</Link>
            </Button>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-800/30 rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="text-4xl mb-4">💿</div>
            <h3 className="text-xl font-semibold mb-2 text-purple-700 dark:text-purple-300">
              Álbumes
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Descubre nuevos álbumes y clásicos
            </p>
            <Button
              variant="outline"
              className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/20"
            >
              <Link href="/explore">Ver álbumes</Link>
            </Button>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-800/30 rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="text-4xl mb-4">🎵</div>
            <h3 className="text-xl font-semibold mb-2 text-purple-700 dark:text-purple-300">
              Canciones
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Busca y reproduce tus canciones favoritas
            </p>
            <Button
              variant="outline"
              className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/20"
            >
              <Link href="/explore">Buscar canciones</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
