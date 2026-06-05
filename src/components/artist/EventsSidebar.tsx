import { ConcertsService } from "@/services/concerts.service";
import { NextEvent } from "@/components/artist/NextEvent";
import { NearYou } from "@/components/artist/NearYou";
import { EventData } from "@/types/events";

export default async function EventsSidebar({
  artistName,
  slug,
  user,
}: {
  artistName: string;
  slug: string;
  user: any;
}) {
  let events;
  try {
    events = await ConcertsService.getArtistUpcomingInfo(artistName);
  } catch (error) {
    console.warn("Error fetching artist event data:", error);
    events = null;
  }

  let nextEvent: EventData | null = null;
  if (events?.upcoming?.length) {
    const today = new Date();
    const sorted = events.upcoming
      .filter((e: any) => e?.date)
      .sort(
        (a: any, b: any) =>
          new Date(a.date as string).getTime() -
          new Date(b.date as string).getTime()
      );

    nextEvent =
      sorted.find((e: any) => new Date(e.date as string) >= today) ??
      sorted[0] ??
      null;
  }

  return (
    <>
      <NextEvent event={nextEvent} slug={slug} />
      <NearYou
        user={user}
        events={events?.upcoming ?? []}
        artistName={slug}
      />
    </>
  );
}
