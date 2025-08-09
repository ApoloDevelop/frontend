import Image from "next/image";
import dayjs from "dayjs";
import {
  fetchArtistByName,
  fetchArtistAlbums,
  fetchArtistTopTracks,
  fetchArtistReleases,
  // fetchArtistBio,
} from "@/helpers/spotify";
import {
  ArtistDetails,
  fetchArtistDetails,
  fetchMusicBrainzMatch,
  fetchSimilarByTags,
  MbArtist,
} from "@/helpers/musicbrainz";
import Flag from "react-world-flags";
import { ArtistRatingClient } from "@/components/artist/RatingClient";
import { PentagramScores } from "@/components/artist/PentagramScores";
import { ReviewService } from "@/services/review.service";
import { ItemService } from "@/services/item.service";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { AddToListDialog } from "@/components/lists/AddToListDialog";
import Link from "next/link";

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ artist: string }>;
}) {
  const { artist: slug } = await params;
  const raw = slug.replace(/-/g, " ");
  const decoded = decodeURIComponent(raw);
  const artistName = decoded;
  const artistData = await fetchArtistByName(artistName);
  if (!artistData)
    return <div className="text-center py-20">Artista no encontrado.</div>;

  const reviewCounts = await ReviewService.getArtistReviewCounts(
    artistData.name
  );

  const item = await ItemService.findItemByTypeAndName(
    "artist",
    artistData.name
  );

  const [albums, topTracks, releases] = await Promise.all([
    fetchArtistAlbums(artistData.id),
    fetchArtistTopTracks(artistData.id),
    fetchArtistReleases(artistData.id),
  ]);

  let averages: { verified: number | null; unverified: number | null } = {
    verified: null,
    unverified: null,
  };
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/reviews/artist/average?artistName=${encodeURIComponent(
        artistData.name
      )}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      averages = await res.json();
    }
  } catch (e) {
    // Ignorar error
  }

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

  let details: ArtistDetails | null = null;
  if (mbid) {
    try {
      details = await fetchArtistDetails(mbid);
    } catch (e) {
      console.warn("No se pudieron obtener detalles:", e);
    }
  }

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
        className="absolute top-0 -mt-24 left-0 right-0 h-80 w-full -z-10 "
      >
        <Image
          src={artistData.images[0]?.url || "/default-cover.png"}
          alt={artistData.name}
          fill
          className="object-cover blur-sm"
        />
      </div>

      <div id="header" className="flex mt-32 items-center mb-8 relative z-10">
        <Image
          src={artistData.images[0]?.url || "/default-cover.png"}
          alt={artistData.name}
          width={200}
          height={200}
          className="rounded-lg shadow-lg mt-35 object-cover"
          style={{
            minWidth: 200,
            minHeight: 200,
            maxWidth: 200,
            maxHeight: 200,
          }}
        />
        <div className="ml-6 flex-1 translate-y-30">
          <div className="flex items-center gap-4">
            <h1 className="text-5xl font-bold text-black drop-shadow-lg">
              {artistData.name}
            </h1>
            {/* Botón de valoración */}
            <div className="inline-block ml-4">
              <ArtistRatingClient artistName={artistData.name} />
            </div>
          </div>
          <p className="text-lg text-gray-600">
            {details?.type === "Person"
              ? "Artista"
              : details?.type === "Group"
              ? "Grupo"
              : ""}
          </p>
        </div>
        {/* Botón de favorito, alineado a la derecha */}
        <div className="ml-auto flex items-center gap-2 translate-y-27">
          <FavoriteButton artistName={artistData.name} userId={1} height={48} />
          <AddToListDialog
            userId={1}
            height={48}
            itemType="artist"
            artistName={artistData.name}
          />
        </div>
      </div>
      {/* Contenido principal */}
      <div className="flex gap-12 relative z-10">
        {/* Columna izquierda */}
        <div className="w-2/3 space-y-8">
          <section className="bg-white/80 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-2">Valoraciones</h2>
            <PentagramScores
              verified={averages.verified}
              unverified={averages.unverified}
              verifiedCount={reviewCounts.verifiedCount}
              unverifiedCount={reviewCounts.unverifiedCount}
              itemId={item?.itemId ?? null}
              artistName={artistData.name}
            />
          </section>
          {/* Biografía actualizada */}
          <section className="bg-white/80 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-2">Biografía</h2>

            {details ? (
              <>
                <p>
                  <strong>Nombre completo:</strong> {details.fullName}
                </p>
                <p>
                  <strong>Fecha de nacimiento:</strong>{" "}
                  {details.birthDate
                    ? dayjs(details.birthDate).format("DD/MM/YYYY")
                    : "Desconocida"}
                </p>
                <p>
                  <strong>Lugar de nacimiento:</strong>{" "}
                  {details.birthPlace || "Desconocido"},
                  {details.birthCountryCode ? (
                    <Flag
                      code={details.birthCountryCode}
                      className="w-5 h-5 ml-2 inline-block"
                    />
                  ) : (
                    "—"
                  )}
                </p>
                <p>
                  <strong>Género/s:</strong>{" "}
                  {artistData.genres.length
                    ? artistData.genres.join(", ")
                    : "No disponibles"}
                </p>
              </>
            ) : (
              <p className="text-gray-700">No se pudo cargar la biografía.</p>
            )}
          </section>

          {/* Álbumes recientes */}
          <section className="bg-white/80 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Álbumes recientes</h2>
            <div className="flex gap-4">
              {albums.map((alb: any) => (
                <Link
                  key={alb.id}
                  href={`/albums/${artistData.name
                    .replace(/\s+/g, "-")
                    .toLowerCase()}/${alb.name
                    .replace(/\s+/g, "-")
                    .toLowerCase()}`}
                  className="w-1/5 flex flex-col items-center text-center group"
                >
                  <div className="relative">
                    <Image
                      src={alb.images[0]?.url || "/default-cover.png"}
                      alt={alb.name}
                      width={112}
                      height={112}
                      className="rounded mb-2 transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                  <p className="font-bold truncate w-full transition-transform duration-200 group-hover:scale-105">
                    {alb.name}
                  </p>
                  <p className="text-sm text-gray-500 w-full">
                    {dayjs(alb.release_date).format("DD/MM/YYYY")}
                  </p>
                </Link>
              ))}
            </div>
          </section>
          {/* Artistas relacionados */}
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
