"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type {
  CustomMetric,
  GameEvent,
  GameState,
  Goal,
  RoundSnapshot,
} from "@/types/game";

import { initialGameState } from "@/lib/game-state";

import {
  decreaseByPercentage,
  increaseByPercentage,
} from "@/lib/calculations";

const STORAGE_KEY =
  "cd-dashboard-playtest";

export function useGameState() {
  // ============================================
  // ESTADO GENERAL
  // ============================================

  const [gameState, setGameState] =
    useState<GameState>(
      initialGameState
    );

  const [isLoaded, setIsLoaded] =
    useState(false);

  // ============================================
  // CARGAR PARTIDA GUARDADA
  // + SINCRONIZAR MASTER / DISPLAY
  // ============================================

  useEffect(() => {
    function loadSavedState() {
      const savedState =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (savedState) {
        try {
          const parsedState =
            JSON.parse(
              savedState
            ) as GameState;

          /*
           * Mezclamos con initialGameState
           * por si agregamos propiedades
           * nuevas en futuras versiones.
           */
          setGameState({
            ...initialGameState,
            ...parsedState,
          });
        } catch (error) {
          console.error(
            "No se pudo recuperar la partida guardada:",
            error
          );
        }
      }

      setIsLoaded(true);
    }

    loadSavedState();

    /*
     * Escucha cambios realizados
     * desde otra pestaña.
     *
     * Ejemplo:
     * /master modifica presupuesto
     * /display recibe el cambio.
     */
    function handleStorageChange(
      event: StorageEvent
    ) {
      if (
        event.key ===
          STORAGE_KEY &&
        event.newValue
      ) {
        try {
          const newState =
            JSON.parse(
              event.newValue
            ) as GameState;

          setGameState({
            ...initialGameState,
            ...newState,
          });
        } catch (error) {
          console.error(
            "No se pudo sincronizar la partida:",
            error
          );
        }
      }
    }

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  // ============================================
  // GUARDAR AUTOMÁTICAMENTE
  // ============================================

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(gameState)
    );
  }, [
    gameState,
    isLoaded,
  ]);

  // ============================================
  // CONFIGURACIÓN INICIAL
  // ============================================

  function configureInitialGame(
  leadTime: number,
  budget: number,
  totalWeeks: number,
  roundDurationMinutes: number
) {
  const durationSeconds =
    roundDurationMinutes * 60;

  setGameState(
    (previousState) => ({
      ...previousState,

      // ======================================
      // VALORES INICIALES
      // ======================================

      leadTime,
      budget,

      // ======================================
      // SEMANAS
      // ======================================

      totalWeeks,
      currentWeek: totalWeeks,

      // ======================================
      // TEMPORIZADOR
      // ======================================

      roundDurationSeconds:
        durationSeconds,

      remainingSeconds:
        durationSeconds,

      timerStatus: "idle",

      roundEndsAt: null,

      // ======================================
      // GUARDAMOS EL PUNTO DE PARTIDA
      // ======================================

      initialSnapshot: {
        week: totalWeeks,
        budget,
        leadTime,
        inventory:
          previousState.inventory,
      },

      // ======================================
      // NUEVA PARTIDA = HISTORIAL VACÍO
      // ======================================

      history: [],

      // ======================================
      // REINICIAMOS METAS
      // ======================================

      goals:
        previousState.goals.map(
          (goal) => ({
            ...goal,
            completed: false,
          })
        ),

      currentEvent: "",
    })
  );
}

  // ============================================
  // LEAD TIME
  // ============================================

  function decreaseLeadTime(
    percentage: number
  ) {
    setGameState(
      (previousState) => ({
        ...previousState,

        leadTime:
          decreaseByPercentage(
            previousState.leadTime,
            percentage
          ),
      })
    );
  }

  function increaseLeadTime(
    percentage: number
  ) {
    setGameState(
      (previousState) => ({
        ...previousState,

        leadTime:
          increaseByPercentage(
            previousState.leadTime,
            percentage
          ),
      })
    );
  }

  // ============================================
  // PRESUPUESTO
  // ============================================

  function addBudget(
    amount: number
  ) {
    setGameState(
      (previousState) => ({
        ...previousState,

        budget:
          previousState.budget +
          amount,
      })
    );
  }

  function subtractBudget(
    amount: number
  ) {
    setGameState(
      (previousState) => ({
        ...previousState,

        budget:
          previousState.budget -
          amount,
      })
    );
  }

  // ============================================
  // INVENTARIO
  // ============================================

  function setInventory(
    inventory: string
  ) {
    setGameState(
      (previousState) => ({
        ...previousState,
        inventory,
      })
    );
  }

  // ============================================
  // INDICADOR CONFIGURABLE
  // ============================================

  function updateCustomMetric(
    customMetric: CustomMetric
  ) {
    setGameState(
      (previousState) => ({
        ...previousState,
        customMetric,
      })
    );
  }

  // ============================================
  // METAS
  // ============================================

  function addGoal(
    text: string
  ) {
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      text,
      completed: false,
    };

    setGameState(
      (previousState) => ({
        ...previousState,

        goals: [
          ...previousState.goals,
          newGoal,
        ],
      })
    );
  }

  function toggleGoal(
    goalId: string
  ) {
    setGameState(
      (previousState) => ({
        ...previousState,

        goals:
          previousState.goals.map(
            (goal) =>
              goal.id === goalId
                ? {
                    ...goal,
                    completed:
                      !goal.completed,
                  }
                : goal
          ),
      })
    );
  }

  function removeGoal(
    goalId: string
  ) {
    setGameState(
      (previousState) => ({
        ...previousState,

        goals:
          previousState.goals.filter(
            (goal) =>
              goal.id !== goalId
          ),
      })
    );
  }

  // ============================================
  // EVENTO ACTUAL
  // ============================================

  function setCurrentEvent(
    currentEvent: string
  ) {
    setGameState(
      (previousState) => ({
        ...previousState,
        currentEvent,
      })
    );
  }

// ============================================
// PUBLICAR EVENTO / SITUACIÓN
// ============================================

function publishEvent(
  text: string
) {
  const cleanText =
    text.trim();

  if (!cleanText) return;

  setGameState(
    (previousState) => {
      const newEvent: GameEvent = {
        id: crypto.randomUUID(),

        week:
          previousState.currentWeek,

        text:
          cleanText,

        createdAt:
          Date.now(),
      };

      return {
        ...previousState,

        // Última situación visible
        // en el Display
        currentEvent:
          cleanText,

        // Registro permanente
        eventHistory: [
          ...previousState.eventHistory,
          newEvent,
        ],
      };
    }
  );
}
  // ============================================
  // COMENZAR RONDA
  // ============================================

  function startRound() {
    setGameState(
      (previousState) => {
        /*
         * No comenzar si ya
         * terminó la partida.
         */
        if (
          previousState.currentWeek <=
          0
        ) {
          return previousState;
        }

        /*
         * Evitar iniciar dos veces.
         */
        if (
          previousState.timerStatus ===
          "running"
        ) {
          return previousState;
        }

        const roundEndsAt =
          Date.now() +
          previousState
            .remainingSeconds *
            1000;

        return {
          ...previousState,

          timerStatus:
            "running",

          roundEndsAt,
        };
      }
    );
  }

  // ============================================
  // PAUSAR RONDA
  // ============================================

  function pauseRound() {
    setGameState(
      (previousState) => {
        if (
          previousState.timerStatus !==
            "running" ||
          !previousState.roundEndsAt
        ) {
          return previousState;
        }

        const remainingSeconds =
          Math.max(
            0,
            Math.ceil(
              (
                previousState.roundEndsAt -
                Date.now()
              ) / 1000
            )
          );

        return {
          ...previousState,

          remainingSeconds,

          timerStatus:
            "paused",

          roundEndsAt:
            null,
        };
      }
    );
  }

  // ============================================
  // REANUDAR RONDA
  // ============================================

  function resumeRound() {
    setGameState(
      (previousState) => {
        if (
          previousState.timerStatus !==
          "paused"
        ) {
          return previousState;
        }

        const roundEndsAt =
          Date.now() +
          previousState
            .remainingSeconds *
            1000;

        return {
          ...previousState,

          timerStatus:
            "running",

          roundEndsAt,
        };
      }
    );
  }

  // ============================================
// FINALIZAR RONDA
// ============================================

const finishRound =
  useCallback(() => {
    setGameState(
      (previousState) => {
        /*
         * No hacemos nada si la partida
         * ya terminó.
         */
        if (
          previousState.currentWeek <= 0
        ) {
          return previousState;
        }

        /*
         * Evita que la misma ronda pueda
         * finalizar dos veces.
         *
         * Esto también evita que el costo
         * automático se descuente dos veces
         * si justo coincide el timer en 0
         * con un clic en "Finalizar ronda".
         */
        if (
          previousState.timerStatus !==
            "running" &&
          previousState.timerStatus !==
            "paused"
        ) {
          return previousState;
        }

        // ======================================
        // COSTO AUTOMÁTICO DE LA RONDA
        // ======================================

        /*
         * El valor numérico del indicador
         * configurable se interpreta como
         * costo por semana/ronda.
         *
         * Ejemplo:
         *
         * Presupuesto: $7.700
         * Costo almacenamiento: $500
         *
         * Al terminar:
         * $7.700 - $500 = $7.200
         */

        const roundCost =
          Math.max(
            0,
            Number(
              previousState
                .customMetric
                .value
            ) || 0
          );

        const budgetAfterRoundCost =
          previousState.budget -
          roundCost;

        // ======================================
        // SNAPSHOT DEL CIERRE DE SEMANA
        // ======================================

        /*
         * Guardamos el presupuesto DESPUÉS
         * de aplicar el costo automático,
         * porque ese es el verdadero valor
         * con el que termina la semana.
         */

        const snapshot:
          RoundSnapshot = {
          week:
            previousState.currentWeek,

          budget:
            budgetAfterRoundCost,

          leadTime:
            previousState.leadTime,

          inventory:
            previousState.inventory,
        };

        const nextWeek =
          previousState.currentWeek - 1;

        return {
          ...previousState,

          // ====================================
          // APLICAR COSTO AUTOMÁTICO
          // ====================================

          budget:
            budgetAfterRoundCost,

          // ====================================
          // SEMANA SIGUIENTE
          // ====================================

          currentWeek:
            nextWeek,

          // ====================================
          // HISTORIAL
          // ====================================

          history: [
            ...previousState.history,
            snapshot,
          ],

          // ====================================
          // REINICIAR TIMER
          // ====================================

          remainingSeconds:
            previousState
              .roundDurationSeconds,

          /*
           * Si quedan semanas:
           * queda esperando el inicio
           * de la siguiente ronda.
           *
           * Si llegó a 0:
           * partida finalizada.
           */

          timerStatus:
            nextWeek === 0
              ? "finished"
              : "idle",

          roundEndsAt: null,
          // La situación solo pertenece
          // a la semana que acaba de cerrar.
          currentEvent: "",
        };
      }
    );
  }, []);

  // ============================================
  // REINICIAR PARTIDA
  // ============================================

  function resetGame() {
    setGameState({
      ...initialGameState,

      goals:
        initialGameState.goals.map(
          (goal) => ({
            ...goal,
            completed: false,
          })
        ),

      history: [],

      eventHistory: [],
      currentEvent: "",

      timerStatus:
        "idle",

      roundEndsAt:
        null,
    });

    localStorage.removeItem(
      STORAGE_KEY
    );
  }

  // ============================================
  // TODO LO QUE PUEDEN USAR
  // MASTER Y DISPLAY
  // ============================================

  return {
    // Estado
    gameState,
    isLoaded,

    // Configuración inicial
    configureInitialGame,

    // Lead Time
    decreaseLeadTime,
    increaseLeadTime,

    // Presupuesto
    addBudget,
    subtractBudget,

    // Inventario
    setInventory,

    // Indicador configurable
    updateCustomMetric,

    // Metas
    addGoal,
    toggleGoal,
    removeGoal,

    // Evento
    setCurrentEvent,
    publishEvent,

    // Rondas
    startRound,
    pauseRound,
    resumeRound,
    finishRound,

    // Reiniciar
    resetGame,
  };
}