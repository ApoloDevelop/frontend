import Image from "next/image";

export const ProfilePhoto = ({ src }: { src: string }) => {
  return (
    <div className="absolute bottom-0 left-6 transform translate-y-1/2">
      <Image
        src={src || "/default-avatar.jpg"}
        alt="Foto de perfil"
        width={120}
        height={120}
        className="rounded-full border-4 border-white"
      />
    </div>
  );
};
