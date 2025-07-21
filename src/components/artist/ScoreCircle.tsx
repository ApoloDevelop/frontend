export function ScoreCircle({
  score,
  label,
}: {
  score: number | null;
  label: string;
}) {
  const pct = score ? score / 10 : 0;
  const radius = 32;
  const stroke = 8;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - pct); // Ajuste para reflejar la puntuación

  const color =
    score === 10
      ? "#00cfff" // Azul celeste
      : score !== null && score >= 8.5
      ? "#006400" // Verde oscuro
      : score !== null && score >= 7.5
      ? "#32cd32" // Verde lima
      : score !== null && score >= 5
      ? "#ffa500" // Naranja
      : "#ff0000"; // Rojo

  return (
    <div className="flex flex-col items-center w-32">
      <span className="font-semibold mb-1">{label}</span>
      <svg width={72} height={72}>
        <circle cx={36} cy={36} r={radius} fill="white" />
        <circle
          cx={36}
          cy={36}
          r={radius}
          stroke="#eee"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={36}
          cy={36}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={offset} // Ajuste para iniciar a las 12 en punto
          strokeLinecap="round"
          transform="rotate(-90 36 36)" // Rotación para iniciar a las 12 en punto
          style={{ transition: "stroke-dashoffset 0.5s" }}
        />
        <text
          x="35"
          y="45"
          textAnchor="middle"
          fontSize="1.7rem"
          fontWeight="bold"
          fill="#222"
          style={{ backgroundColor: "white" }}
        >
          {score !== null ? score.toFixed(1) : "—"}
        </text>
      </svg>
    </div>
  );
}
