import SpotifyLogo from "@/components/icons/SpotifyLogo";

interface SpotifyButtonProps {
  url?: string;
}

export function SpotifyButton({ url }: SpotifyButtonProps) {
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-xl bg-green-900 px-4 py-2 text-white hover:bg-green-700 transition"
    >
      <SpotifyLogo />
      <span>Reproducir en Spotify</span>
    </a>
  );
}
