import { fetchSongByName } from "@/helpers/spotify";
import Image from "next/image";

export default async function SongPage({
  params,
}: {
  params: { track: string };
}) {
  const song = await fetchSongByName(params.track);

  if (!song) return <div className="text-center">Canción no encontrada.</div>;

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg">
      {/* Cabecera con cover art */}
      <div className="relative flex flex-col items-center border-b border-gray-200 pb-8 mb-8">
        <div className="w-full h-80 rounded-t-lg overflow-hidden relative">
          <Image
            src={song.album.images[0]?.url || "/default-cover.png"}
            alt="Cover Art"
            fill
            className="object-cover w-full h-80 opacity-30"
            priority
          />
        </div>
        <div className="absolute top-0 left-0 w-full h-80 flex flex-col items-center justify-center">
          <Image
            src={song.album.images[0]?.url || "/default-cover.png"}
            alt={song.name}
            width={180}
            height={180}
            className="rounded-lg shadow-lg mb-4 bg-white/80"
          />
          <h1 className="text-5xl font-bold text-gray-900 drop-shadow">
            {song.name}
          </h1>
          <h2 className="text-xl text-gray-700 mt-2">
            {song.artists
              .map((artist: { name: any }) => artist.name)
              .join(", ")}
          </h2>
          {/* <p className="text-md text-gray-500">{song.genres.join(", ")}</p> */}
          <p className="text-md text-gray-500">
            {new Date(song.album.release_date).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-row mt-8 gap-12">
        {/* Columna izquierda */}
        <div className="w-2/3">
          {/* Descripción */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Descripción</h2>
            <p className="text-lg text-gray-700">
              {song.description || "No disponible."}
            </p>
          </section>
        </div>

        {/* Columna derecha */}
        <div className="w-1/3 flex flex-col gap-8">
          {/* Detalles de la canción */}
          <section>
            <h2 className="text-xl font-bold mb-2">Detalles</h2>
            <ul className="text-gray-700 space-y-1">
              <li>
                <span className="font-semibold">Álbum: </span>
                {song.album.name}
              </li>
              <li>
                <span className="font-semibold">Duración: </span>
                {song.duration_ms
                  ? `${Math.floor(song.duration_ms / 60000)}:${(
                      (song.duration_ms % 60000) /
                      1000
                    )
                      .toFixed(0)
                      .padStart(2, "0")}`
                  : "Desconocida"}
              </li>
              <li>
                <span className="font-semibold">Fecha de lanzamiento: </span>
                {new Date(song.album.release_date).toLocaleDateString()}
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
