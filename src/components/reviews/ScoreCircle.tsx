"use client";
import React, { useId } from "react";

export function ScoreCircle({
  score,
  label = "",
  size = 72,
  strokeWidth = 8,
  ariaLabel,
}: {
  score: number | null;
  label?: string;
  size?: number;
  strokeWidth?: number;
  ariaLabel?: string;
}) {
  const id = useId();
  const radius = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * radius;
  const pct =
    typeof score === "number" ? Math.max(0, Math.min(10, score)) / 10 : 0;
  const offset = circ * (1 - pct);

  const [from, to] = colorStops(score);

  return (
    <div className="flex flex-col items-center" aria-label={ariaLabel}>
      {label ? <span className="font-medium mb-1">{label}</span> : null}

      <svg width={size} height={size} role="img" aria-hidden={false}>
        <defs>
          <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>

        {/* fondo */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="white" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* progreso */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#grad-${id})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 450ms ease" }}
        />

        {/* valor */}
        <text
          x="50%"
          y="54%"
          textAnchor="middle"
          fontSize={Math.round(size * 0.34)}
          fontWeight="700"
          fill="#111827"
        >
          {score !== null ? score.toFixed(1) : "—"}
        </text>
      </svg>
    </div>
  );
}

function colorStops(score: number | null): [string, string] {
  if (score === null) return ["#9CA3AF", "#D1D5DB"]; // gris
  if (score >= 9.5) return ["#0ea5e9", "#22d3ee"]; // azul→cian
  if (score >= 8.5) return ["#16a34a", "#4ade80"]; // verde
  if (score >= 7.5) return ["#65a30d", "#a3e635"]; // lima
  if (score >= 6.0) return ["#ca8a04", "#facc15"]; // ámbar
  if (score >= 4.5) return ["#ea580c", "#fb923c"]; // naranja
  return ["#dc2626", "#f87171"]; // rojo
}
