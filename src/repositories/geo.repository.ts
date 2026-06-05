export type LatLng = { lat: number; lng: number };

export class GeoRepository {
  static async getCoordinates(city: string, country: string): Promise<LatLng> {
    if (!city || !country) {
      throw new Error("city y country requeridos");
    }

    const url = `${
      process.env.NEXT_PUBLIC_BACKEND_URL
    }/geo/coordinates?city=${encodeURIComponent(
      city
    )}&country=${encodeURIComponent(country)}`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      throw new Error(msg || "Error geocodificando ciudad/país");
    }

    const data = (await res.json()) as LatLng;
    if (!data || typeof data.lat !== "number" || typeof data.lng !== "number") {
      throw new Error("Respuesta de geocodificación inválida");
    }
    return data;
  }
}
