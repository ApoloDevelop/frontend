import { fetchArtistByName } from "@/utils/spotify";
import Image from "next/image";

export default async function ArtistPage({
  params,
}: {
  params: { artist: string };
}) {
  const artist = await fetchArtistByName(params.artist);

  if (!artist) return <div className="text-center">Artista no encontrado.</div>;

  // Simulación de datos para el ejemplo
  // const albums = artist.albums?.slice(0, 5) || [];
  // const lastRelease = albums[0];
  // const popularSongs = artist.popularSongs?.slice(0, 5) || [];

  return (
    <div className="container mx-auto p-8">
      {/* Cover Art de fondo */}
      <div className="absolute inset-0 h-80 w-full -z-10">
        <Image
          src="/default-cover.png"
          alt="Cover Art"
          fill
          className="object-cover w-full h-80 blur-xs"
          priority
        />
      </div>

      {/* Cabecera */}
      <div className="flex flex-row items-center pt-8 pb-6 space-x-6 border-gray-200 relative z-10">
        <Image
          src={artist.images[0]?.url || "/default-cover.png"}
          alt={artist.name}
          width={250}
          height={250}
          className="rounded-lg shadow-lg top-15 mb-4 relative"
        />
        <h1 className="text-5xl font-bold text-gray-900 ml-15">
          {artist.name}
        </h1>
        <h2 className="text-xl text-gray-600">
          {artist.genres?.join(", ") || "Géneros no disponibles"}
        </h2>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-row mt-8 gap-12">
        {/* Columna izquierda */}
        <div className="w-2/3">
          {/* Biografía */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Biografía</h2>
            <p className="text-lg text-gray-700">
              {artist.biography || "No disponible."}
            </p>
          </section>

          {/* Álbumes recientes */}
          {/* <section>
            <h2 className="text-2xl font-bold mb-4">Álbumes recientes</h2>
            <div className="flex flex-row gap-4">
              {albums.map((album: any) => (
                <div key={album.id} className="w-28 text-center">
                  <Image
                    src={album.images[0]?.url || "/default-cover.png"}
                    alt={album.name}
                    width={112}
                    height={112}
                    className="rounded mb-2"
                  />
                  <p className="font-medium truncate">{album.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(album.release_date).getFullYear()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div> */}

          {/* Columna derecha */}
          {/* <div className="w-1/3 flex flex-col gap-8"> */}
          {/* Último lanzamiento */}
          {/* <section>
            <h2 className="text-xl font-bold mb-2">Último lanzamiento</h2>
            {lastRelease ? (
              <div className="flex items-center gap-3">
                <Image
                  src={lastRelease.images[0]?.url || "/default-cover.png"}
                  alt={lastRelease.name}
                  width={64}
                  height={64}
                  className="rounded"
                />
                <div>
                  <p className="font-semibold">{lastRelease.name}</p>
                  <p className="text-xs text-gray-500">
                    {lastRelease.release_date}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No disponible.</p>
            )}
          </section> */}

          {/* Canciones populares */}
          {/* <section>
            <h2 className="text-xl font-bold mb-2">Canciones populares</h2>
            <ol className="list-decimal list-inside space-y-1">
              {popularSongs.length > 0 ? (
                popularSongs.map((song: any, idx: number) => (
                  <li key={song.id} className="text-gray-700">
                    {song.name}
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
