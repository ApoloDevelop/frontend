interface StarRatingProps {
  score: number;
  hovered: number | null;
  onScoreChange: (score: number) => void;
  onHover: (score: number | null) => void;
}

export function StarRating({
  score,
  hovered,
  onScoreChange,
  onHover,
}: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 10 }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onScoreChange(i + 1)}
          onMouseEnter={() => onHover(i + 1)}
          onMouseLeave={() => onHover(null)}
          aria-label={`Puntuar ${i + 1}`}
          className={`text-3xl transition-colors ${
            (hovered !== null ? i < hovered : i < score)
              ? "text-yellow-400"
              : "text-gray-300"
          } cursor-pointer`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
