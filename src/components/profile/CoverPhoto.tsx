import Image from "next/image";

export const CoverPhoto = ({ src }: { src: string }) => {
  return (
    <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 bg-gray-300">
      <Image
        src={src || "/default-cover.png"}
        alt="Foto de portada"
        fill
        style={{ objectFit: "cover" }}
        className="w-full h-full"
        sizes="100vw"
      />
    </div>
  );
};
