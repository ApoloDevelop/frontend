export type Meta = {
  bpm: number | null;
  key: string | null;
  genres: string[];
  collaborators: { name: string; roles: string[] }[];
  label: string | null;
  distributor: string | null;
};

export type RelatedArtist = {
  name: string | null;
  avatar: string | null;
  id: string | null;
};

export type ArtistLink = {
  source: string;
  external_id: string;
  url: string;
};

export type ArtistInfo = {
  bio: string | null;
  genres: string[];
  related_artists: RelatedArtist[];
  links: ArtistLink[];
};

export type ArtistEvent = {
  title: string | null;
  date: string | null;
  link: string | null;
  city: string | null;
  region: string | null;
  countryCode: string | null;
  lat: number | null;
  lng: number | null;
};

export type ArtistEventInfo = {
  counts: {
    citiesUpcoming: number;
    countriesUpcoming: number;
    eventsUpcoming: number;
  };
  upcoming: ArtistEvent[];
  past: ArtistEvent[];
};
