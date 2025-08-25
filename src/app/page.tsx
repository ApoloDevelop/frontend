// app/page.tsx
import Link from "next/link";
import { ArticlesService } from "@/services/articles.service";
import { NewsCarousel } from "@/components/news/NewsCarousel";

export default async function Home() {
  // Trae las 5 últimas (orden ya es por fecha desc en tu backend)
  const { data: latest } = await ArticlesService.list({ offset: 0, limit: 5 });

  return (
    <div className="min-h-screen">
      {/* Hero muy simple (puedes estilizar a tu gusto) */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Bienvenido a Apolo
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Tu plataforma musical para descubrir, compartir y conectar.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </section>

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
    </div>
  );
}
