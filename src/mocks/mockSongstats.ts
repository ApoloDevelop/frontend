import { link } from "fs";
import { title } from "process";

export const mockTrackData = {
  bpm: 120, // Valor mock
  key: "C Major", // Valor mock
  genres: ["Pop", "Indie"], // Valor mock
  collaborators: [
    { name: "John Doe", roles: ["Composer", "Producer"] },
    { name: "Jane Smith", roles: ["Lyricist"] },
  ], // Valor mock
  label: "Mock Label", // Valor mock
  distributor: "Mock Distributor", // Valor mock
};

export const mockArtistData = {
  bio: "Este es un artista ficticio con una biografía de ejemplo. Ha trabajado en múltiples géneros y ha colaborado con artistas reconocidos.",
  genres: ["Pop", "Rock", "Indie"],
  related_artists: [
    {
      id: "1",
      name: "Artista Relacionado 1",
      avatar: "/default-cover.png",
    },
    {
      id: "2",
      name: "Artista Relacionado 2",
      avatar: "/default-cover.png",
    },
    {
      id: "3",
      name: "Artista Relacionado 3",
      avatar: "/default-cover.png",
    },
  ],
};

export const mockUser = {
  username: "williardo",
  city: "Málaga",
  country: "ES",
};

export const mockEvent = {
  title: "Concierto de Prueba",
  date: "2023-10-01",
  link: "https://example.com/concierto-prueba",
  city: "Málaga",
  region: "Andalucía",
  countryCode: "ES",
  lat: 36.7213,
  lng: -4.4214,
  upcoming: [
    {
      title: "Concierto de Prueba",
      date: "2023-10-01",
      link: "https://example.com/concierto-prueba",
      city: "Málaga",
      region: "Andalucía",
      countryCode: "ES",
      lat: 36.7213,
      lng: -4.4214,
    },
  ],
  past: [
    {
      title: "Concierto Pasado",
      date: "2023-09-01",
      link: "https://example.com/concierto-pasado",
      city: "Málaga",
      region: "Andalucía",
      countryCode: "ES",
      lat: 36.7213,
      lng: -4.4214,
    },
  ],
};
