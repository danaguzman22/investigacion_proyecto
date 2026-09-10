"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  RoundSnapshot,
} from "@/types/game";

type LeadTimeChartProps = {
  initialSnapshot:
    RoundSnapshot | null;

  history: RoundSnapshot[];

  currentWeek: number;

  currentLeadTime: number;
};

export default function LeadTimeChart({
  initialSnapshot,
  history,
  currentWeek,
  currentLeadTime,
}: LeadTimeChartProps) {
  const chartData: {
    week: string;
    leadTime: number;
  }[] = [];

  // ============================================
  // ESTADO INICIAL
  // ============================================

  if (initialSnapshot) {
    chartData.push({
      week: "Inicio",

      leadTime:
        initialSnapshot.leadTime,
    });
  }

  // ============================================
  // SEMANAS FINALIZADAS
  // ============================================

  history.forEach(
    (snapshot) => {
      chartData.push({
        week:
          `S${snapshot.week}`,

        leadTime:
          snapshot.leadTime,
      });
    }
  );

  // ============================================
  // SEMANA ACTUAL EN VIVO
  // ============================================

  if (currentWeek > 0) {
    chartData.push({
      week:
        `S${currentWeek}`,

      leadTime:
        currentLeadTime,
    });
  }

  return (
    <div
      className="
        h-[280px]
        w-full
        rounded-xl
        border
        border-slate-200
        bg-white
        p-4
      "
    >
      <div className="mb-2">
        <p
          className="
            text-sm
            font-black
            uppercase
            tracking-wide
            text-[#0b3159]
          "
        >
          Lead Time
        </p>

        <p
          className="
            text-xs
            text-slate-500
          "
        >
          Evolución de días promedio
        </p>
      </div>

      <div className="h-[215px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={chartData}
            margin={{
              top: 15,
              right: 20,
              left: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
            />

            <XAxis
              dataKey="week"
              stroke="#64748b"
              tick={{
                fill: "#475569",
                fontSize: 11,
              }}
              axisLine={{
                stroke: "#cbd5e1",
              }}
            />

            <YAxis
              stroke="#64748b"
              allowDecimals={false}
              tick={{
                fill: "#475569",
                fontSize: 11,
              }}
              axisLine={{
                stroke: "#cbd5e1",
              }}
              tickFormatter={(value) =>
                `${value} d`
              }
            />

            <Tooltip
              formatter={(value) => [
                `${Number(
                  value
                )} días`,
                "Lead Time",
              ]}
              contentStyle={{
                backgroundColor:
                  "#ffffff",

                border:
                  "1px solid #cbd5e1",

                borderRadius:
                  "10px",

                color:
                  "#0f172a",

                boxShadow:
                  "0 8px 20px rgba(15,23,42,0.12)",
              }}
            />

            <Line
              type="monotone"
              dataKey="leadTime"
              stroke="#1688e5"
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "#1688e5",
                stroke:
                  "#ffffff",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 7,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}