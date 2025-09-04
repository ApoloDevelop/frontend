import Link from "next/link";

interface ExploreCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
  linkText: string;
}

function ExploreCard({
  icon,
  title,
  description,
  href,
  linkText,
}: ExploreCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-800/30 rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-300 mb-4">{description}</p>
      <Link
        href={href}
        className="block w-full border border-purple-200 bg-white text-black hover:bg-purple-50 dark:border-purple-700 dark:bg-slate-800 dark:text-white dark:hover:bg-purple-900/20 rounded-lg px-4 py-2 transition-all duration-200 font-medium text-center"
      >
        {linkText}
      </Link>
    </div>
  );
}

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
