import { FaInstagram, FaSpotify, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useState } from "react";

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
  followButton,
  roleId,
}: any) => {
  const [expanded, setExpanded] = useState(false);
  let joinedText = "";
  if (createdAt) {
    const date = new Date(createdAt);
    const mes = date.toLocaleString("es-ES", { month: "long" });
    const año = date.getFullYear();
    joinedText = `Se unió en ${
      mes.charAt(0).toLowerCase() + mes.slice(1) + ` de `
    } ${año}`;
  }

  const plainBio = (biography ?? "").replace(/\r?\n/g, " ");
  const needsToggle = plainBio.length > 150;

  // Función para renderizar el badge del rol
  const renderRoleBadge = () => {
    switch (roleId) {
      case 1:
        return (
          <Badge variant="admin" className="ml-2">
            ADMIN
          </Badge>
        );
      case 2:
        return (
          <Badge variant="mod" className="ml-2">
            MOD
          </Badge>
        );
      case 3:
        return (
          <Badge variant="writer" className="ml-2">
            REDACTOR
          </Badge>
        );
      case 4:
        return (
          <div 
            title="Verificado" 
            className="ml-1 cursor-help inline-flex"
          >
            <Badge variant="verified" className="flex items-center gap-1">
              <svg className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </Badge>
          </div>
        );
      case 5:
      default:
        return null; // No badge for reader role
    }
  };

  return (
    <div className={className}>
      {fullname ? (
        <>
          {/* Si hay fullname, mostramos nombre completo con botón en la primera línea */}
          <div id="social-media" className="flex items-center gap-2">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">{fullname}</h1>
              {renderRoleBadge()}
            </div>
            <div className="flex-grow"></div>
            {followButton && (
              <div className="flex-shrink-0 relative z-10 pointer-events-auto">
                {followButton}
              </div>
            )}
            <Separator orientation="vertical" className="flex-shrink-0" />
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
        </>
      ) : (
        <>
          {/* Si no hay fullname, mostramos username con botón de seguir */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <p id="username" className="text-gray-600 text-2xl font-bold">
                @{username}
              </p>
              {renderRoleBadge()}
            </div>
            <div className="flex-grow"></div>
            {followButton && (
              <div className="flex-shrink-0">{followButton}</div>
            )}
          </div>
          {/* Redes sociales en segunda línea cuando no hay fullname */}
          <div id="social-media" className="flex items-center gap-2 mt-2">
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
        </>
      )}

      {joinedText && <p className="text-gray-400 text-sm">{joinedText}</p>}
      <div className="mt-2">
        <p id="bio" className={`text-gray-500 ${!expanded ? "bio-clamp" : ""}`}>
          {biography || "Sin biografía"}
        </p>

        {needsToggle && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-1 text-sm text-violet-600 hover:underline cursor-pointer"
          >
            {expanded ? "Ver menos" : "Ver más"}
          </button>
        )}
      </div>
    </div>
  );
};
