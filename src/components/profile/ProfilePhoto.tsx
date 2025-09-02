import { DEFAULT_AVATAR_URL } from "@/constants/registerConstants";
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
        src={src || DEFAULT_AVATAR_URL}
        alt="Foto de perfil"
        width={180}
        height={180}
        className="rounded-full border-4 border-white"
      />
    </div>
  );
};
