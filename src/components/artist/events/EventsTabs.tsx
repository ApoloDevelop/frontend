"use client";

import { useMemo, useState } from "react";
import EventCard from "./EventCard";
import type { ArtistEvent } from "@/services/songstats.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

  const current = tab === "upcoming" ? upcomingFiltered : pastFiltered;

  const emptyCopy = useMemo(() => {
    if (search) {
      return `No hay eventos en ciudades que coincidan con “${search}”.`;
    }
    return tab === "upcoming"
      ? "No hay eventos próximos."
      : "No hay eventos pasados.";
  }, [tab, search]);

  const countLabel = useMemo(() => {
    const n = current.length;
    if (n === 0) return "0 eventos";
    if (n === 1) return "1 evento";
    return `${n} eventos`;
  }, [current]);

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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por ciudad (p. ej., Madrid)"
            className="w-full rounded-lg border border-gray-300 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-purple-300"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
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
          onClick={() => setTab("upcoming")}
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
          onClick={() => setTab("past")}
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
      )}
    </div>
  );
}
