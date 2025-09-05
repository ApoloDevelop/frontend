"use client";

import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import Flag from "react-world-flags";

interface ArtistBioProps {
  details: {
    fullName?: string | null;
    birthDate?: string | null;
    birthPlace?: string | null;
    birthCountryCode?: string | null;
  } | null;
  genres: string[];
  bio?: string | null;
}

export const ArtistBio: React.FC<ArtistBioProps> = ({
  details,
  genres,
  bio,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const bioRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (bioRef.current) {
      // Verifica si el contenido sobrepasa el límite
      setIsOverflowing(
        bioRef.current.scrollHeight > bioRef.current.clientHeight
      );
    }
  }, [bio]);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };
  return (
    <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
      <h2 className="mb-4 text-3xl font-bold">Biografía</h2>
      {bio ? (
        <div>
          <p
            ref={bioRef}
            className={`text-gray-600 italic ${
              isExpanded ? "line-clamp-none" : "line-clamp-2"
            }`}
          >
            {bio}
          </p>
          {isOverflowing && (
            <button
              onClick={toggleExpand}
              className="mt-2 text-purple-600 hover:underline cursor-pointer"
            >
              {isExpanded ? "Ver menos" : "Ver más"}
            </button>
          )}
        </div>
      ) : null}
      {details ? (
        <div className="grid grid-cols-1 gap-x-8 gap-y-2 text-lg sm:grid-cols-2 mt-3">
          <div>
            <span className="font-semibold">Nombre completo:</span>{" "}
            {details.fullName ?? "Desconocido"}
          </div>
          <div>
            <span className="font-semibold">Fecha de nacimiento:</span>{" "}
            {details.birthDate
              ? dayjs(details.birthDate).format("DD/MM/YYYY")
              : "Desconocida"}
          </div>
          <div className="col-span-1 sm:col-span-2 flex items-center gap-2">
            <span className="font-semibold">Lugar de nacimiento:</span>
            <span>{details.birthPlace || "Desconocido"}</span>
            {details.birthCountryCode ? (
              <Flag code={details.birthCountryCode} className="h-5 w-5" />
            ) : null}
          </div>
          <div className="col-span-1 sm:col-span-2">
            <span className="font-semibold">Géneros:</span>{" "}
            {genres?.length ? genres.join(", ") : "No disponibles"}
          </div>
        </div>
      ) : null}
    </section>
  );
};
