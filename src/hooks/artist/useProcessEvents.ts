import { ArtistEvent } from "@/services/songstats.service";

interface ProcessedEvents {
  upcoming: ArtistEvent[];
  past: ArtistEvent[];
}

/**
 * Hook para procesar y ordenar eventos del artista
 * @param eventsInfo - Información de eventos cruda
 * @returns Eventos procesados y ordenados
 */
export function useProcessEvents(eventsInfo: any): ProcessedEvents {
  // Filtrar eventos válidos (que tengan fecha)
  const safeUpcoming: ArtistEvent[] = (eventsInfo?.upcoming ?? []).filter(
    (e: ArtistEvent) => !!e?.date
  );
  const safePast: ArtistEvent[] = (eventsInfo?.past ?? []).filter(
    (e: ArtistEvent) => !!e?.date
  );

  // Próximos eventos (orden ascendente: más próximo primero)
  const upcomingSorted = safeUpcoming
    .slice()
    .sort(
      (a, b) =>
        new Date(a.date as string).getTime() -
        new Date(b.date as string).getTime()
    );

  // Eventos pasados (orden descendente: más reciente primero)
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
