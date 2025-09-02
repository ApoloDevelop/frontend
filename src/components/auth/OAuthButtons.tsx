import { Button } from "@/components/ui/button";
import SpotifyLogo from "@/components/icons/SpotifyLogo";

interface OAuthButtonsProps {
  googleUrl?: string;
  spotifyUrl?: string;
  onRedirect: (url: string) => void;
}

export default function OAuthButtons({
  googleUrl,
  spotifyUrl,
  onRedirect,
}: OAuthButtonsProps) {
  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() => googleUrl && onRedirect(googleUrl)}
        className="w-full justify-center rounded-xl bg-white text-zinc-900 hover:bg-zinc-50 border border-zinc-300"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png"
          alt="Google"
          className="w-[18px] h-[18px] mr-2"
        />
        Entrar con Google
      </Button>

      <Button
        onClick={() => spotifyUrl && onRedirect(spotifyUrl)}
        className="w-full justify-center rounded-xl bg-black hover:bg-zinc-900 text-white"
      >
        <span className="mr-2 inline-flex">
          <SpotifyLogo />
        </span>
        Entrar con Spotify
      </Button>
    </div>
  );
}
