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
} from "@/helpers/musicbrainz";
import { RatingClient } from "@/components/reviews/RatingClient";
import { Scores } from "@/components/reviews/Scores";
import { ReviewService } from "@/services/review.service";
import { ItemService } from "@/services/item.service";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { AddToListDialog } from "@/components/lists/AddToListDialog";
import { SongstatsService } from "@/services/songstats.service";
import { RelatedArtists } from "@/components/artist/RelatedArtists";
import { LatestAlbums } from "@/components/artist/LatestAlbums";
import { ArtistBio } from "@/components/artist/ArtistBio";
import { mockArtistData } from "@/mocks/mockSongstats";
import { deslugify } from "@/helpers/normalization";
import { LatestRelease } from "@/components/artist/LatestRelease";
import { PopularSongs } from "@/components/artist/PopularSongs";
import { NextEvent } from "@/components/artist/NextEvent";

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ artist: string }>;
}) {
  type EventData = {
    title: string | null;
    date: string | null;
    link: string | null;
    city: string | null;
    region: string | null;
    countryCode: string | null;
  };

  const { artist: slug } = await params;
  const raw = deslugify(slug);
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

  // const info = await SongstatsService.getArtistInfo(artistData.id);
  const info = mockArtistData;
  const bio = info?.bio || null;
  const genres = info?.genres || [];
  const relatedArtists = info?.related_artists || [];

  let nextEvent: EventData | null = null;

  const events = await SongstatsService.getArtistEventInfo(artistData.id);
  if (events?.upcoming?.length) {
    // ordenar por fecha ascendente y quedarnos con el próximo >= hoy
    const today = new Date();
    const sorted = events.upcoming
      .filter((e) => e?.date)
      .sort(
        (a, b) =>
          new Date(a.date as string).getTime() -
          new Date(b.date as string).getTime()
      );

    nextEvent =
      sorted.find((e) => new Date(e.date as string) >= today) ??
      sorted[0] ??
      null;
  }

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
          <ArtistBio details={details} genres={genres} bio={bio} />
          {/* Álbumes */}
          <LatestAlbums albums={albums} artistSlug={slug} />
          {/* Artistas */}
          <RelatedArtists artists={relatedArtists} />
        </div>

        {/* Columna derecha */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6 sm:gap-8 lg:sticky lg:top-24">
          {/* Último lanzamiento */}
          <LatestRelease release={lastRelease} />

          {/* Canciones populares */}
          <PopularSongs topTracks={topTracks} />
          <NextEvent event={nextEvent ?? null} />
        </div>
      </div>
    </div>
  );
}
