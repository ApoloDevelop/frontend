import Image from "next/image";

interface ArtistEventsHeaderProps {
  artistName: string;
  imageUrl?: string;
}

export default function ArtistEventsHeader({
  artistName,
  imageUrl,
}: ArtistEventsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center mb-6 sm:mb-8">
      {/* Avatar superpuesto */}
      <div className="relative -mt-14 sm:-mt-20 md:-mt-28 z-10">
        <Image
          src={imageUrl || "/default-cover.png"}
          alt={artistName}
          width={200}
          height={200}
          className="rounded-lg object-cover shadow-lg w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48"
        />
      </div>

      {/* Título y descripción */}
      <div className="ml-0 sm:ml-6 mt-2 sm:mt-0 flex-1">
        <h1 className="text-5xl font-bold text-black">
          Eventos de {artistName}
        </h1>
        <p className="text-lg text-gray-600 mt-1">Conciertos y giras</p>
      </div>
    </div>
  );
}
