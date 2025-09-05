interface ArtistNotFoundProps {
  message?: string;
}

export default function ArtistNotFound({
  message = "Artista no encontrado.",
}: ArtistNotFoundProps) {
  return (
    <div className="container mx-auto py-20 text-center">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! 🎵</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <a
          href="/explore"
          className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Buscar artistas
        </a>
      </div>
    </div>
  );
}
