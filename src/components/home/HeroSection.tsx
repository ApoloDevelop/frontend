interface HeroSectionProps {
  title?: string;
  subtitle?: string;
}

export function HeroSection({
  title = "Descubre tu música",
  subtitle = "Explora, comparte y opina sobre tu música favorita en Apolo.",
}: HeroSectionProps) {
  return (
    <section className="container mx-auto px-4 pt-12 pb-8 mb-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-black/80 via-black/70 to-black/90 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
