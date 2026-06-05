import Link from "next/link";

export function NoUserSection() {
  return (
    <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-2">Cerca de ti</h2>
      <p className="text-gray-700">
        No podemos mostrarte el evento más cercano porque no has iniciado
        sesión.
      </p>
      <p className="mt-2">
        <Link href="/login" className="underline font-medium">
          Inicia sesión
        </Link>{" "}
        para ver eventos cerca de tu ubicación.
      </p>
    </section>
  );
}
