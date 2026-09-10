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

type BudgetChartProps = {
  initialSnapshot:
    RoundSnapshot | null;

  history: RoundSnapshot[];

  currentWeek: number;

  currentBudget: number;
};

export default function BudgetChart({
  initialSnapshot,
  history,
  currentWeek,
  currentBudget,
}: BudgetChartProps) {
  const chartData: {
    week: string;
    budget: number;
  }[] = [];

  // ============================================
  // ESTADO INICIAL
  // ============================================

  if (initialSnapshot) {
    chartData.push({
      week: "Inicio",
      budget:
        initialSnapshot.budget,
    });
  }

  // ============================================
  // SEMANAS FINALIZADAS
  // ============================================

  history.forEach(
    (snapshot) => {
      chartData.push({
        week: `S${snapshot.week}`,
        budget:
          snapshot.budget,
      });
    }
  );

  // ============================================
  // SEMANA ACTUAL EN VIVO
  // ============================================

  if (currentWeek > 0) {
    chartData.push({
      week: `S${currentWeek}`,
      budget:
        currentBudget,
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
          Presupuesto
        </p>

        <p
          className="
            text-xs
            text-slate-500
          "
        >
          Evolución del capital disponible
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
              tick={{
                fill: "#475569",
                fontSize: 11,
              }}
              axisLine={{
                stroke: "#cbd5e1",
              }}
              tickFormatter={(value) =>
                `$${Number(
                  value
                ).toLocaleString(
                  "es-AR"
                )}`
              }
            />

            <Tooltip
              formatter={(value) => [
                `$${Number(
                  value
                ).toLocaleString(
                  "es-AR"
                )}`,
                "Presupuesto",
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
              dataKey="budget"
              stroke="#d99a00"
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "#d99a00",
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