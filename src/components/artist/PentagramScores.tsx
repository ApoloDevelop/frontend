import { ScoreCircle } from "./ScoreCircle";

export function PentagramScores({
  verified,
  unverified,
}: {
  verified: number | null;
  unverified: number | null;
}) {
  return (
    <div className="w-full flex flex-col items-center mb-8">
      {/* Circulos y pentagrama */}
      <div className="relative w-[700px] h-[100px] flex items-center justify-center">
        {/* Pentagrama SVG */}
        <svg
          className="absolute left-0 top-[-2px]"
          width="700"
          height="160"
          viewBox="0 0 700 160"
        >
          {/* Líneas del pentagrama */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={0}
              x2={700}
              y1={40 + i * 20}
              y2={40 + i * 20}
              stroke="#333"
              strokeWidth={3}
            />
          ))}
          {/* Línea vertical central */}
          <line
            x1={350}
            x2={350}
            y1={40}
            y2={120}
            stroke="#333"
            strokeWidth={4}
          />
        </svg>
        {/* Circulos y textos */}
        <div className="absolute left-[100px] top-0 flex flex-col items-center">
          <span className="font-semibold text-lg mb-2">Verificadas</span>
          <ScoreCircle score={verified} label="" />
        </div>
        <div className="absolute right-[100px] top-0 flex flex-col items-center">
          <span className="font-semibold text-lg mb-2">Generales</span>
          <ScoreCircle score={unverified} label="" />
        </div>
      </div>
    </div>
  );
}
