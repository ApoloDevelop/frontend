import { wait } from "@/utils/wait";
import { SongstatsService } from "@/services/songstats.service";
import { NextEvent } from "@/components/artist/NextEvent";
import { NearYou } from "@/components/artist/NearYou";
import { mockEvent } from "@/mocks/mockSongstats";
import { EventData } from "@/types/events";

export default async function EventsSidebar({
  artistId,
  slug,
  user,
  artistName,
}: {
  artistId: string;
  slug: string;
  user: any;
  artistName: string;
}) {
  // Espera para respetar el rate-limit (que es de 1 petición por segundo)
  await wait(1500);

  let events;
  try {
    events = await SongstatsService.getArtistEventInfo(artistId);
  } catch (error) {
    console.warn("Error fetching artist event data:", error);
    events = mockEvent;
  }
  // const events = mockEvent;

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
        artistName={artistName}
      />
    </>
  );
}
