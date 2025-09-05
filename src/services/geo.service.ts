import { GeoRepository } from "@/repositories/geo.repository";

export type LatLng = { lat: number; lng: number };

export class GeoService {
  static async getCoordinates(
    city: string,
    country: string
  ): Promise<LatLng | null> {
    return await GeoRepository.getCoordinates(city, country);
  }
}
