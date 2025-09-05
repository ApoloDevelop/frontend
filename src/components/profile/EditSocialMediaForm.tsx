import { Input } from "../ui/input";
import {
  FaExternalLinkAlt,
  FaInstagram,
  FaSpotify,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

interface EditSocialMediaFormProps {
  spLink: string;
  setSpLink: (v: string) => void;
  ytLink: string;
  setYtLink: (v: string) => void;
  twLink: string;
  setTwLink: (v: string) => void;
  igLink: string;
  setIgLink: (v: string) => void;
  ttLink: string;
  setTtLink: (v: string) => void;
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
  ttLink,
  setTtLink,
  extUrl,
  setExtUrl,
}: EditSocialMediaFormProps) {
  return (
    <div className="space-y-4 mt-4">
      <div id="spotify-input">
        <label className="text-sm font-semibold mb-1 block">
          Enlace a Spotify
          <FaSpotify className="inline text-green-600 ml-1 mb-0" size={16} />
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
          <FaInstagram className="inline text-pink-500 ml-1 mb-0" size={16} />
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
          <FaXTwitter className="inline text-black ml-1 mb-0" size={14} />
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
          <FaYoutube className="inline text-red-600 ml-1 mb-0" size={16} />
        </label>
        <Input
          name="youtube"
          type="url"
          value={ytLink}
          onChange={(e) => setYtLink(e.target.value)}
        />
      </div>
      <div id="tiktok-input">
        <label className="text-sm font-semibold mb-1 block">
          Enlace a TikTok
          <FaTiktok className="inline text-black ml-1 mb-0" size={16} />
        </label>
        <Input
          name="tiktok"
          type="url"
          value={ttLink}
          onChange={(e) => setTtLink(e.target.value)}
        />
      </div>
      <div id="url-input">
        <label className="text-sm font-semibold mb-1 block">
          Añadir enlace externo
          <FaExternalLinkAlt
            className="inline text-purple-700 ml-1 mb-0"
            size={13}
          />
        </label>
        <Input
          name="external-url"
          type="url"
          value={extUrl}
          onChange={(e) => setExtUrl(e.target.value)}
        />
      </div>
    </div>
  );
}
