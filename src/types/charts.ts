export type ArtistLite = { name: string };

export type TrackLite = {
  id: string;
  name: string;
  album?: { name: string; images?: { url: string }[] };
  artists: ArtistLite[];
};

export type PlaylistLite = {
  id: string;
  name: string;
  images?: { url: string }[];
  tracks: TrackLite[];
};
