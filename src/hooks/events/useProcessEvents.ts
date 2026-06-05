import { ArtistEvent } from "@/types/songstats";

interface ProcessedEvents {
  upcoming: ArtistEvent[];
  past: ArtistEvent[];
}

export function useProcessEvents(eventsInfo: any): ProcessedEvents {
  const safeUpcoming: ArtistEvent[] = (eventsInfo?.upcoming ?? []).filter(
    (e: ArtistEvent) => !!e?.date
  );
  const safePast: ArtistEvent[] = (eventsInfo?.past ?? []).filter(
    (e: ArtistEvent) => !!e?.date
  );

  const upcomingSorted = safeUpcoming
    .slice()
    .sort(
      (a, b) =>
        new Date(a.date as string).getTime() -
        new Date(b.date as string).getTime()
    );

  const pastSorted = safePast
    .slice()
    .sort(
      (a, b) =>
        new Date(b.date as string).getTime() -
        new Date(a.date as string).getTime()
    );

  return {
    upcoming: upcomingSorted,
    past: pastSorted,
  };
}
