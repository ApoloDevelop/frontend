interface Collaborator {
  role: string;
  names: string[];
}

interface SongCreditsProps {
  collaboratorsByRole: Collaborator[];
}

export function SongCredits({ collaboratorsByRole }: SongCreditsProps) {
  return (
    <section aria-labelledby="collabs-title">
      <h2 id="collabs-title" className="mb-3 text-2xl font-semibold">
        Créditos
      </h2>
      {collaboratorsByRole.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {collaboratorsByRole.map(({ role, names }) => (
            <div key={role} className="rounded-xl border p-4 bg-white">
              <h3 className="font-semibold mb-1">{role}</h3>
              <p className="text-gray-700">{names.join(", ")}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No hay colaboradores disponibles.</p>
      )}
    </section>
  );
}
