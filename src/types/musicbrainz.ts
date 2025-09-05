export interface MbArtist {
  id: string;
  name: string;
}

export interface ArtistDetails {
  fullName: string;
  birthDate: string | null;
  birthPlace: string | null;
  birthCountry: string | null;
  birthCountryCode: string | null;
  type: string | null;
  bio: string;
}
