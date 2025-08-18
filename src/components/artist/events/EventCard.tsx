"use client";

import dayjs from "dayjs";
import "dayjs/locale/es";
import Flag from "react-world-flags";
import type { ArtistEvent } from "@/services/songstats.service";
import clsx from "clsx";

export default function EventCard({
  event,
  isPast = false,
}: {
  event: ArtistEvent;
  isPast?: boolean;
}) {
  const formattedDate = event?.date
    ? dayjs(event.date).locale("es").format("DD/MM/YYYY")
    : null;

  const place = [event?.city || "", event?.region ? `(${event.region})` : ""]
    .filter(Boolean)
    .join(" ");

  const hasCoords =
    typeof event.lat === "number" && typeof event.lng === "number";

  return (
    <article
      className={clsx(
        "bg-white/80 p-4 sm:p-6 rounded-lg shadow transition",
        isPast && "opacity-60 grayscale cursor-not-allowed"
      )}
      aria-disabled={isPast}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {event?.title || "Evento"}
            </h3>

            {isPast && (
              <span className="inline-block text-xs px-2 py-0.5 rounded-md bg-gray-200 text-gray-700">
                Evento pasado
              </span>
            )}
          </div>

          <div className="mt-1 flex items-center gap-2 text-gray-700">
            <span className="truncate">{place || "Lugar por confirmar"}</span>
            {event?.countryCode ? (
              <Flag
                title={event.countryCode}
                code={event.countryCode}
                className="h-5 w-8 rounded-sm shadow shrink-0"
              />
            ) : null}
          </div>

          <div className="mt-1 text-gray-500 italic">
            {formattedDate ?? "Fecha por confirmar"}
          </div>
        </div>

        <div className="flex flex-col gap-2 shrink-0 items-end">
          {/* Botón de entradas: solo en futuros */}
          {!isPast && event?.link ? (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm text-center"
            >
              Comprar entradas
            </a>
          ) : null}

          {/* Ver en mapa: lo mantenemos, pero con tono más discreto si es pasado */}
          {hasCoords ? (
            <a
              className={clsx(
                "text-xs text-center",
                isPast
                  ? "text-gray-400 pointer-events-none"
                  : "text-purple-600 hover:underline"
              )}
              target={isPast ? undefined : "_blank"}
              rel={isPast ? undefined : "noopener noreferrer"}
              href={
                isPast
                  ? undefined
                  : `https://www.google.com/maps?q=${event.lat},${event.lng}`
              }
            >
              Ver en mapa
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
