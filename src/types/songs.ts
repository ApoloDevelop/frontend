export interface Artist {
  id?: string;
  name: string;
}

export interface Album {
  name: string;
  artists: Array<{ name: string }>;
}

export interface Track {
  name: string;
  artists: Artist[];
  album?: Album;
  external_urls?: {
    spotify?: string;
  };
}

export interface Collaborator {
  role: string;
  names: string[];
}
