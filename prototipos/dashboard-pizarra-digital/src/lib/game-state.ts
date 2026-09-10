import type { GameState } from "@/types/game";

export const initialGameState: GameState = {
  currentWeek: 4,
  totalWeeks: 4,

  roundDurationSeconds: 600,
  remainingSeconds: 600,

  timerStatus: "idle",
  roundEndsAt: null,

  leadTime: 32,
  budget: 7700,

  inventory: "Medio",

  inventoryOptions: [
    "Crítico",
    "Bajo",
    "Medio",
    "Alto",
    "Saturado",
  ],

  customMetric: {
    name: "Costo de almacenamiento",
    value: 500,
    unit: "$/semana",
  },

  goals: [
    {
      id: "1",
      text: "Reducir Lead Time a 15 días",
      completed: false,
    },
    {
      id: "2",
      text: "Mantener presupuesto positivo",
      completed: false,
    },
  ],

  currentEvent: "",
  eventHistory: [],

  initialSnapshot: null,
  history: [],
};