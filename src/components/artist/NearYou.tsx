// components/artist/NearYou.tsx
import dayjs from "dayjs";
import Link from "next/link";
import { pickNearest, LatLng } from "@/utils/distances";
import { GeoService } from "@/services/geo.service";

type SongstatsEvent = {
  title: string | null;
  date: string | null; // YYYY-MM-DD
  link: string | null;
  city: string | null;
  region: string | null;
  countryCode: string | null;
  lat: number | null;
  lng: number | null;
};

export async function NearYou({
  user,
  events,
}: {
  user:
    | {
        username: string | null | undefined;
        city: string | null | undefined;
        country: string | null | undefined;
      }
    | null
    | undefined;
  events: SongstatsEvent[] | null | undefined;
}) {
  // Validar que user existe antes de acceder a sus propiedades
  if (!user) {
    return (
      <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-3xl font-bold mb-2">Cerca de ti</h2>
        <p className="text-gray-700">
          No podemos mostrarte el evento más cercano porque no has iniciado
          sesión.
        </p>
        <p className="mt-2">
          <Link href="/login" className="underline font-medium">
            Inicia sesión
          </Link>{" "}
          para ver eventos cerca de tu ubicación.
        </p>
      </section>
    );
  }

  console.log("User:", user);
  console.log("Country:", user.country);
  console.log("City:", user.city);
  const profileEditHref = `/users/${user.username}`;
  if (!user.city || !user.country) {
    return (
      <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-3xl font-bold mb-2">Cerca de ti</h2>
        <p className="text-gray-700">
          No podemos mostrarte el evento más cercano porque en tu perfil falta
          la <strong>ciudad</strong> y/o el <strong>país</strong>.
        </p>
        <p className="mt-2">
          Añádelos en{" "}
          <Link href={profileEditHref} className="underline font-medium">
            editar perfil
          </Link>
          .
        </p>
      </section>
    );
  }

  const list = events ?? [];
  if (!list.length) {
    return (
      <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-3xl font-bold mb-2">Cerca de ti</h2>
        <p className="text-gray-500">
          No hay eventos próximos para este artista.
        </p>
      </section>
    );
  }

  // 2) Geocodificar la ciudad del usuario (repo -> backend)
  let userCoords: LatLng | null = null;
  try {
    userCoords = await GeoService.getCoordinates(user.city, user.country);
  } catch {
    userCoords = null;
  }

  if (!userCoords) {
    return (
      <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-3xl font-bold mb-2">Cerca de ti</h2>
        <p className="text-gray-700">
          No pudimos geocodificar tu ciudad (<strong>{user.city}</strong>).
          Revisa que esté bien escrita en tu perfil.
        </p>
      </section>
    );
  }

  // 3) Filtrar eventos por país del usuario (ISO-2 case-insensitive)
  const sameCountry = list.filter(
    (e) =>
      e.countryCode &&
      e.countryCode.toUpperCase() === user.country?.toUpperCase()
  );

  if (!sameCountry.length) {
    return (
      <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-3xl font-bold mb-2">Cerca de ti</h2>
        <p className="text-gray-500">No hay eventos próximos en tu país.</p>
      </section>
    );
  }

  // 4) Asegurar coords de cada evento (si faltan, geocodificar city+countryCode vía repo)
  const candidates: Array<
    {
      event: SongstatsEvent;
    } & LatLng
  > = [];

  for (const e of sameCountry) {
    let coords: LatLng | null = null;

    if (
      typeof e.lat === "number" &&
      !Number.isNaN(e.lat) &&
      typeof e.lng === "number" &&
      !Number.isNaN(e.lng)
    ) {
      coords = { lat: e.lat, lng: e.lng };
    } else if (e.city && e.countryCode) {
      try {
        coords = await GeoService.getCoordinates(e.city, e.countryCode);
      } catch {
        coords = null;
      }
    }

    if (coords) candidates.push({ ...coords, event: e });
  }

  if (!candidates.length) {
    return (
      <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-3xl font-bold mb-2">Cerca de ti</h2>
        <p className="text-gray-500">
          No pudimos calcular distancias a los eventos de tu país.
        </p>
      </section>
    );
  }

  // 5) Elegir el más cercano (helper puro)
  const nearest = pickNearest(userCoords, candidates);
  if (!nearest) {
    return (
      <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-3xl font-bold mb-2">Cerca de ti</h2>
        <p className="text-gray-500">
          No pudimos determinar el evento más cercano.
        </p>
      </section>
    );
  }

  const { item, distanceKm } = nearest;
  const { event } = item;
  const place = [event?.city || "", event?.region ? `(${event.region})` : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-3">Cerca de ti</h2>
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-lg font-semibold">
              {event.title ?? "Evento próximo"}
            </p>

            <p className=" text-gray-600">{place}</p>
            <p className=" text-gray-600 italic">
              {event.date
                ? dayjs(event.date).format("DD/MM/YYYY")
                : "Fecha por confirmar"}
            </p>
            <p className="mt-1 text-sm">
              A <strong>{Math.round(distanceKm)}</strong> km de{" "}
              <strong>{user.city}</strong>
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        {/* Ver más eventos */}
        <a href="/events" className="text-purple-600 hover:underline text-sm">
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
    </section>
  );
}
