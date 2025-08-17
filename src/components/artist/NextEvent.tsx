"use client";

import dayjs from "dayjs";
import "dayjs/locale/es";
import Flag from "react-world-flags";

type EventData = {
  title: string | null;
  date: string | null;
  link: string | null;
  city: string | null;
  region: string | null;
  countryCode: string | null;
};

export function NextEvent({ event }: { event?: EventData | null }) {
  const hasEvent = !!event && !!event.date;

  const place = [event?.city || "", event?.region ? `(${event.region})` : ""]
    .filter(Boolean)
    .join(" ");

  const formattedDate = hasEvent
    ? dayjs(event!.date).locale("es").format("DD/MM/YYYY")
    : null;

  return (
    <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-4">Próximo Evento</h2>

      {!hasEvent ? (
        <p className="text-gray-500">No hay eventos próximos.</p>
      ) : (
        <div className="space-y-1">
          <div className="text-lg font-semibold text-gray-900">
            {event?.title || "Evento"}
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span>{place || "Lugar por confirmar"}</span>
            {event?.countryCode && (
              <Flag
                title={event.countryCode}
                code={event.countryCode}
                className="h-5 w-8 rounded-sm shadow"
              />
            )}
          </div>
          <div className="text-gray-500 italic">{formattedDate}</div>

          <div className="flex justify-between items-center mt-4">
            {/* Ver más eventos */}
            <a
              href="/events"
              className="text-purple-600 hover:underline text-sm"
            >
              Ver más eventos
            </a>

            {/* Comprar entradas */}
            {event?.link && (
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Comprar entradas
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
