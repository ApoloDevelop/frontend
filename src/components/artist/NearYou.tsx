"use client";

import { useNearestEvent } from "@/hooks/artist";
import { SongstatsEvent, UserLocation } from "@/types/events";
import { NoUserSection } from "./NoUserSection";
import { MissingLocationSection } from "./MissingLocationSection";
import { NoEventsSection } from "./NoEventsSection";
import { LoadingSection } from "./LoadingSection";
import { EventCard } from "./EventCard";
import { EventActions } from "./EventActions";

export function NearYou({
  user,
  events,
  artistName,
}: {
  user: UserLocation | null | undefined;
  events: SongstatsEvent[] | null | undefined;
  artistName: string;
}) {
  const {
    nearestEvent,
    isLoading,
    error,
    hasValidLocation,
    hasEventsInCountry,
  } = useNearestEvent(user, events);

  // Usuario no logueado
  if (!user) {
    return <NoUserSection />;
  }

  const profileEditHref = `/users/${user.username}`;

  // Ubicación incompleta
  if (!hasValidLocation) {
    return <MissingLocationSection profileEditHref={profileEditHref} />;
  }

  // Cargando
  if (isLoading) {
    return <LoadingSection />;
  }

  // Error de geocodificación
  if (error) {
    return <NoEventsSection message={error} />;
  }

  // No hay eventos en el país
  if (!hasEventsInCountry) {
    return <NoEventsSection message="No hay eventos próximos en tu país." />;
  }

  // No se encontró evento más cercano
  if (!nearestEvent) {
    return (
      <NoEventsSection message="No hay eventos próximos para este artista." />
    );
  }

  return (
    <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-3">Cerca de ti</h2>
      <EventCard
        event={nearestEvent.event}
        distanceKm={nearestEvent.distanceKm}
        userCity={user.city!}
      />
      <EventActions
        eventLink={nearestEvent.event.link}
        artistName={artistName}
      />
    </section>
  );
}
