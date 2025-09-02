import { LyricsDisplayer } from "@/components/song/LyricsDisplayer";

interface SongLyricsProps {
  lyrics: string;
}

export function SongLyrics({ lyrics }: SongLyricsProps) {
  return (
    <section aria-labelledby="lyrics-title">
      <h2 id="lyrics-title" className="mb-3 text-2xl font-semibold">
        Letra
      </h2>
      <LyricsDisplayer lyrics={lyrics} />
    </section>
  );
}
