export type SongstatsEvent = {
  title: string | null;
  date: string | null; // YYYY-MM-DD
  link: string | null;
  city: string | null;
  region: string | null;
  countryCode: string | null;
  lat: number | null;
  lng: number | null;
};

export type UserLocation = {
  username?: string | null | undefined;
  city: string | null | undefined;
  country: string | null | undefined;
};

export type NearestEventResult = {
  event: SongstatsEvent;
  distanceKm: number;
} | null;
