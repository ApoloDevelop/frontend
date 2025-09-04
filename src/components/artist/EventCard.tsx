import dayjs from "dayjs";
import { SongstatsEvent } from "@/types/events";

type EventCardProps = {
  event: SongstatsEvent;
  distanceKm: number;
  userCity: string;
};

export function EventCard({ event, distanceKm, userCity }: EventCardProps) {
  const place = [event?.city || "", event?.region ? `(${event.region})` : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold">
            {event.title ?? "Evento próximo"}
          </p>
          <p className="text-gray-600">{place}</p>
          <p className="text-gray-600 italic">
            {event.date
              ? dayjs(event.date).format("DD/MM/YYYY")
              : "Fecha por confirmar"}
          </p>
          <p className="mt-1 text-sm">
            A <strong>{Math.round(distanceKm)}</strong> km de{" "}
            <strong>{userCity}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
