import { FaInstagram, FaSpotify, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Separator } from "../ui/separator";

export const UserInfo = ({
  fullname,
  username,
  biography,
  createdAt,
  className,
  spLink,
  ytLink,
  twLink,
  igLink,
  extUrl,
}: any) => {
  let joinedText = "";
  if (createdAt) {
    const date = new Date(createdAt);
    const mes = date.toLocaleString("es-ES", { month: "long" });
    const año = date.getFullYear();
    joinedText = `Se unió en ${
      mes.charAt(0).toLowerCase() + mes.slice(1) + ` de `
    } ${año}`;
  }
  return (
    <div className={className}>
      <div id="social-media" className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">{fullname}</h1>
        <Separator orientation="vertical" />
        {spLink && (
          <a
            href={spLink}
            target="_blank"
            rel="noopener noreferrer"
            title="Spotify"
          >
            <FaSpotify
              className="text-green-600 hover:scale-110 transition"
              size={20}
            />
          </a>
        )}
        {igLink && (
          <a
            href={igLink}
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
          >
            <FaInstagram
              className="text-pink-500 hover:scale-110 transition"
              size={20}
            />
          </a>
        )}
        {twLink && (
          <a
            href={twLink}
            target="_blank"
            rel="noopener noreferrer"
            title="X (Twitter)"
          >
            <FaXTwitter
              className="text-black hover:scale-110 transition"
              size={20}
            />
          </a>
        )}
        {ytLink && (
          <a
            href={ytLink}
            target="_blank"
            rel="noopener noreferrer"
            title="YouTube"
          >
            <FaYoutube
              className="text-red-600 hover:scale-110 transition"
              size={20}
            />
          </a>
        )}
        {extUrl && (
          <a
            href={extUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Enlace externo"
          >
            <svg
              className="inline text-purple-700 hover:scale-110 transition"
              width={18}
              height={18}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M12.293 2.293a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L14 5.414V15a1 1 0 11-2 0V5.414l-2.293 2.293A1 1 0 018.293 6.293l4-4z"></path>
              <path d="M3 9a1 1 0 011-1h2a1 1 0 110 2H5v6h10v-6h-1a1 1 0 110-2h2a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V9z"></path>
            </svg>
          </a>
        )}
      </div>
      <p id="username" className="text-gray-600">
        @{username}
      </p>
      {joinedText && <p className="text-gray-400 text-sm">{joinedText}</p>}
      <p id="bio" className="text-gray-500 mt-2">
        {biography || "Sin biografía"}
      </p>
    </div>
  );
};
