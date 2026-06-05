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
} from "@/hooks/events";

export default async function ArtistEventsPage({
  params: rawParams,
}: {
  params: Promise<{ artist: string }>;
}) {
  const { artist: slug } = await rawParams;

  const { artist, error } = await getArtistData(slug);

  if (error || !artist) {
    return <ArtistNotFound message={error || undefined} />;
  }

  const eventsInfo = await getArtistEvents(artist.name);
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
