"use client";

import { type ReactNode } from "react";

import Image from "next/image";

import {
  Inter,
  Montserrat,
} from "next/font/google";

import {
  Boxes,
  CalendarDays,
  Coins,
  Flag,
  Gauge,
  Target,
  Timer,
} from "lucide-react";

import { useGameState } from "@/hooks/useGameState";
import { useRoundTimer } from "@/hooks/useRoundTimer";

import BudgetChart from "@/components/display/BudgetChart";
import LeadTimeChart from "@/components/display/LeadTimeChart";

import {
  calculateGoalProgress,
  getGameResult,
} from "@/lib/calculations";

// ============================================
// FUENTES
// ============================================

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  weight: [
    "600",
    "700",
    "800",
    "900",
  ],
});

// ============================================
// TIPOS AUXILIARES
// ============================================

type TrendTone =
  | "positive"
  | "negative"
  | "neutral";

// ============================================
// DISPLAY
// ============================================

export default function DisplayPage() {
  const {
    gameState,
    isLoaded,
  } = useGameState();

  const timerSeconds =
    useRoundTimer(gameState);

  if (!isLoaded) {
    return (
      <main
        className={`
          ${inter.className}
          flex
          min-h-screen
          items-center
          justify-center
          bg-slate-100
        `}
      >
        <p className="text-xl font-semibold text-slate-700">
          Cargando simulación...
        </p>
      </main>
    );
  }

  // ============================================
  // TEMPORIZADOR
  // ============================================

  const timerMinutes =
    Math.floor(
      timerSeconds / 60
    );

  const timerRemainingSeconds =
    timerSeconds % 60;

  const formattedTimer =
    `${timerMinutes
      .toString()
      .padStart(2, "0")}:` +
    `${timerRemainingSeconds
      .toString()
      .padStart(2, "0")}`;

  // ============================================
  // RESULTADO
  // ============================================

  const isGameFinished =
    gameState.timerStatus ===
      "finished" ||
    gameState.currentWeek === 0;

  const displayTimer =
    isGameFinished
      ? "00:00"
      : formattedTimer;

  const gameResult =
    getGameResult(
      gameState.goals
    );

  const goalProgress =
    calculateGoalProgress(
      gameState.goals
    );

  // ============================================
  // SERIES PARA MINI GRÁFICOS
  // ============================================

  const leadTimeSeries: number[] =
    [];

  const budgetSeries: number[] =
    [];

  if (gameState.initialSnapshot) {
    leadTimeSeries.push(
      gameState.initialSnapshot
        .leadTime
    );

    budgetSeries.push(
      gameState.initialSnapshot
        .budget
    );
  }

  gameState.history.forEach(
    (snapshot) => {
      leadTimeSeries.push(
        snapshot.leadTime
      );

      budgetSeries.push(
        snapshot.budget
      );
    }
  );

  /*
   * Si todavía hay una semana activa,
   * agregamos el estado vivo.
   */
  if (gameState.currentWeek > 0) {
    leadTimeSeries.push(
      gameState.leadTime
    );

    budgetSeries.push(
      gameState.budget
    );
  }

  // ============================================
  // TENDENCIA VS. INICIO
  // ============================================

  const initialLeadTime =
    gameState.initialSnapshot
      ?.leadTime ?? null;

  const initialBudget =
    gameState.initialSnapshot
      ?.budget ?? null;

  const leadTimeDifference =
    initialLeadTime === null
      ? null
      : gameState.leadTime -
        initialLeadTime;

  const budgetDifference =
    initialBudget === null
      ? null
      : gameState.budget -
        initialBudget;

  const leadTrend =
    getLeadTimeTrend(
      leadTimeDifference
    );

  const budgetTrend =
    getBudgetTrend(
      budgetDifference
    );

  const resultStyle =
    getResultStyle(
      gameResult.level
    );


  return (
    <main
      className={`
        ${inter.className}
        relative
        isolate
        min-h-screen
        overflow-x-hidden
        text-slate-900
      `}
    >
      {/* ======================================
          FONDO
      ====================================== */}

      <div
        className="
          fixed
          inset-0
          z-0
          bg-cover
          bg-center
          bg-no-repeat
        "
        style={{
          backgroundImage:
            "url('/fondo.png')",
        }}
      />

      {/* capa general muy suave */}

      <div
        className="
          fixed
          inset-0
          z-10
          bg-slate-50/[0.06]
        "
      />

      {/* ======================================
          DASHBOARD
      ====================================== */}

      <div
        className="
          relative
          z-20
          min-h-screen
          w-full
          px-5
          py-4
          2xl:px-8
          2xl:py-6
        "
      >
        {/* ====================================
            HEADER GLASS
        ==================================== */}

        <header
          className="
            mb-4
            flex
            items-center
            justify-between
            gap-7
            rounded-2xl
            border
            border-white/70
            bg-white/[0.76]
            px-7
            py-4
            shadow-[0_12px_40px_rgba(15,23,42,0.12)]
            backdrop-blur-xl
          "
        >
          {/* ==================================
              IZQUIERDA
          ================================== */}

          <div
            className="
              flex
              min-w-0
              items-center
              gap-8
            "
          >
            {/* LOGO */}

            <div
              className="
                flex
                shrink-0
                items-center
              "
            >
              <Image
                src="/logo.png"
                alt="Nexus - Tablero de simulación"
                width={320}
                height={110}
                priority
                className="
                  h-auto
                  w-[220px]
                  object-contain
                  lg:w-[260px]
                  2xl:w-[300px]
                "
              />
            </div>

            {/* SEPARADOR */}

            <div
              className="
                hidden
                h-16
                w-px
                shrink-0
                bg-slate-400/40
                lg:block
              "
            />

            {/* FRASE */}

            <div
              className="
                hidden
                lg:block
              "
            >
              <p
                className="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.34em]
                  text-slate-500
                "
              >
                Decisiones hoy
              </p>

              <p
                className={`
                  ${montserrat.className}
                  mt-1
                  whitespace-nowrap
                  text-2xl
                  font-extrabold
                  uppercase
                  tracking-[0.10em]
                  text-[#0b3159]
                `}
              >
                Mejores mañanas
              </p>

              {/* SEPARADORES */}

              <div
                className="
                  mt-3
                  hidden
                  items-center
                  gap-2
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-slate-500
                  xl:flex
                "
              >
                <span>
                  Analiza
                </span>

                <span className="text-slate-300">
                  |
                </span>

                <span>
                  Decide
                </span>

                <span className="text-slate-300">
                  |
                </span>

                <span>
                  Ejecuta
                </span>

                <span className="text-slate-300">
                  |
                </span>

                <span>
                  Evoluciona
                </span>
              </div>
            </div>
          </div>

          {/* ==================================
              SEMANA + TIMER
          ================================== */}

          <div
            className="
              flex
              shrink-0
              items-stretch
              gap-3
            "
          >
            {/* ================================
                SEMANA
            ================================ */}

            <div
              className="
                flex
                h-[92px]
                w-[215px]
                items-center
                justify-center
                gap-5
                rounded-xl
                border
                border-blue-900/20
                bg-[#0b3159]/95
                px-6
                text-white
                shadow-lg
                backdrop-blur-md
              "
            >
              <CalendarDays
                size={38}
                strokeWidth={1.9}
                className="
                  shrink-0
                  text-sky-300
                "
              />

              <div className="text-center">

                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.24em]
                    text-blue-100
                  "
                >
                  Semana
                </p>

                {isGameFinished ? (
                  <p
                    className={`
                      ${montserrat.className}
                      mt-1
                      text-2xl
                      font-extrabold
                      tracking-wider
                    `}
                  >
                    FINAL
                  </p>
                ) : (
                  <p
                    className={`
                      ${montserrat.className}
                      mt-1
                      text-6xl
                      font-black
                      leading-[0.82]
                    `}
                  >
                    {
                      gameState.currentWeek
                    }
                  </p>
                )}
              </div>
            </div>

            {/* ================================
                TIMER
            ================================ */}

            <div
              className="
                flex
                h-[92px]
                w-[300px]
                items-center
                justify-center
                gap-5
                rounded-xl
                border
                border-white/80
                bg-white/[0.88]
                px-6
                shadow-lg
                backdrop-blur-xl
              "
            >
              <Timer
                size={39}
                strokeWidth={1.9}
                className="
                  shrink-0
                  text-[#0b3159]
                "
              />

              <div
                className="
                  min-w-[165px]
                "
              >
                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-[#0b3159]
                  "
                >
                  Tiempo restante
                </p>

                <p
                  className={`
                    ${montserrat.className}
                    mt-1
                    text-5xl
                    font-extrabold
                    leading-[0.82]
                    tabular-nums
                    text-[#0b3159]
                  `}
                >
                  {displayTimer}
                </p>

                <p
                  className="
                    mt-2
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-slate-400
                  "
                >
                  {gameState.timerStatus ===
                    "idle" &&
                    "Esperando inicio"}

                  {gameState.timerStatus ===
                    "running" &&
                    "Ronda en curso"}

                  {gameState.timerStatus ===
                    "paused" &&
                    "Ronda pausada"}

                  {isGameFinished &&
                    "Simulación finalizada"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ====================================
            KPI CARDS
        ==================================== */}

        <section
          className="
            mb-4
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          {/* LEAD TIME */}

          <MetricCard
            title="Lead Time"
            subtitle="Días promedio"
            value={`${gameState.leadTime}`}
            icon={
              <Timer size={40} />
            }
            variant="blue"
            trendText={
              leadTrend.text
            }
            trendTone={
              leadTrend.tone
            }
            sparklineValues={
              leadTimeSeries
            }
          />

          {/* INVENTARIO */}

          <MetricCard
            title="Inventario"
            subtitle="Estado actual"
            value={
              gameState.inventory
            }
            icon={
              <Boxes size={40} />
            }
            variant="green"
            trendText="Nivel actual de inventario"
            trendTone="neutral"
          />

          {/* PRESUPUESTO */}

          <MetricCard
            title="Presupuesto"
            subtitle="Capital disponible"
            value={`$${gameState.budget.toLocaleString(
              "es-AR"
            )}`}
            icon={
              <Coins size={40} />
            }
            variant="gold"
            trendText={
              budgetTrend.text
            }
            trendTone={
              budgetTrend.tone
            }
            sparklineValues={
              budgetSeries
            }
          />

          {/* INDICADOR */}

          <MetricCard
            title={
              gameState
                .customMetric
                .name ||
              "Indicador"
            }
            subtitle={
              gameState
                .customMetric
                .unit ||
              "Valor actual"
            }
            value={`${gameState.customMetric.value}`}
            icon={
              <Gauge size={40} />
            }
            variant="purple"
            trendText="Indicador configurable"
            trendTone="neutral"
          />
        </section>

        {/* ====================================
            SITUACIÓN ACTUAL
        ==================================== */}

        {gameState.currentEvent && (
          <section
            className="
              mb-4
              overflow-hidden
              rounded-2xl
              border
              border-sky-300/30
              bg-[#17324d]/85
              shadow-[0_12px_30px_rgba(15,23,42,0.18)]
              backdrop-blur-xl
            "
          >
            <div
              className="
                flex
                flex-wrap
                items-center
                justify-between
                gap-5
                px-6
                py-4
              "
            >
              <div className="min-w-0 flex-1">
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-sky-300/20
                      bg-sky-300/10
                      text-lg
                      font-black
                      text-sky-200
                    "
                  >
                    !
                  </div>

                  <div>
                    <p
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.20em]
                        text-sky-300
                      "
                    >
                      Situación actual
                    </p>

                    <p
                      className="
                        mt-1
                        text-base
                        font-medium
                        leading-relaxed
                        text-white
                        2xl:text-lg
                      "
                    >
                      {gameState.currentEvent}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="
                  shrink-0
                  rounded-full
                  border
                  border-sky-200/20
                  bg-white/[0.06]
                  px-4
                  py-2
                "
              >
                <p
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-sky-200
                  "
                >
                  Semana {gameState.currentWeek}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ====================================
            RESULTADO FINAL SOBRIO
        ==================================== */}

        {isGameFinished && (
          <section
            className={`
              mb-4
              overflow-hidden
              rounded-2xl
              border
              ${resultStyle.border}
              bg-[#1c2c3f]/85
              shadow-[0_18px_45px_rgba(15,23,42,0.25)]
              backdrop-blur-xl
            `}
          >
            <div
              className="
                flex
                flex-wrap
                items-center
                justify-between
                gap-7
                px-8
                py-6
              "
            >
              {/* RESULTADO */}

              <div
                className="
                  flex
                  max-w-4xl
                  items-start
                  gap-5
                "
              >
                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/15
                    bg-white/10
                    text-slate-100
                  "
                >
                  <Flag
                    size={25}
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-3
                    "
                  >
                    <p
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.26em]
                        text-slate-400
                      "
                    >
                      Resultado final
                    </p>

                    <span
                      className={`
                        rounded-full
                        border
                        px-3
                        py-1
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.16em]
                        ${resultStyle.badge}
                      `}
                    >
                      Simulación completada
                    </span>
                  </div>

                  <h2
                    className={`
                      ${montserrat.className}
                      mt-2
                      text-3xl
                      font-extrabold
                      tracking-tight
                      text-white
                      2xl:text-4xl
                    `}
                  >
                    {
                      gameResult.title
                    }
                  </h2>

                  <p
                    className="
                      mt-2
                      max-w-3xl
                      text-sm
                      font-normal
                      leading-relaxed
                      text-slate-300
                      2xl:text-base
                    "
                  >
                    {
                      gameResult.message
                    }
                  </p>
                </div>
              </div>

              {/* ESTADÍSTICAS */}

              <div
                className="
                  grid
                  min-w-[350px]
                  grid-cols-2
                  divide-x
                  divide-white/15
                  rounded-xl
                  border
                  border-white/10
                  bg-black/10
                  px-3
                  py-4
                "
              >
                <div
                  className="
                    px-5
                    text-center
                  "
                >
                  <p
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-slate-400
                    "
                  >
                    Metas cumplidas
                  </p>

                  <p
                    className={`
                      ${montserrat.className}
                      mt-1
                      text-3xl
                      font-extrabold
                      text-white
                    `}
                  >
                    {
                      gameResult
                        .completedGoals
                    }
                    {" / "}
                    {
                      gameResult
                        .totalGoals
                    }
                  </p>
                </div>

                <div
                  className="
                    px-5
                    text-center
                  "
                >
                  <p
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-slate-400
                    "
                  >
                    Cumplimiento
                  </p>

                  <p
                    className={`
                      ${montserrat.className}
                      mt-1
                      text-3xl
                      font-extrabold
                      text-white
                    `}
                  >
                    {
                      gameResult
                        .percentage
                    }
                    %
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ====================================
            METAS + EVOLUCIÓN
        ==================================== */}

        <section
          className="
            grid
            grid-cols-1
            gap-4
            xl:grid-cols-[0.92fr_1.38fr]
          "
        >
          {/* ==================================
              METAS
          ================================== */}

          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-white/70
              bg-white/[0.88]
              shadow-[0_12px_35px_rgba(15,23,42,0.12)]
              backdrop-blur-xl
            "
          >
            {/* CABECERA */}

            <div
              className="
                flex
                items-center
                justify-between
                bg-[#0b3159]/95
                px-6
                py-3
                text-white
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <Target
                  size={25}
                  strokeWidth={1.9}
                  className="text-sky-300"
                />

                <h2
                  className={`
                    ${montserrat.className}
                    text-base
                    font-bold
                    uppercase
                    tracking-[0.04em]
                    2xl:text-lg
                  `}
                >
                  Metas de la simulación
                </h2>
              </div>

              <span
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-blue-200
                "
              >
                {
                  goalProgress.completed
                }
                {" / "}
                {
                  goalProgress.total
                }
                {" cumplidas"}
              </span>
            </div>

            {/* PROGRESO */}

            <div
              className="
                border-b
                border-slate-200/80
                px-6
                py-4
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-slate-500
                "
              >
                <span>
                  Progreso general
                </span>

                <span>
                  {
                    goalProgress.percentage
                  }
                  %
                </span>
              </div>

              <div
                className="
                  mt-2
                  h-[6px]
                  overflow-hidden
                  rounded-full
                  bg-slate-200
                "
              >
                <div
                  className="
                    h-full
                    rounded-full
                    bg-emerald-500
                    transition-all
                    duration-500
                  "
                  style={{
                    width:
                      `${goalProgress.percentage}%`,
                  }}
                />
              </div>
            </div>

            {/* LISTADO */}

            <div
              className="
                divide-y
                divide-slate-200/80
              "
            >
              {gameState.goals.map(
                (goal) => (
                  <div
                    key={goal.id}
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                      px-6
                      py-4
                    "
                  >
                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-4
                      "
                    >
                      <div
                        className={
                          goal.completed
                            ? `
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-emerald-500
                              text-sm
                              font-bold
                              text-white
                            `
                            : `
                              h-8
                              w-8
                              shrink-0
                              rounded-full
                              border
                              border-slate-400
                              bg-white/80
                            `
                        }
                      >
                        {goal.completed
                          ? "✓"
                          : ""}
                      </div>

                      <p
                        className={
                          goal.completed
                            ? `
                              text-sm
                              font-medium
                              text-slate-500
                              2xl:text-base
                            `
                            : `
                              text-sm
                              font-medium
                              text-slate-800
                              2xl:text-base
                            `
                        }
                      >
                        {goal.text}
                      </p>
                    </div>

                    <span
                      className={
                        goal.completed
                          ? `
                            shrink-0
                            rounded-md
                            bg-emerald-100/90
                            px-4
                            py-2
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.12em]
                            text-emerald-800
                          `
                          : `
                            shrink-0
                            rounded-md
                            bg-slate-100/90
                            px-4
                            py-2
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.12em]
                            text-slate-500
                          `
                      }
                    >
                      {goal.completed
                        ? "Cumplida"
                        : "En curso"}
                    </span>
                  </div>
                )
              )}
            </div>

            {/* TODAS COMPLETADAS */}

            {!isGameFinished &&
              goalProgress.total > 0 &&
              goalProgress.percentage ===
                100 && (
                <div
                  className="
                    border-t
                    border-emerald-200
                    bg-emerald-50/80
                    px-6
                    py-4
                    text-center
                  "
                >
                  <p
                    className="
                      text-sm
                      font-semibold
                      text-emerald-700
                    "
                  >
                    ✓ Todas las metas
                    están cumplidas
                    actualmente
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-500
                    "
                  >
                    El resultado definitivo
                    se determina al finalizar
                    la simulación.
                  </p>
                </div>
              )}
          </div>

          {/* ==================================
              EVOLUCIÓN
          ================================== */}

          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-white/70
              bg-white/[0.88]
              shadow-[0_12px_35px_rgba(15,23,42,0.12)]
              backdrop-blur-xl
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                bg-[#0b3159]/95
                px-6
                py-3
                text-white
              "
            >
              <h2
                className={`
                  ${montserrat.className}
                  text-base
                  font-bold
                  uppercase
                  tracking-[0.04em]
                  2xl:text-lg
                `}
              >
                Evolución de indicadores
              </h2>

              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-blue-200
                "
              >
                Inicio
                <span className="mx-2 text-blue-400">
                  |
                </span>
                Cierre de semanas
              </p>
            </div>

            <div
              className="
                grid
                gap-4
                p-4
                2xl:grid-cols-2
              "
            >
              <BudgetChart
                initialSnapshot={
                  gameState.initialSnapshot
                }
                history={
                  gameState.history
                }
                currentWeek={
                  gameState.currentWeek
                }
                currentBudget={
                  gameState.budget
                }
              />

              <LeadTimeChart
                initialSnapshot={
                  gameState.initialSnapshot
                }
                history={
                  gameState.history
                }
                currentWeek={
                  gameState.currentWeek
                }
                currentLeadTime={
                  gameState.leadTime
                }
              />
            </div>
          </div>
        </section>

        {/* ====================================
            FOOTER
        ==================================== */}

        <footer
          className="
            mt-4
            flex
            items-center
            justify-between
            rounded-xl
            border
            border-white/60
            bg-white/[0.68]
            px-6
            py-3
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.24em]
            text-slate-500
            shadow-lg
            backdrop-blur-xl
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <span
              className="
                font-bold
                text-[#0b3159]
              "
            >
              NEXUS
            </span>

            <span className="text-slate-300">
              |
            </span>

            <span>
              Simulación empresarial
            </span>
          </div>

          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <span>
              Personas
            </span>

            <span className="text-slate-300">
              |
            </span>

            <span>
              Procesos
            </span>

            <span className="text-slate-300">
              |
            </span>

            <span>
              Resultados
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
}

// ============================================
// KPI CARD
// ============================================

type MetricCardProps = {
  title: string;
  subtitle: string;
  value: string;

  icon: ReactNode;

  variant:
    | "blue"
    | "green"
    | "gold"
    | "purple";

  trendText: string;
  trendTone: TrendTone;

  sparklineValues?: number[];
};

function MetricCard({
  title,
  subtitle,
  value,
  icon,
  variant,
  trendText,
  trendTone,
  sparklineValues,
}: MetricCardProps) {
  const variants = {
    blue: `
      from-[#052e56]
      via-[#084c80]
      to-[#0b659d]
      border-sky-300/60
    `,

    green: `
      from-[#063b30]
      via-[#075541]
      to-[#096d53]
      border-emerald-300/55
    `,

    gold: `
      from-[#493505]
      via-[#695007]
      to-[#886a0b]
      border-amber-300/60
    `,

    purple: `
      from-[#302047]
      via-[#472961]
      to-[#60377e]
      border-purple-300/55
    `,
  };

  const trendStyles = {
    positive:
      "text-emerald-200",

    negative:
      "text-rose-200",

    neutral:
      "text-white/60",
  };

  return (
    <div
      className={`
        relative
        min-h-[172px]
        overflow-hidden
        rounded-2xl
        border
        bg-gradient-to-br
        p-5
        text-white
        shadow-[0_14px_35px_rgba(15,23,42,0.20)]
        backdrop-blur-md
        2xl:min-h-[182px]
        ${variants[variant]}
      `}
    >
      {/* brillo superior */}

      <div
        className="
          absolute
          inset-x-0
          top-0
          h-px
          bg-white/40
        "
      />

      {/* círculo glass */}

      <div
        className="
          absolute
          -right-10
          -top-16
          h-44
          w-44
          rounded-full
          bg-white/[0.07]
        "
      />

      {/* CABECERA */}

      <div
        className="
          relative
          flex
          items-start
          justify-between
          gap-4
        "
      >
        <div>
          <p
            className={`
              ${montserrat.className}
              text-base
              font-bold
              uppercase
              tracking-[0.02em]
              text-white
              2xl:text-lg
            `}
          >
            {title}
          </p>

          <p
            className="
              mt-1
              text-xs
              font-normal
              text-white/70
              2xl:text-sm
            "
          >
            {subtitle}
          </p>
        </div>

        {/* ICONO */}

        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-white/[0.06]
            text-white/85
          "
        >
          {icon}
        </div>
      </div>

      {/* VALOR */}

      <div
        className="
          relative
          mt-4
          flex
          items-end
          justify-between
          gap-5
        "
      >
        <div className="min-w-0">

          <p
            className={`
              ${montserrat.className}
              max-w-[290px]
              truncate
              text-4xl
              font-extrabold
              tracking-[-0.04em]
              text-white
              2xl:text-5xl
            `}
          >
            {value}
          </p>

          <p
            className={`
              mt-3
              text-[10px]
              font-medium
              2xl:text-xs
              ${trendStyles[trendTone]}
            `}
          >
            {trendText}
          </p>
        </div>

        {/* SPARKLINE O BARRAS */}

        {sparklineValues &&
        sparklineValues.length >= 2 ? (
          <div
            className="
              mb-1
              w-[120px]
              shrink-0
              text-white/65
            "
          >
            <MiniSparkline
              values={
                sparklineValues
              }
            />
          </div>
        ) : (
          <DecorativeBars />
        )}
      </div>
    </div>
  );
}

// ============================================
// MINI SPARKLINE
// ============================================

function MiniSparkline({
  values,
}: {
  values: number[];
}) {
  const safeValues =
    values.filter(
      (value) =>
        Number.isFinite(value)
    );

  if (safeValues.length < 2) {
    return (
      <DecorativeBars />
    );
  }

  const width = 120;
  const height = 45;
  const padding = 4;

  const minimum =
    Math.min(...safeValues);

  const maximum =
    Math.max(...safeValues);

  const range =
    maximum - minimum || 1;

  const usableWidth =
    width - padding * 2;

  const usableHeight =
    height - padding * 2;

  const points =
    safeValues.map(
      (value, index) => {
        const x =
          padding +
          (
            index /
            (
              safeValues.length -
              1
            )
          ) *
            usableWidth;

        const normalized =
          (value - minimum) /
          range;

        const y =
          padding +
          (
            1 -
            normalized
          ) *
            usableHeight;

        return `${x},${y}`;
      }
    );

  const lastPoint =
    points[
      points.length - 1
    ]
      .split(",")
      .map(Number);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="
        h-[45px]
        w-full
        overflow-visible
      "
      aria-hidden="true"
    >
      <polyline
        points={
          points.join(" ")
        }
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx={lastPoint[0]}
        cy={lastPoint[1]}
        r="3.2"
        fill="currentColor"
      />
    </svg>
  );
}

// ============================================
// BARRAS DECORATIVAS
// ============================================

function DecorativeBars() {
  return (
    <div
      className="
        mb-1
        flex
        shrink-0
        items-end
        gap-1
        opacity-35
      "
    >
      <div className="h-3 w-3 bg-white" />
      <div className="h-5 w-3 bg-white" />
      <div className="h-8 w-3 bg-white" />
      <div className="h-11 w-3 bg-white" />
    </div>
  );
}

// ============================================
// TENDENCIA LEAD TIME
// ============================================

function getLeadTimeTrend(
  difference: number | null
): {
  text: string;
  tone: TrendTone;
} {
  if (difference === null) {
    return {
      text:
        "Sin comparación disponible",
      tone: "neutral",
    };
  }

  if (difference < 0) {
    return {
      text:
        `↓ ${Math.abs(
          difference
        )} días  |  vs. inicio`,

      tone: "positive",
    };
  }

  if (difference > 0) {
    return {
      text:
        `↑ ${Math.abs(
          difference
        )} días  |  vs. inicio`,

      tone: "negative",
    };
  }

  return {
    text:
      "• Sin variación  |  vs. inicio",

    tone: "neutral",
  };
}

// ============================================
// TENDENCIA PRESUPUESTO
// ============================================

function getBudgetTrend(
  difference: number | null
): {
  text: string;
  tone: TrendTone;
} {
  if (difference === null) {
    return {
      text:
        "Sin comparación disponible",
      tone: "neutral",
    };
  }

  const formatted =
    Math.abs(
      difference
    ).toLocaleString(
      "es-AR"
    );

  if (difference > 0) {
    return {
      text:
        `↑ $${formatted}  |  vs. inicio`,

      tone: "positive",
    };
  }

  if (difference < 0) {
    return {
      text:
        `↓ $${formatted}  |  vs. inicio`,

      tone: "negative",
    };
  }

  return {
    text:
      "• Sin variación  |  vs. inicio",

    tone: "neutral",
  };
}

// ============================================
// ESTILO RESULTADO FINAL
// ============================================

function getResultStyle(
  level: string
) {
  switch (level) {
    case "epic-victory":
      return {
        border:
          "border-amber-200/25",

        badge:
          "border-amber-200/20 bg-amber-200/10 text-amber-100",
      };

    case "victory":
      return {
        border:
          "border-emerald-200/20",

        badge:
          "border-emerald-200/20 bg-emerald-200/10 text-emerald-100",
      };

    case "partial-failure":
      return {
        border:
          "border-slate-200/20",

        badge:
          "border-slate-200/15 bg-white/5 text-slate-200",
      };

    case "critical-failure":
      return {
        border:
          "border-slate-300/20",

        badge:
          "border-slate-200/15 bg-white/[0.06] text-slate-200",
      };

    case "epic-defeat":
      return {
        border:
          "border-rose-200/20",

        badge:
          "border-rose-200/15 bg-rose-200/[0.07] text-rose-100",
      };

    default:
      return {
        border:
          "border-slate-200/20",

        badge:
          "border-slate-200/15 bg-white/5 text-slate-200",
      };
  }
}