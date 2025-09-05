import {
  ArtistEventsHero,
  ArtistEventsHeader,
  ArtistEventsContent,
  ArtistNotFound,
} from "@/components/artist";
import {
  getArtistData,
  getArtistEvents,
  useProcessEvents,
} from "@/hooks/artist";

export default async function ArtistEventsPage({
  params: rawParams,
}: {
  params: Promise<{ artist: string }>;
}) {
  const { artist: slug } = await rawParams;

  // Obtener datos del artista
  const { artist, error } = await getArtistData(slug);

  // Manejar error o artista no encontrado
  if (error || !artist) {
    return <ArtistNotFound message={error || undefined} />;
  }

  // Obtener eventos del artista
  const eventsInfo = await getArtistEvents(artist.id);

  // Procesar y ordenar eventos
  const { upcoming, past } = useProcessEvents(eventsInfo);

  return (
    <div className="container mx-auto">
      <ArtistEventsHero
        artistName={artist.name}
        imageUrl={artist.images?.[0]?.url}
      />

      <ArtistEventsHeader
        artistName={artist.name}
        imageUrl={artist.images?.[0]?.url}
      />

      <ArtistEventsContent upcoming={upcoming} past={past} />
    </div>
  );
}
