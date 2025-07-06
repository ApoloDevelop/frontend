import { fetchAlbumByName } from "@/utils/spotify";
import Image from "next/image";

export default async function AlbumPage({
  params,
}: {
  params: { album: string };
}) {
  const album = await fetchAlbumByName(params.album);

  if (!album) return <div className="text-center">Álbum no encontrado.</div>;

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg">
      {/* Cabecera con cover art */}
      <div className="relative flex flex-col items-center border-b border-gray-200 pb-8 mb-8">
        <div className="w-full h-80 rounded-t-lg overflow-hidden relative">
          <Image
            src={album.images[0]?.url || "/default-cover.png"}
            alt="Cover Art"
            fill
            className="object-cover w-full h-80 opacity-30"
            priority
          />
        </div>
        <div className="absolute top-0 left-0 w-full h-80 flex flex-col items-center justify-center">
          <Image
            src={album.images[1]?.url || "/default-cover.png"}
            alt={album.name}
            width={180}
            height={180}
            className="rounded-lg shadow-lg mb-4 bg-white/80"
          />
          <h1 className="text-5xl font-bold text-gray-900 drop-shadow">
            {album.name}
          </h1>
          <h2 className="text-xl text-gray-700 mt-2">{album.artists.name}</h2>
          <p className="text-md text-gray-500">
            {new Date(album.release_date).toLocaleDateString()}
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
              {album.description || "No disponible."}
            </p>
          </section>
        </div>

        {/* Columna derecha */}
        <div className="w-1/3 flex flex-col gap-8">
          {/* Lista de canciones */}
          {/* <section>
            <h2 className="text-xl font-bold mb-2">Canciones</h2>
            <ol className="list-decimal list-inside space-y-1">
              {album.total_tracks > 0 ? (
                album.total_tracks.map((track: any, idx: number) => (
                  <li
                    key={track.id}
                    className="flex justify-between text-gray-700"
                  >
                    <span>{track.name}</span>
                    <span className="text-xs text-gray-500">
                      {track.duration}
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No disponible.</p>
              )}
            </ol>
          </section> */}
        </div>
      </div>
    </div>
  );
}
