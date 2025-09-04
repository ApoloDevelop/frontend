import Link from "next/link";

type MissingLocationSectionProps = {
  profileEditHref: string;
};

export function MissingLocationSection({
  profileEditHref,
}: MissingLocationSectionProps) {
  return (
    <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-2">Cerca de ti</h2>
      <p className="text-gray-700">
        No podemos mostrarte el evento más cercano porque en tu perfil falta la{" "}
        <strong>ciudad</strong> y/o el <strong>país</strong>.
      </p>
      <p className="mt-2">
        Añádelos en{" "}
        <Link href={profileEditHref} className="underline font-medium">
          editar perfil
        </Link>
        .
      </p>
    </section>
  );
}
