interface CarouselIndicatorsProps {
  itemsLength: number;
  currentIndex: number;
  onSlideTo: (index: number) => void;
}

export function CarouselIndicators({
  itemsLength,
  currentIndex,
  onSlideTo,
}: CarouselIndicatorsProps) {
  if (itemsLength <= 1) return null;

  return (
    <div
      className="mt-6 flex justify-center gap-2"
      aria-label="Indicadores de página"
    >
      {Array.from({ length: itemsLength }, (_, i) => (
        <button
          key={i}
          onClick={() => onSlideTo(i)}
          aria-label={`Ir al slide ${i + 1}`}
          className={`h-2 rounded-full transition-all duration-200 cursor-pointer
            ${
              i === currentIndex
                ? "bg-black w-6 shadow-sm"
                : "bg-black/30 hover:bg-black/40 w-2"
            }`}
        />
      ))}
    </div>
  );
}
