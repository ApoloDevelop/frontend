import Image from "next/image";
import { deslugify } from "@/utils/normalization";
import { SpotifyService } from "@/services/spotify.service";
import { SongstatsService, ArtistEvent } from "@/services/songstats.service";
import EventsTabs from "@/components/artist/events/EventsTabs";
import { mockEvent } from "@/mocks/mockSongstats";

export default async function ArtistEventsPage({
  params: rawParams,
}: {
  params: Promise<{ artist: string }>;
}) {
  const { artist: slug } = await rawParams;
  const artistName = decodeURIComponent(deslugify(slug));

  const artistData = await SpotifyService.fetchArtistByName(artistName);
  if (!artistData) {
    return (
      <div className="container mx-auto py-20 text-center">
        Artista no encontrado.
      </div>
    );
  }

  // const eventsInfo = await SongstatsService.getArtistEventInfo(artistData.id);
  const eventsInfo = mockEvent; // Mock data for testing

  const safeUpcoming: ArtistEvent[] = (eventsInfo?.upcoming ?? []).filter(
    (e) => !!e?.date
  );
  const safePast: ArtistEvent[] = (eventsInfo?.past ?? []).filter(
    (e) => !!e?.date
  );

  // Próximos (ascendente)
  const upcomingSorted = safeUpcoming
    .slice()
    .sort(
      (a, b) =>
        new Date(a.date as string).getTime() -
        new Date(b.date as string).getTime()
    );

  // Pasados (descendente: el más reciente primero)
  const pastSorted = safePast
    .slice()
    .sort(
      (a, b) =>
        new Date(b.date as string).getTime() -
        new Date(a.date as string).getTime()
    );

  return (
    <div className="container mx-auto">
      {/* HERO (idéntico estilo al de ArtistPage) */}
      <div
        id="hero"
        className="relative h-48 sm:h-64 md:h-72 lg:h-80 w-full mb-6"
      >
        <Image
          src={artistData.images?.[0]?.url || "/default-cover.png"}
          alt={artistData.name}
          fill
          className="object-cover blur-sm"
          priority
        />
      </div>

      {/* HEADER con avatar superpuesto + título */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center mb-6 sm:mb-8">
        <div className="relative -mt-14 sm:-mt-20 md:-mt-28 z-10">
          <Image
            src={artistData.images?.[0]?.url || "/default-cover.png"}
            alt={artistData.name}
            width={200}
            height={200}
            className="rounded-lg object-cover shadow-lg w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48"
          />
        </div>

        <div className="ml-0 sm:ml-6 mt-2 sm:mt-0 flex-1">
          <h1 className="text-5xl font-bold text-black">
            Eventos de {artistData.name}
          </h1>
          <p className="text-lg text-gray-600 mt-1">Conciertos y giras</p>
        </div>
      </div>

      {/* CONTENIDO principal: tabs en un solo bloque/columna */}
      <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow mb-10">
        <EventsTabs upcoming={upcomingSorted} past={pastSorted} />
      </section>
    </div>
  );
}
