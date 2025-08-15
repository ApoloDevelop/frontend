const B = process.env.NEXT_PUBLIC_BACKEND_URL!;

export class GeniusRepository {
  static async getLyricsByTrack(title: string, artist: string) {
    const q = new URLSearchParams({
      title,
      artist,
    });
    const res = await fetch(`${B}/genius/lyrics/by-track?${q}`, {
      cache: "no-store",
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Error obteniendo lyrics por título+artista");
    const data = await res.json();
    return data;
  }
}
