import { ExploreCard } from "./ExploreCard";

interface ExploreSectionProps {
  title?: string;
  subtitle?: string;
}

export function ExploreSection({
  title = "Explora en profundidad",
  subtitle = "Conoce todo lo que tenemos para ofrecerte",
}: ExploreSectionProps) {
  const exploreItems = [
    {
      icon: "🎤",
      title: "Artistas",
      description: "Explora perfiles de tus artistas preferidos",
      href: "/explore?tab=artist",
      linkText: "Explorar artistas",
    },
    {
      icon: "💿",
      title: "Álbumes",
      description: "Encuentra nuevos álbumes y viejos clásicos",
      href: "/explore?tab=album",
      linkText: "Ver álbumes",
    },
    {
      icon: "🎵",
      title: "Canciones",
      description: "Busca y descubre tus canciones favoritas",
      href: "/explore?tab=track",
      linkText: "Buscar canciones",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-black/60 to-black/90 bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {exploreItems.map((item, index) => (
          <ExploreCard key={index} {...item} />
        ))}
      </div>
    </section>
  );
}
