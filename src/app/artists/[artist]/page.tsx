// app/artist/[artist]/page.tsx
import Image from "next/image";
import dayjs from "dayjs";
import {
  fetchArtistByName,
  fetchArtistAlbums,
  fetchArtistTopTracks,
  fetchArtistReleases,
  // fetchArtistBio,
} from "@/utils/spotify";
import {
  fetchMusicBrainzMatch,
  fetchSimilarByTags,
  MbArtist,
} from "@/utils/musicbrainz";

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ artist: string }>;
}) {
  const { artist } = await params;
  const artistData = await fetchArtistByName(artist);
  if (!artistData)
    return <div className="text-center py-20">Artista no encontrado.</div>;

  const [albums, topTracks, releases] = await Promise.all([
    fetchArtistAlbums(artistData.id),
    fetchArtistTopTracks(artistData.id),
    fetchArtistReleases(artistData.id), // <-- nuevo
  ]);

  // 3) Intento de emparejado MusicBrainz → MBID
  let mbid: string | null = null;
  try {
    mbid = await fetchMusicBrainzMatch(artistData.id, artistData.name);
  } catch (err) {
    console.warn("No se pudo emparejar en MusicBrainz:", err);
  }

  let similar: MbArtist[] = [];
  if (mbid) {
    try {
      similar = await fetchSimilarByTags(mbid, 4, 8, 6);
    } catch (e) {
      console.warn("Error tags-similar:", e);
    }
  }

  console.log(releases);

  const lastRelease = releases
    .slice()
    .sort(
      (a: { release_date: string }, b: { release_date: string }) =>
        new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
    )[0];
  // const bioAI = await fetchArtistBio(artist);

  return (
    <div className="container mx-auto relative">
      <div
        id="blurred-bg"
        className="fixed top-0 mt-16 left-0 right-0 h-80 w-screen -z-10 "
      >
        <Image
          src={artistData.images[0]?.url || "/default-cover.png"}
          alt={artistData.name}
          fill
          className="object-cover blur-sm"
        />
      </div>

      <div id="header" className="flex mt-32 items-center mb-16 relative z-10">
        <Image
          src={artistData.images[0]?.url || "/default-cover.png"}
          alt={artistData.name}
          width={200}
          height={200}
          className="rounded-lg shadow-lg"
        />
        <div className="ml-6">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">
            {artistData.name}
          </h1>
          <p className="text-lg text-gray-200">
            {artistData.genres.length
              ? artistData.genres.join(", ")
              : "Géneros no disponibles"}
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex gap-12 relative z-10">
        {/* Columna izquierda */}
        <div className="w-2/3 space-y-8">
          {/* Biografía */}
          <section className="bg-white/80 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-2">Biografía</h2>
            <p className="text-gray-700">No disponible</p>
          </section>

          {/* Álbumes recientes */}
          <section className="bg-white/80 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Álbumes recientes</h2>
            <div className="flex gap-4">
              {albums.map((alb: any) => (
                <div
                  key={alb.id}
                  className="w-1/5 flex flex-col items-center text-center "
                >
                  <Image
                    src={alb.images[0]?.url || "/default-cover.png"}
                    alt={alb.name}
                    width={112}
                    height={112}
                    className="rounded mb-2"
                  />
                  <p className="font-bold truncate w-full">{alb.name}</p>
                  <p className="text-sm text-gray-500 w-full">
                    {dayjs(alb.release_date).format("DD/MM/YYYY")}
                  </p>
                </div>
              ))}
            </div>
          </section>
          {/* NUEVA SECCIÓN: Artistas relacionados */}
          <section className="bg-white/80 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Artistas relacionados</h2>
            {similar.length ? (
              <ul className="flex gap-4 overflow-x-auto">
                {similar.map((a) => (
                  <li key={a.id} className="w-1/5 text-center">
                    {/* Aquí podrías usar fetchArtistByName(a.name) si quieres imagen */}
                    <p className="font-bold truncate">{a.name}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No se encontraron artistas similares por tags.</p>
            )}
          </section>
        </div>

        {/* Columna derecha */}
        <div className="w-1/3 flex flex-col gap-8">
          {/* Último lanzamiento */}
          <section className="bg-white/80 p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Último lanzamiento</h2>
            {lastRelease ? (
              <div className="flex items-center gap-4">
                <Image
                  src={lastRelease.images[0]?.url || "/default-cover.png"}
                  alt={lastRelease.name}
                  width={64}
                  height={64}
                  className="rounded"
                />
                <div>
                  <p className="font-bold">{lastRelease.name}</p>
                  <p className="text-sm text-gray-500">
                    {dayjs(lastRelease.release_date).format("DD/MM/YYYY")}
                  </p>
                  <p className="text-xs text-gray-600 capitalize">
                    {lastRelease.album_type}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No disponible.</p>
            )}
          </section>

          {/* Canciones populares */}
          <section className="bg-white/80 p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Canciones populares</h2>
            {topTracks.length ? (
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                {topTracks.map((tr: any) => (
                  <li key={tr.id} className="flex items-center gap-3">
                    <Image
                      src={tr.album?.images[0]?.url || "/default-cover.png"}
                      alt={tr.name}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                    <span>{tr.name}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-gray-500">No disponible.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
