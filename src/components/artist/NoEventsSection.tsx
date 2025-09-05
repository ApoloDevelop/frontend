type NoEventsSectionProps = {
  message: string;
};

export function NoEventsSection({ message }: NoEventsSectionProps) {
  return (
    <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-2">Cerca de ti</h2>
      <p className="text-gray-500">{message}</p>
    </section>
  );
}
