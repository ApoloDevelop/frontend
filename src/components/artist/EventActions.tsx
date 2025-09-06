type EventActionsProps = {
  eventLink?: string | null;
  artistName: string;
};

export function EventActions({ eventLink, artistName }: EventActionsProps) {
  return (
    <div className="flex justify-between items-center mt-4">
      {/* Ver más eventos */}
      <a
        href={`/artists/${artistName}/events`}
        className="text-purple-600 hover:underline text-sm"
      >
        Ver más eventos
      </a>

      {/* Comprar entradas */}
      {eventLink && (
        <a
          href={eventLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Comprar entradas
        </a>
      )}
    </div>
  );
}
