import EventsTabs from "./events/EventsTabs";
import { ArtistEvent } from "@/services/songstats.service";

interface ArtistEventsContentProps {
  upcoming: ArtistEvent[];
  past: ArtistEvent[];
}

export default function ArtistEventsContent({
  upcoming,
  past,
}: ArtistEventsContentProps) {
  return (
    <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow mb-10">
      <EventsTabs upcoming={upcoming} past={past} />
    </section>
  );
}
