"use client";

import { useState, useEffect } from "react";
import { pickNearest, LatLng } from "@/utils/distances";
import { GeoService } from "@/services/geo.service";
import {
  SongstatsEvent,
  UserLocation,
  NearestEventResult,
} from "@/types/events";

type NearestEventState = {
  nearestEvent: NearestEventResult;
  isLoading: boolean;
  error: string | null;
  hasValidLocation: boolean;
  hasEventsInCountry: boolean;
};

export function useNearestEvent(
  user: UserLocation | null | undefined,
  events: SongstatsEvent[] | null | undefined
): NearestEventState {
  const [state, setState] = useState<NearestEventState>({
    nearestEvent: null,
    isLoading: true,
    error: null,
    hasValidLocation: false,
    hasEventsInCountry: false,
  });

  useEffect(() => {
    async function findNearestEvent() {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        // Validar ubicación del usuario
        if (!user?.city || !user?.country) {
          setState({
            nearestEvent: null,
            isLoading: false,
            error: null,
            hasValidLocation: false,
            hasEventsInCountry: false,
          });
          return;
        }

        const eventList = events ?? [];
        if (!eventList.length) {
          setState({
            nearestEvent: null,
            isLoading: false,
            error: null,
            hasValidLocation: true,
            hasEventsInCountry: false,
          });
          return;
        }

        // Geocodificar la ciudad del usuario
        const userCoords = await GeoService.getCoordinates(
          user.city,
          user.country
        );
        if (!userCoords) {
          setState({
            nearestEvent: null,
            isLoading: false,
            error: `No pudimos geocodificar tu ciudad (${user.city})`,
            hasValidLocation: false,
            hasEventsInCountry: false,
          });
          return;
        }

        // Filtrar eventos por país del usuario
        const sameCountry = eventList.filter(
          (e) =>
            e.countryCode &&
            e.countryCode.toUpperCase() === user.country?.toUpperCase()
        );

        if (!sameCountry.length) {
          setState({
            nearestEvent: null,
            isLoading: false,
            error: null,
            hasValidLocation: true,
            hasEventsInCountry: false,
          });
          return;
        }

        // Geocodificar eventos que no tienen coordenadas
        const candidates: Array<
          {
            event: SongstatsEvent;
          } & LatLng
        > = [];

        for (const event of sameCountry) {
          let coords: LatLng | null = null;

          if (
            typeof event.lat === "number" &&
            !Number.isNaN(event.lat) &&
            typeof event.lng === "number" &&
            !Number.isNaN(event.lng)
          ) {
            coords = { lat: event.lat, lng: event.lng };
          } else if (event.city && event.countryCode) {
            try {
              coords = await GeoService.getCoordinates(
                event.city,
                event.countryCode
              );
            } catch {
              coords = null;
            }
          }

          if (coords) {
            candidates.push({ ...coords, event });
          }
        }

        if (!candidates.length) {
          setState({
            nearestEvent: null,
            isLoading: false,
            error: "No pudimos calcular distancias a los eventos de tu país",
            hasValidLocation: true,
            hasEventsInCountry: true,
          });
          return;
        }

        // Encontrar el evento más cercano
        const nearest = pickNearest(userCoords, candidates);
        if (!nearest) {
          setState({
            nearestEvent: null,
            isLoading: false,
            error: "No pudimos determinar el evento más cercano",
            hasValidLocation: true,
            hasEventsInCountry: true,
          });
          return;
        }

        setState({
          nearestEvent: {
            event: nearest.item.event,
            distanceKm: nearest.distanceKm,
          },
          isLoading: false,
          error: null,
          hasValidLocation: true,
          hasEventsInCountry: true,
        });
      } catch (error) {
        setState({
          nearestEvent: null,
          isLoading: false,
          error: "Error al buscar eventos cercanos",
          hasValidLocation: true,
          hasEventsInCountry: false,
        });
      }
    }

    findNearestEvent();
  }, [user, events]);

  return state;
}
