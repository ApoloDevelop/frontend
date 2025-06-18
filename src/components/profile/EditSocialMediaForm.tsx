import { Input } from "../ui/input";

interface EditSocialMediaFormProps {
  spLink: string;
  setSpLink: (v: string) => void;
  ytLink: string;
  setYtLink: (v: string) => void;
  twLink: string;
  setTwLink: (v: string) => void;
  igLink: string;
  setIgLink: (v: string) => void;
  extUrl: string;
  setExtUrl: (v: string) => void;
}

export function EditSocialMediaForm({
  spLink,
  setSpLink,
  ytLink,
  setYtLink,
  twLink,
  setTwLink,
  igLink,
  setIgLink,
  extUrl,
  setExtUrl,
}: EditSocialMediaFormProps) {
  return (
    <div className="space-y-4 mt-4">
      <div id="spotify-input">
        <label className="text-sm font-semibold mb-1 block">
          Enlace a Spotify
        </label>
        <Input
          name="spotify"
          type="url"
          value={spLink}
          onChange={(e) => setSpLink(e.target.value)}
        />
      </div>
      <div id="instagram-input">
        <label className="text-sm font-semibold mb-1 block">
          Enlace a Instagram
        </label>
        <Input
          name="instagram"
          type="url"
          value={igLink}
          onChange={(e) => setIgLink(e.target.value)}
        />
      </div>
      <div id="twitter-input">
        <label className="text-sm font-semibold mb-1 block">
          Enlace a X (Twitter)
        </label>
        <Input
          name="twitter"
          type="url"
          value={twLink}
          onChange={(e) => setTwLink(e.target.value)}
        />
      </div>
      <div id="youtube-input">
        <label className="text-sm font-semibold mb-1 block">
          Enlace a Youtube
        </label>
        <Input
          name="youtube"
          type="url"
          value={ytLink}
          onChange={(e) => setYtLink(e.target.value)}
        />
      </div>
      <div id="url-input">
        <label className="text-sm font-semibold mb-1 block">
          Añadir enlace externo
        </label>
        <Input
          name="external-url"
          type="url"
          value={extUrl}
          onChange={(e) => setYtLink(e.target.value)}
        />
      </div>
    </div>
  );
}
