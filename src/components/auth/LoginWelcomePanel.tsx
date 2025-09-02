import Welcome from "@/components/home/Welcome";

export default function LoginWelcomePanel() {
  return (
    <div className="relative p-8 sm:p-10 md:p-12 bg-gradient-to-br from-purple-50 via-white to-purple-50 border-l border-zinc-200">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-purple-300/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />

      <Welcome
        variant="panel"
        title="Descubre Apolo"
        subtitle="Explora rankings, noticias, reseñas verificadas y recomendaciones según tus gustos."
        showLogin={false}
        showRegister
        className="relative z-10"
      />

      <ul className="relative z-10 mt-8 space-y-3 text-sm text-zinc-700">
        <li>• Puntúa artistas, álbumes y canciones con reseñas verificadas.</li>
        <li>• Sigue giras cerca de ti y guarda favoritos.</li>
        <li>• Descubre datos de tus canciones preferidas.</li>
      </ul>
    </div>
  );
}
