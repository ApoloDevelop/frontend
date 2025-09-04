"use client";
import { ChartContainer, ChartTooltip, ChartLegend } from "../ui/chart";
import { BarChart, Bar, XAxis, YAxis, Cell } from "recharts";

interface ReviewHistogramProps {
  histogram: { name: string; count: number }[];
  maxCount: number;
  filterScore: number | null;
  onBarClick: (bucket: number) => void;
}

export function ReviewHistogram({
  histogram,
  maxCount,
  filterScore,
  onBarClick,
}: ReviewHistogramProps) {
  const yTicks = Array.from({ length: maxCount + 1 }, (_, i) => i);

  return (
    <ChartContainer
      id="reviews-histogram"
      config={{ count: { label: "Puntuaciones" } }}
      className="mb-4 sm:mb-6 h-32 sm:h-40 md:h-48 w-full shrink-0"
    >
      <BarChart
        data={histogram}
        margin={{ top: 8, right: 12, bottom: 12, left: 12 }}
      >
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis
          domain={[0, maxCount]}
          ticks={yTicks}
          allowDecimals={false}
          tick={{ fontSize: 12 }}
        />
        <ChartTooltip />
        <ChartLegend />
        <Bar
          dataKey="count"
          name="Puntuaciones (pulsa para filtrar)"
          legendType="star"
          barSize={18}
        >
          {histogram.map((_, idx) => {
            const bucket = idx + 1;
            const active = filterScore === bucket;
            return (
              <Cell
                key={`cell-${idx}`}
                cursor="pointer"
                fill={active ? "#59168B" : "#C7A3DB"}
                onClick={() => onBarClick(bucket)}
              />
            );
          })}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
