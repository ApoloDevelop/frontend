interface SongSourceInfoProps {
  label: string | null;
  distributor: string | null;
}

export function SongSourceInfo({ label, distributor }: SongSourceInfoProps) {
  return (
    <section aria-labelledby="label-title">
      <h2 id="label-title" className="mb-3 text-2xl font-semibold">
        Fuente
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border p-4 bg-white md:col-span-2">
          <h3 className="font-semibold mb-2">Sello</h3>
          <p className="text-gray-700">
            {label ?? ""}
            {distributor ? ` · ${distributor}` : ""}
          </p>
        </div>
      </div>
    </section>
  );
}
