"use client";

import { useMemo, useState } from "react";
import EventCard from "./EventCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArtistEvent } from "@/types/songstats";

const EVENTS_PER_PAGE = 10;

function normalize(s?: string | null) {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function EventsTabs({
  upcoming,
  past,
}: {
  upcoming: ArtistEvent[];
  past: ArtistEvent[];
}) {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [search, setSearch] = useState("");
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);

  const upcomingFiltered = useMemo(() => {
    const q = normalize(search);
    if (!q) return upcoming;
    return upcoming.filter((e) => normalize(e.city).includes(q));
  }, [search, upcoming]);

  const pastFiltered = useMemo(() => {
    const q = normalize(search);
    if (!q) return past;
    return past.filter((e) => normalize(e.city).includes(q));
  }, [search, past]);

  // Paginación para eventos próximos
  const upcomingPaginated = useMemo(() => {
    return upcomingFiltered.slice(0, upcomingPage * EVENTS_PER_PAGE);
  }, [upcomingFiltered, upcomingPage]);

  // Paginación para eventos pasados
  const pastPaginated = useMemo(() => {
    return pastFiltered.slice(0, pastPage * EVENTS_PER_PAGE);
  }, [pastFiltered, pastPage]);

  const current = tab === "upcoming" ? upcomingPaginated : pastPaginated;
  const currentFiltered = tab === "upcoming" ? upcomingFiltered : pastFiltered;
  const currentPage = tab === "upcoming" ? upcomingPage : pastPage;
  const hasMoreEvents = currentFiltered.length > current.length;

  const emptyCopy = useMemo(() => {
    if (search) {
      return `No hay eventos en ciudades que coincidan con “${search}”.`;
    }
    return tab === "upcoming"
      ? "No hay eventos próximos."
      : "No hay eventos pasados.";
  }, [tab, search]);

  const countLabel = useMemo(() => {
    const n = currentFiltered.length;
    if (n === 0) return "0 eventos";
    if (n === 1) return "1 evento";
    return `${n} eventos`;
  }, [currentFiltered]);

  const handleTabChange = (newTab: "upcoming" | "past") => {
    setTab(newTab);
    // Reset search when changing tabs
    setSearch("");
  };

  const loadMoreEvents = () => {
    if (tab === "upcoming") {
      setUpcomingPage((prev) => prev + 1);
    } else {
      setPastPage((prev) => prev + 1);
    }
  };

  // Reset pagination when search changes
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setUpcomingPage(1);
    setPastPage(1);
  };

  return (
    <div>
      {/* Buscador por ciudad */}
      <div className="mb-4">
        <label htmlFor="city-search" className="sr-only">
          Buscar por ciudad
        </label>
        <div className="relative">
          <Input
            id="city-search"
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Buscar por ciudad (p. ej., Madrid)"
            className="w-full rounded-lg border border-gray-300 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-purple-300"
          />
          {search && (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-3xl hover:text-gray-800 cursor-pointer"
              aria-label="Limpiar búsqueda"
              title="Limpiar"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Tabs header */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          type="button"
          onClick={() => handleTabChange("upcoming")}
          className={`px-3 py-2 rounded-md text-sm font-medium transition ${
            tab === "upcoming"
              ? "bg-black text-white"
              : "bg-white/70 text-gray-800 hover:bg-white"
          }`}
        >
          Próximos
        </Button>
        <Button
          type="button"
          onClick={() => handleTabChange("past")}
          className={`px-3 py-2 rounded-md text-sm font-medium transition ${
            tab === "past"
              ? "bg-black text-white"
              : "bg-white/70 text-gray-800 hover:bg-white"
          }`}
        >
          Pasados
        </Button>

        <span className="ml-auto text-sm text-gray-600">{countLabel}</span>
      </div>

      {/* Listado en una sola columna */}
      {current.length === 0 ? (
        <p className="text-gray-500">{emptyCopy}</p>
      ) : (
        <>
          <ul className="space-y-3">
            {current.map((e, idx) => {
              const key =
                [e.date, e.title, e.city, e.region, e.link]
                  .filter(Boolean)
                  .join("|") || `evt-${idx}`;
              return (
                <li key={key}>
                  <EventCard event={e} isPast={tab === "past"} />
                </li>
              );
            })}
          </ul>

          {/* Botón "Cargar más" */}
          {hasMoreEvents && (
            <div className="mt-6 text-center">
              <Button
                type="button"
                onClick={loadMoreEvents}
                className="px-6 py-2 bg-white/70 text-gray-800 border border-gray-300 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200"
              >
                Cargar más eventos ({currentFiltered.length - current.length}{" "}
                restantes)
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
