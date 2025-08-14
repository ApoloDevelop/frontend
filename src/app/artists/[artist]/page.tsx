import Image from "next/image";
import dayjs from "dayjs";
import {
  fetchArtistByName,
  fetchArtistAlbums,
  fetchArtistTopTracks,
  fetchArtistReleases,
} from "@/helpers/spotify";
import {
  ArtistDetails,
  fetchArtistDetails,
  fetchMusicBrainzMatch,
  fetchSimilarByTags,
  MbArtist,
} from "@/helpers/musicbrainz";
import Flag from "react-world-flags";
import { RatingClient } from "@/components/reviews/RatingClient";
import { Scores } from "@/components/reviews/Scores";
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

  return (
    <div className="container mx-auto">
      <div
        id="hero"
        className="relative h-48 sm:h-64 md:h-72 lg:h-80 w-full mb-6"
      >
        <Image
          src={artistData.images[0]?.url || "/default-cover.png"}
          alt={artistData.name}
          fill
          className="object-cover blur-sm"
          priority
        />
      </div>

      <div
        id="header"
        className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center mb-6 sm:mb-8"
      >
        <div className="relative -mt-14 sm:-mt-20 md:-mt-28 z-10">
          <Image
            src={artistData.images[0]?.url || "/default-cover.png"}
            alt={artistData.name}
            width={200}
            height={200}
            className="rounded-lg object-cover shadow-lg w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48"
          />
        </div>
        <div className="ml-0 sm:ml-6 mt-2 sm:mt-0 flex-1">
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-5xl font-bold text-black">{artistData.name}</h1>
            <div className="inline-block mt-2">
              <RatingClient name={artistData.name} type="artist" userId={1} />
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

        <div className="ml-0 sm:ml-auto mt-3 sm:mt-2 flex flex-wrap items-center gap-2">
          <FavoriteButton type="artist" name={artistData.name} userId={1} />
          <AddToListDialog
            userId={1}
            itemType="artist"
            name={artistData.name}
          />
        </div>
      </div>
      {/* Contenido principal */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 relative z-10">
        {/* Columna izquierda */}
        <div className="w-full lg:w-2/3 space-y-6 sm:space-y-8">
          <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
            <h2 className="text-3xl font-bold mb-2">Valoraciones</h2>
            <Scores
              verified={averages.verified}
              unverified={averages.unverified}
              verifiedCount={reviewCounts.verifiedCount}
              unverifiedCount={reviewCounts.unverifiedCount}
              itemId={item?.itemId ?? null}
              name={artistData.name}
              variant="inline"
            />
          </section>
          {/* Biografía */}
          <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
            <h2 className="mb-4 text-3xl font-bold">Biografía</h2>
            {details ? (
              <div className="grid grid-cols-1 gap-x-8 gap-y-2 text-lg sm:grid-cols-2">
                <div>
                  <span className="font-semibold">Nombre completo:</span>{" "}
                  {details.fullName ?? "Desconocido"}
                </div>
                <div>
                  <span className="font-semibold">Fecha de nacimiento:</span>{" "}
                  {details.birthDate
                    ? dayjs(details.birthDate).format("DD/MM/YYYY")
                    : "Desconocida"}
                </div>
                <div className="col-span-1 sm:col-span-2 flex items-center gap-2">
                  <span className="font-semibold">Lugar de nacimiento:</span>
                  <span>{details.birthPlace || "Desconocido"}</span>
                  {details.birthCountryCode ? (
                    <Flag code={details.birthCountryCode} className="h-5 w-5" />
                  ) : null}
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <span className="font-semibold">Género/s:</span>{" "}
                  {artistData.genres?.length
                    ? artistData.genres.join(", ")
                    : "No disponibles"}
                </div>
              </div>
            ) : (
              <p className="text-gray-700">No se pudo cargar la biografía.</p>
            )}
          </section>

          {/* Álbumes recientes */}
          <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
            <h2 className="mb-4 text-3xl font-bold">Álbumes recientes</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {albums.map((alb: any) => (
                <Link
                  key={alb.id}
                  href={`/albums/${slug}/${alb.name
                    .replace(/\s+/g, "-")
                    .toLowerCase()}`}
                  className="group"
                  scroll
                >
                  <div className="relative overflow-hidden rounded-lg">
                    <Image
                      src={alb.images[0]?.url || "/default-cover.png"}
                      alt={alb.name}
                      width={300}
                      height={300}
                      sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 20vw"
                      className="aspect-square object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-2 w-full truncate font-medium">{alb.name}</p>
                  <p className="w-full text-sm text-gray-500">
                    {dayjs(alb.release_date).format("DD/MM/YYYY")}
                  </p>
                </Link>
              ))}
            </div>
          </section>
          {/* Artistas relacionados */}
          <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
            <h2 className="mb-4 text-3xl font-bold">Artistas relacionados</h2>
            {similar.length ? (
              <ul className="flex gap-4 overflow-x-auto">
                {similar.map((a) => (
                  <li key={a.id} className="w-40 flex-none text-center">
                    <p className="truncate font-semibold">{a.name}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">
                No se encontraron artistas similares por tags.
              </p>
            )}
          </section>
        </div>

        {/* Columna derecha */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6 sm:gap-8 lg:sticky lg:top-24">
          {/* Último lanzamiento */}
          <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
            <h2 className="text-3xl font-bold mb-4">Último lanzamiento</h2>
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
          <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
            <h2 className="text-3xl font-bold mb-4">Canciones populares</h2>
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
