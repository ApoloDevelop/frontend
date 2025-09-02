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
      {/* Hero con imagen de fondo */}
      <ArtistEventsHero
        artistName={artist.name}
        imageUrl={artist.images?.[0]?.url}
      />

      {/* Header con avatar y título */}
      <ArtistEventsHeader
        artistName={artist.name}
        imageUrl={artist.images?.[0]?.url}
      />

      {/* Contenido principal con pestañas de eventos */}
      <ArtistEventsContent upcoming={upcoming} past={past} />
    </div>
  );
}
