"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import {
  Boxes,
  CalendarDays,
  Coins,
  Gauge,
  MessageSquare,
  Pause,
  Play,
  RotateCcw,
  Save,
  Settings,
  Square,
  Target,
  Timer,
} from "lucide-react";

import { useGameState } from "@/hooks/useGameState";
import { useRoundTimer } from "@/hooks/useRoundTimer";

import {
  calculatePercentageAmount,
  hasEpicVictory,
} from "@/lib/calculations";

export default function MasterPage() {
  // ============================================
  // ESTADO GENERAL DEL JUEGO
  // ============================================

  const {
    gameState,
    isLoaded,

    configureInitialGame,

    decreaseLeadTime,
    increaseLeadTime,

    addBudget,
    subtractBudget,

    setInventory,
    updateCustomMetric,

    addGoal,
    toggleGoal,
    removeGoal,

    setCurrentEvent,
    publishEvent,

    startRound,
    pauseRound,
    resumeRound,
    finishRound,

    resetGame,
  } = useGameState();

  // ============================================
  // TEMPORIZADOR
  // ============================================

  const timerSeconds =
    useRoundTimer(gameState);

  // ============================================
  // CONFIGURACIÓN INICIAL
  // ============================================

  const [
    initialLeadTime,
    setInitialLeadTime,
  ] = useState(32);

  const [
    initialBudget,
    setInitialBudget,
  ] = useState(7700);

  const [
    initialWeeks,
    setInitialWeeks,
  ] = useState(4);

  const [
    initialRoundMinutes,
    setInitialRoundMinutes,
  ] = useState(10);

  // ============================================
  // CONTROLES DURANTE LA PARTIDA
  // ============================================

  const [
    leadTimePercentage,
    setLeadTimePercentage,
  ] = useState(10);

  const [
    budgetAmount,
    setBudgetAmount,
  ] = useState(1000);

  const [
    newGoal,
    setNewGoal,
  ] = useState("");

  const [
    eventDraft,
    setEventDraft,
] = useState("");

  // ============================================
  // SINCRONIZAR CONFIGURACIÓN
  // ============================================

  useEffect(() => {
    if (!isLoaded) return;

    setInitialLeadTime(
      gameState.leadTime
    );

    setInitialBudget(
      gameState.budget
    );

    setInitialWeeks(
      gameState.totalWeeks
    );

    setInitialRoundMinutes(
      gameState.roundDurationSeconds /
        60
    );
  }, [
    isLoaded,
    gameState.leadTime,
    gameState.budget,
    gameState.totalWeeks,
    gameState.roundDurationSeconds,
  ]);

  // ============================================
  // FINALIZACIÓN AUTOMÁTICA
  // ============================================

  useEffect(() => {
    if (
      gameState.timerStatus ===
        "running" &&
      timerSeconds === 0
    ) {
      finishRound();
    }
  }, [
    timerSeconds,
    gameState.timerStatus,
    finishRound,
  ]);

  // ============================================
  // CARGA
  // ============================================

  if (!isLoaded) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#07192d]
          text-white
        "
      >
        <p className="text-lg font-semibold">
          Cargando partida...
        </p>
      </main>
    );
  }

  // ============================================
  // LEAD TIME
  // ============================================

  const leadTimeChange =
    calculatePercentageAmount(
      gameState.leadTime,
      leadTimePercentage
    );

  const leadTimeAfterDecrease =
    Math.max(
      0,
      gameState.leadTime -
        leadTimeChange
    );

  const leadTimeAfterIncrease =
    gameState.leadTime +
    leadTimeChange;

  // ============================================
  // VICTORIA
  // ============================================

  const epicVictory =
    hasEpicVictory(
      gameState.goals
    );

  // ============================================
  // FORMATO TIMER
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
  // METAS
  // ============================================

  function handleAddGoal() {
    const text =
      newGoal.trim();

    if (!text) return;

    addGoal(text);
    setNewGoal("");
  }

  // ============================================
// PUBLICAR SITUACIÓN
// ============================================

function handlePublishEvent() {
  const text =
    eventDraft.trim();

  if (!text) return;

  publishEvent(text);

  setEventDraft("");
}


  // ============================================
  // CONFIGURACIÓN
  // ============================================

  function handleApplyConfiguration() {
    if (
      initialLeadTime < 0 ||
      initialBudget < 0 ||
      initialWeeks < 1 ||
      initialRoundMinutes < 1
    ) {
      return;
    }

    configureInitialGame(
      initialLeadTime,
      initialBudget,
      initialWeeks,
      initialRoundMinutes
    );
  }

  // ============================================
  // ESTADO TIMER
  // ============================================

  const timerStatusText =
    gameState.timerStatus === "idle"
      ? "Esperando inicio"
      : gameState.timerStatus ===
          "running"
      ? "Ronda en curso"
      : gameState.timerStatus ===
          "paused"
      ? "Ronda pausada"
      : "Partida finalizada";

  return (
    <main
      className="
        relative
        isolate
        min-h-screen
        overflow-x-hidden
        bg-[#06182b]
        text-white
      "
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

      <div
        className="
          fixed
          inset-0
          z-10
          bg-[#041426]/85
          backdrop-blur-[2px]
        "
      />

      {/* ======================================
          CONTENIDO
      ====================================== */}

      <div
        className="
          relative
          z-20
          mx-auto
          w-full
          max-w-[1500px]
          px-5
          py-5
          lg:px-8
        "
      >
        {/* ====================================
            HEADER
        ==================================== */}

        <header
          className="
            mb-4
            flex
            flex-wrap
            items-center
            justify-between
            gap-5
            rounded-2xl
            border
            border-sky-400/25
            bg-[#09223d]/88
            px-6
            py-4
            shadow-2xl
            backdrop-blur-xl
          "
        >
          {/* IZQUIERDA */}

          <div
            className="
              flex
              items-center
              gap-6
            "
          >
            <Image
              src="/logo_master.png"
              alt="Nexus"
              width={260}
              height={90}
              priority
              className="
                h-auto
                w-[190px]
                object-contain
                lg:w-[220px]
              "
            />

            <div
              className="
                hidden
                h-16
                w-px
                bg-sky-200/30
                sm:block
              "
            />

            <div>
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  text-sky-300
                "
              >
                Tablero de simulación
              </p>

              <h1
                className="
                  mt-1
                  text-3xl
                  font-black
                  tracking-tight
                  text-white
                "
              >
                Panel del Máster
              </h1>

              <p
                className="
                  mt-1
                  hidden
                  text-sm
                  text-slate-300
                  lg:block
                "
              >
                Controlá la simulación,
                ajustá parámetros y
                gestioná el avance de la
                partida.
              </p>
            </div>
          </div>

          {/* DERECHA */}

          <div
            className="
              flex
              items-stretch
              gap-3
            "
          >
            {/* TIMER HEADER */}

            <div
              className="
                flex
                min-w-[240px]
                items-center
                gap-4
                rounded-xl
                border
                border-sky-300/25
                bg-[#0a2948]/80
                px-5
                py-3
              "
            >
              <Timer
                size={34}
                className="text-sky-300"
              />

              <div>
                <p
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.15em]
                    text-sky-200
                  "
                >
                  Temporizador de ronda
                </p>

                <p
                  className="
                    text-3xl
                    font-black
                    tabular-nums
                  "
                >
                  {formattedTimer}
                </p>

                <p
                  className="
                    text-[10px]
                    text-slate-400
                  "
                >
                  Estado:{" "}
                  {timerStatusText}
                </p>
              </div>
            </div>

            {/* SEMANA */}

            <div
              className="
                flex
                min-w-[145px]
                items-center
                justify-center
                gap-3
                rounded-xl
                border
                border-sky-300/25
                bg-[#0a2948]/80
                px-5
                py-3
              "
            >
              <CalendarDays
                size={31}
                className="text-sky-300"
              />

              <div className="text-center">
                <p
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-sky-200
                  "
                >
                  Semana
                </p>

                <p
                  className="
                    text-3xl
                    font-black
                  "
                >
                  {
                    gameState.currentWeek
                  }
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ====================================
            CONFIGURACIÓN INICIAL
        ==================================== */}

        {gameState.history.length ===
          0 &&
          gameState.timerStatus ===
            "idle" && (
            <section
              className="
                mb-4
                rounded-2xl
                border
                border-sky-400/45
                bg-[#0a2948]/78
                p-6
                shadow-xl
                backdrop-blur-xl
              "
            >
              <div
                className="
                  mb-5
                  flex
                  items-start
                  gap-4
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
                    bg-sky-400/15
                    text-sky-300
                  "
                >
                  <Settings size={25} />
                </div>

                <div>
                  <p
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-sky-300
                    "
                  >
                    Configuración inicial
                  </p>

                  <h2
                    className="
                      mt-1
                      text-2xl
                      font-black
                    "
                  >
                    Preparar partida
                  </h2>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-300
                    "
                  >
                    Definí los valores
                    iniciales antes de
                    comenzar la primera
                    ronda.
                  </p>
                </div>
              </div>

              <div
                className="
                  grid
                  gap-4
                  md:grid-cols-2
                  xl:grid-cols-4
                "
              >
                {/* LEAD TIME */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Lead Time inicial
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={
                        initialLeadTime
                      }
                      onChange={(event) =>
                        setInitialLeadTime(
                          Number(
                            event.target.value
                          )
                        )
                      }
                      className={inputClass}
                    />

                    <span className="text-sm font-semibold text-slate-400">
                      días
                    </span>
                  </div>
                </div>

                {/* PRESUPUESTO */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Presupuesto inicial
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-300">
                      $
                    </span>

                    <input
                      type="number"
                      min="0"
                      value={
                        initialBudget
                      }
                      onChange={(event) =>
                        setInitialBudget(
                          Number(
                            event.target.value
                          )
                        )
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* SEMANAS */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Cantidad de semanas
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={
                      initialWeeks
                    }
                    onChange={(event) =>
                      setInitialWeeks(
                        Number(
                          event.target.value
                        )
                      )
                    }
                    className={inputClass}
                  />
                </div>

                {/* DURACIÓN */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Duración de ronda
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={
                        initialRoundMinutes
                      }
                      onChange={(event) =>
                        setInitialRoundMinutes(
                          Number(
                            event.target.value
                          )
                        )
                      }
                      className={inputClass}
                    />

                    <span className="text-sm font-semibold text-slate-400">
                      min
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={
                    handleApplyConfiguration
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-blue-600
                    px-6
                    py-3
                    font-bold
                    text-white
                    shadow-lg
                    transition
                    hover:bg-blue-500
                  "
                >
                  <Save size={18} />

                  Guardar configuración
                </button>
              </div>
            </section>
          )}

        {/* ====================================
            TEMPORIZADOR PRINCIPAL
        ==================================== */}

        <section
          className="
            mb-4
            rounded-2xl
            border
            border-sky-400/35
            bg-[#071c32]/90
            px-6
            py-5
            shadow-xl
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
            "
          >
            <div
              className="
                flex
                items-center
                gap-5
              "
            >
              <div
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-sky-400/25
                  bg-sky-400/10
                  text-sky-300
                "
              >
                <Timer size={36} />
              </div>

              <div>
                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-sky-300
                  "
                >
                  Temporizador de ronda
                </p>

                <p
                  className="
                    mt-1
                    text-5xl
                    font-black
                    tabular-nums
                  "
                >
                  {formattedTimer}
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-400
                  "
                >
                  Estado:{" "}
                  {timerStatusText}
                </p>
              </div>
            </div>

            {/* BOTONES TIMER */}

            <div
              className="
                flex
                flex-wrap
                gap-3
              "
            >
              {gameState.timerStatus ===
                "idle" && (
                <button
                  onClick={startRound}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-blue-600
                    px-7
                    py-4
                    font-bold
                    text-white
                    shadow-lg
                    transition
                    hover:bg-blue-500
                  "
                >
                  <Play
                    size={20}
                    fill="currentColor"
                  />

                  Comenzar ronda
                </button>
              )}

              {gameState.timerStatus ===
                "running" && (
                <button
                  onClick={pauseRound}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-amber-500
                    px-6
                    py-3
                    font-bold
                    text-slate-950
                    hover:bg-amber-400
                  "
                >
                  <Pause size={19} />

                  Pausar
                </button>
              )}

              {gameState.timerStatus ===
                "paused" && (
                <button
                  onClick={resumeRound}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-blue-600
                    px-6
                    py-3
                    font-bold
                    text-white
                    hover:bg-blue-500
                  "
                >
                  <Play
                    size={19}
                    fill="currentColor"
                  />

                  Reanudar
                </button>
              )}

              {(gameState.timerStatus ===
                "running" ||
                gameState.timerStatus ===
                  "paused") && (
                <button
                  onClick={finishRound}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-red-400/60
                    bg-red-500/10
                    px-6
                    py-3
                    font-bold
                    text-red-300
                    transition
                    hover:bg-red-500/20
                  "
                >
                  <Square size={17} />

                  Finalizar ronda
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ====================================
            VICTORIA
        ==================================== */}

        {epicVictory && (
          <div
            className="
              mb-4
              rounded-2xl
              border
              border-emerald-400/30
              bg-emerald-400/10
              px-6
              py-4
              text-center
              backdrop-blur-md
            "
          >
            <p className="text-xl font-black text-emerald-200">
              Todas las metas están
              cumplidas actualmente
            </p>

            <p className="mt-1 text-sm text-emerald-100/70">
              El resultado definitivo se
              determina al finalizar la
              simulación.
            </p>
          </div>
        )}

        {/* ====================================
            MÉTRICAS
        ==================================== */}

        <div
          className="
            grid
            gap-4
            xl:grid-cols-2
          "
        >
          {/* ==================================
              LEAD TIME
          ================================== */}

          <Panel
            icon={
              <Timer size={24} />
            }
            title="Lead Time"
            subtitle="Tiempo de entrega promedio"
          >
            <div
              className="
                my-5
                flex
                items-end
                justify-center
                gap-2
              "
            >
              <span className="text-5xl font-black">
                {gameState.leadTime}
              </span>

              <span className="pb-1 text-xl text-slate-300">
                días
              </span>
            </div>

            <label className="mb-2 block text-sm font-semibold">
              Porcentaje de modificación
            </label>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={
                  leadTimePercentage
                }
                onChange={(event) =>
                  setLeadTimePercentage(
                    Number(
                      event.target.value
                    )
                  )
                }
                className={inputClass}
              />

              <span className="text-xl font-bold">
                %
              </span>
            </div>

            <div
              className="
                mt-4
                rounded-xl
                border
                border-sky-300/15
                bg-white/[0.05]
                p-4
                text-sm
                text-slate-300
              "
            >
              <p>
                Cambio calculado:{" "}
                <strong className="text-white">
                  {leadTimeChange} días
                </strong>
              </p>

              <p className="mt-1">
                Si disminuye:{" "}
                <strong className="text-white">
                  {gameState.leadTime}
                  {" → "}
                  {
                    leadTimeAfterDecrease
                  }{" "}
                  días
                </strong>
              </p>

              <p>
                Si aumenta:{" "}
                <strong className="text-white">
                  {gameState.leadTime}
                  {" → "}
                  {
                    leadTimeAfterIncrease
                  }{" "}
                  días
                </strong>
              </p>
            </div>

            <div
              className="
                mt-4
                grid
                grid-cols-2
                gap-3
              "
            >
              <button
                onClick={() =>
                  decreaseLeadTime(
                    leadTimePercentage
                  )
                }
                className="
                  rounded-xl
                  border
                  border-sky-400/60
                  bg-sky-400/10
                  px-4
                  py-3
                  font-bold
                  text-sky-200
                  transition
                  hover:bg-sky-400/20
                "
              >
                ↓ Disminuir{" "}
                {leadTimePercentage}%
              </button>

              <button
                onClick={() =>
                  increaseLeadTime(
                    leadTimePercentage
                  )
                }
                className="
                  rounded-xl
                  bg-sky-400
                  px-4
                  py-3
                  font-bold
                  text-[#08213a]
                  transition
                  hover:bg-sky-300
                "
              >
                ↑ Aumentar{" "}
                {leadTimePercentage}%
              </button>
            </div>
          </Panel>

          {/* ==================================
              PRESUPUESTO
          ================================== */}

          <Panel
            icon={
              <Coins size={24} />
            }
            title="Presupuesto"
            subtitle="Capital disponible para la simulación"
          >
            <div className="my-5 text-center">
              <span className="text-5xl font-black">
                $
                {gameState.budget.toLocaleString(
                  "es-AR"
                )}
              </span>
            </div>

            <label className="mb-2 block text-sm font-semibold">
              Monto
            </label>

            <input
              type="number"
              min="0"
              value={budgetAmount}
              onChange={(event) =>
                setBudgetAmount(
                  Number(
                    event.target.value
                  )
                )
              }
              className={inputClass}
            />

            <div
              className="
                mt-4
                grid
                grid-cols-2
                gap-3
              "
            >
              <button
                onClick={() =>
                  subtractBudget(
                    budgetAmount
                  )
                }
                className="
                  rounded-xl
                  border
                  border-red-400/70
                  bg-red-600/20
                  px-4
                  py-3
                  font-bold
                  text-red-200
                  transition
                  hover:bg-red-600/30
                "
              >
                − Restar
              </button>

              <button
                onClick={() =>
                  addBudget(
                    budgetAmount
                  )
                }
                className="
                  rounded-xl
                  border
                  border-emerald-400/70
                  bg-emerald-500/20
                  px-4
                  py-3
                  font-bold
                  text-emerald-200
                  transition
                  hover:bg-emerald-500/30
                "
              >
                + Sumar
              </button>
            </div>
          </Panel>

          {/* ==================================
              INVENTARIO
          ================================== */}

          <Panel
            icon={
              <Boxes size={24} />
            }
            title="Inventario"
            subtitle="Estado actual del inventario"
          >
            <p
              className="
                my-5
                text-4xl
                font-black
              "
            >
              {gameState.inventory}
            </p>

            <label className="mb-2 block text-sm font-semibold">
              Estado
            </label>

            <select
              value={
                gameState.inventory
              }
              onChange={(event) =>
                setInventory(
                  event.target.value
                )
              }
              className={inputClass}
            >
              {gameState.inventoryOptions.map(
                (option) => (
                  <option
                    key={option}
                    value={option}
                    className="bg-[#0a2948]"
                  >
                    {option}
                  </option>
                )
              )}
            </select>
          </Panel>

          {/* ==================================
              INDICADOR CONFIGURABLE
          ================================== */}

          <Panel
            icon={
              <Gauge size={24} />
            }
            title="Indicador configurable"
            subtitle="Definí un indicador adicional para la simulación"
          >
            <div className="my-5">
              <p className="text-2xl font-black">
                {
                  gameState.customMetric
                    .name
                }
              </p>

              <p className="mt-1 text-lg text-slate-300">
                {
                  gameState.customMetric
                    .value
                }{" "}
                {
                  gameState.customMetric
                    .unit
                }
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={
                  gameState.customMetric
                    .name
                }
                onChange={(event) =>
                  updateCustomMetric({
                    ...gameState.customMetric,
                    name:
                      event.target.value,
                  })
                }
                placeholder="Nombre"
                className={inputClass}
              />

              <input
                type="number"
                value={
                  gameState.customMetric
                    .value
                }
                onChange={(event) =>
                  updateCustomMetric({
                    ...gameState.customMetric,
                    value: Number(
                      event.target.value
                    ),
                  })
                }
                placeholder="Valor"
                className={inputClass}
              />

              <input
                type="text"
                value={
                  gameState.customMetric
                    .unit
                }
                onChange={(event) =>
                  updateCustomMetric({
                    ...gameState.customMetric,
                    unit:
                      event.target.value,
                  })
                }
                placeholder="Unidad"
                className={inputClass}
              />
            </div>
          </Panel>

          {/* ==================================
              METAS
          ================================== */}

          <Panel
            icon={
              <Target size={24} />
            }
            title="Metas"
            subtitle="Definí los objetivos y condiciones de la simulación"
          >
            <div className="mt-4 space-y-2">
              {gameState.goals.map(
                (goal) => (
                  <div
                    key={goal.id}
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                      rounded-lg
                      border
                      border-sky-300/15
                      bg-black/10
                      px-4
                      py-3
                    "
                  >
                    <label
                      className="
                        flex
                        flex-1
                        cursor-pointer
                        items-center
                        gap-3
                      "
                    >
                      <input
                        type="checkbox"
                        checked={
                          goal.completed
                        }
                        onChange={() =>
                          toggleGoal(
                            goal.id
                          )
                        }
                        className="
                          h-5
                          w-5
                          accent-sky-400
                        "
                      />

                      <span
                        className={
                          goal.completed
                            ? "line-through text-slate-500"
                            : "text-slate-200"
                        }
                      >
                        {goal.text}
                      </span>
                    </label>

                    <button
                      onClick={() =>
                        removeGoal(
                          goal.id
                        )
                      }
                      className="
                        text-xs
                        font-semibold
                        text-red-300
                        hover:text-red-200
                      "
                    >
                      Eliminar
                    </button>
                  </div>
                )
              )}
            </div>

            <div
              className="
                mt-4
                flex
                gap-3
              "
            >
              <input
                type="text"
                value={newGoal}
                onChange={(event) =>
                  setNewGoal(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    handleAddGoal();
                  }
                }}
                placeholder="Nueva meta..."
                className={inputClass}
              />

              <button
                onClick={
                  handleAddGoal
                }
                className="
                  shrink-0
                  rounded-xl
                  border
                  border-sky-400
                  bg-sky-400/10
                  px-5
                  py-3
                  font-bold
                  text-sky-200
                  hover:bg-sky-400/20
                "
              >
                + Agregar meta
              </button>
            </div>
          </Panel>

          {/* ==================================
              EVENTO
          ================================== */}

        <Panel
          icon={
            <MessageSquare
              size={24}
            />
          }
          title="Situación de la semana"
          subtitle="Publicá situaciones para los participantes y conservá el historial de la partida"
          >
          {/* ==================================
              SITUACIÓN ACTIVA
          ================================== */}

          {gameState.currentEvent && (
            <div
              className="
                mt-4
                rounded-xl
                border
                border-sky-400/25
                bg-sky-400/[0.07]
                px-4
                py-3
              "
            >
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  justify-between
                  gap-3
                "
              >
                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-sky-300
                  "
                >
                  Situación activa
                </p>

                <span
                  className="
                    rounded-full
                    border
                    border-sky-300/20
                    bg-sky-300/10
                    px-3
                    py-1
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-sky-200
                  "
                >
                  Semana{" "}
                  {gameState.currentWeek}
                </span>
              </div>

              <p
                className="
                  mt-2
                  text-sm
                  leading-relaxed
                  text-white
                "
              >
                {gameState.currentEvent}
              </p>
            </div>
          )}

          {/* ==================================
              NUEVA SITUACIÓN
          ================================== */}

          <div className="mt-4">
            <label
              className="
                mb-2
                block
                text-xs
                font-semibold
                text-slate-300
              "
            >
              Nueva situación
            </label>

            <textarea
              value={eventDraft}
              onChange={(event) =>
                setEventDraft(
                  event.target.value
                )
              }
              placeholder="Ej: El proveedor principal anuncia una demora de 5 días..."
              rows={4}
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-sky-300/25
                bg-[#071c32]/70
                px-4
                py-3
                text-sm
                text-white
                outline-none
                placeholder:text-slate-500
                focus:border-sky-400
                focus:ring-2
                focus:ring-sky-400/10
              "
            />

            <div
              className="
                mt-3
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <p
                className="
                  text-[10px]
                  text-slate-500
                "
              >
                La situación aparecerá en el
                Display recién cuando la
                publiques.
              </p>

              <button
                onClick={
                  handlePublishEvent
                }
                disabled={
                  !eventDraft.trim()
                }
                className="
                  shrink-0
                  rounded-xl
                  bg-sky-400
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-[#08213a]
                  transition

                  hover:bg-sky-300

                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                ✓ Publicar situación
              </button>
            </div>
          </div>

          {/* ==================================
              HISTORIAL
          ================================== */}

          <div
            className="
              mt-5
              border-t
              border-sky-300/15
              pt-4
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-slate-400
                "
              >
                Historial de situaciones
              </p>

              <span
                className="
                  text-[10px]
                  text-slate-500
                "
              >
                {
                  gameState
                    .eventHistory
                    .length
                }{" "}
                registradas
              </span>
            </div>

            {gameState.eventHistory.length ===
            0 ? (
              <div
                className="
                  mt-3
                  rounded-xl
                  border
                  border-dashed
                  border-sky-300/15
                  px-4
                  py-5
                  text-center
                  text-xs
                  text-slate-500
                "
              >
                Todavía no se registraron
                situaciones.
              </div>
            ) : (
              <div
                className="
                  mt-3
                  max-h-[260px]
                  space-y-2
                  overflow-y-auto
                  pr-1
                "
              >
                {[...gameState.eventHistory]
                  .reverse()
                  .map(
                    (gameEvent) => (
                      <div
                        key={
                          gameEvent.id
                        }
                        className="
                          flex
                          gap-3
                          rounded-xl
                          border
                          border-sky-300/15
                          bg-black/10
                          px-4
                          py-3
                        "
                      >
                        {/* SEMANA */}

                        <div
                          className="
                            flex
                            h-10
                            min-w-[74px]
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-sky-400/10
                            px-3
                          "
                        >
                          <span
                            className="
                              text-[10px]
                              font-bold
                              uppercase
                              tracking-[0.10em]
                              text-sky-300
                            "
                          >
                            Semana{" "}
                            {
                              gameEvent.week
                            }
                          </span>
                        </div>

                        {/* TEXTO */}

                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >
                          <p
                            className="
                              text-sm
                              leading-relaxed
                              text-slate-200
                            "
                          >
                            {
                              gameEvent.text
                            }
                          </p>

                          <p
                            className="
                              mt-1
                              text-[9px]
                              text-slate-500
                            "
                          >
                            {new Date(
                              gameEvent.createdAt
                            ).toLocaleTimeString(
                              "es-AR",
                              {
                                hour:
                                  "2-digit",
                                minute:
                                  "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  )}
              </div>
            )}
          </div>
        </Panel>  
        </div>
        {/* ====================================
            FOOTER
        ==================================== */}

        <footer
          className="
            mt-4
            flex
            flex-wrap
            items-center
            justify-between
            gap-4
            rounded-xl
            border
            border-sky-300/15
            bg-[#071c32]/70
            px-5
            py-3
            backdrop-blur-md
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.22em]
              text-slate-400
            "
          >
            <span className="text-sky-300">
              NEXUS
            </span>

            <span className="text-slate-600">
              |
            </span>

            <span>
              Tablero de simulación
            </span>
          </div>

          <button
            onClick={resetGame}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-red-400/70
              bg-red-500/5
              px-5
              py-2.5
              text-sm
              font-semibold
              text-red-300
              transition
              hover:bg-red-500/15
            "
          >
            <RotateCcw
              size={17}
            />

            Reiniciar partida de prueba
          </button>
        </footer>
      </div>
    </main>
  );
}

// ============================================
// CLASE INPUT
// ============================================

const inputClass = `
  w-full
  rounded-xl
  border
  border-sky-300/25
  bg-[#071c32]/70
  px-4
  py-3
  text-white
  outline-none
  transition
  placeholder:text-slate-500
  focus:border-sky-400
  focus:ring-2
  focus:ring-sky-400/10
`;

// ============================================
// PANEL REUTILIZABLE
// ============================================

type PanelProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

function Panel({
  icon,
  title,
  subtitle,
  children,
}: PanelProps) {
  return (
    <section
      className="
        rounded-2xl
        border
        border-sky-300/20
        bg-[#0a2948]/78
        p-5
        shadow-xl
        backdrop-blur-xl
      "
    >
      <div
        className="
          flex
          items-start
          gap-4
        "
      >
        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-sky-400/12
            text-sky-300
          "
        >
          {icon}
        </div>

        <div>
          <h2
            className="
              text-sm
              font-black
              uppercase
              tracking-[0.08em]
              text-white
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-1
              text-xs
              text-slate-400
            "
          >
            {subtitle}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}