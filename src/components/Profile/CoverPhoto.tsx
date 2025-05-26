import Image from "next/image";

export const CoverPhoto = ({ src }: { src: string }) => {
  return (
    <div className="relative w-full h-64 bg-gray-300">
      <Image
        src={src || "/default-cover.png"}
        alt="Foto de portada"
        layout="fill"
        objectFit="cover"
        className="w-full h-full"
      />
    </div>
  );
};
