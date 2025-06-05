import Image from "next/image";

export const ProfilePhoto = ({
  src,
  className,
}: {
  src: string;
  className?: string;
}) => {
  return (
    <div className={className}>
      <Image
        src={src || "/default-avatar.jpg"}
        alt="Foto de perfil"
        width={180}
        height={180}
        className="rounded-full border-4 border-white"
      />
    </div>
  );
};
