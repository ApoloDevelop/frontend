// Server Component
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
}: {
  artistId: string;
  slug: string;
  user: any; // ajusta si tienes el tipo del mockUser
}) {
  // Espera para respetar el rate-limit (la otra llamada fue getArtistInfo)
  await wait(1500);

  // const events = await SongstatsService.getArtistEventInfo(artistId);
  const events = mockEvent;

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
      <NearYou user={user} events={events?.upcoming ?? []} />
    </>
  );
}
