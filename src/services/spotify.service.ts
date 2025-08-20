import { SpotifyRepository } from "@/repositories/spotify.repository";

export class SpotifyService {
  static async fetchArtistByName(name: string) {
    try {
      return await SpotifyRepository.fetchArtistByName(name);
    } catch (error) {
      console.error("Error al obtener el artista por nombre:", error);
      throw error;
    }
  }

  static async fetchAlbumByName(name: string, artist: string) {
    try {
      return await SpotifyRepository.fetchAlbumByName(name, artist);
    } catch (error) {
      console.error("Error al obtener el álbum por nombre:", error);
      throw error;
    }
  }

  static async fetchSongByName(name: string, album?: string, artist?: string) {
    try {
      return await SpotifyRepository.fetchSongByName(name, album, artist);
    } catch (error) {
      console.error("Error al obtener la canción por nombre:", error);
      throw error;
    }
  }

  static async fetchArtistAlbums(artistId: string) {
    try {
      return await SpotifyRepository.fetchArtistAlbums(artistId);
    } catch (error) {
      console.error("Error al obtener los álbumes del artista:", error);
      throw error;
    }
  }

  static async fetchArtistTopTracks(artistId: string) {
    try {
      return await SpotifyRepository.fetchArtistTopTracks(artistId);
    } catch (error) {
      console.error(
        "Error al obtener las canciones más populares del artista:",
        error
      );
      throw error;
    }
  }

  static async fetchArtistReleases(artistId: string) {
    try {
      return await SpotifyRepository.fetchArtistReleases(artistId);
    } catch (error) {
      console.error("Error al obtener los lanzamientos del artista:", error);
      throw error;
    }
  }

  static async fetchAlbumTracks(albumId: string) {
    try {
      return await SpotifyRepository.fetchAlbumTracks(albumId);
    } catch (error) {
      console.error("Error al obtener las pistas del álbum:", error);
      throw error;
    }
  }
}
