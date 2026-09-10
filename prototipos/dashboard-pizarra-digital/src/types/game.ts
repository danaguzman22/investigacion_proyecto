// ============================================
// META / OBJETIVO
// ============================================

export type Goal = {
  id: string;
  text: string;
  completed: boolean;
};


export type GameEvent = {
  id: string;
  week: number;
  text: string;
  createdAt: number;
};

// ============================================
// INDICADOR CONFIGURABLE
// ============================================

export type CustomMetric = {
  name: string;
  value: number;
  unit: string;
};

// ============================================
// SNAPSHOT DEL ESTADO DE LA EMPRESA
// ============================================

export type RoundSnapshot = {
  week: number;
  budget: number;
  leadTime: number;
  inventory: string;
};

// ============================================
// ESTADO DEL TEMPORIZADOR
// ============================================

export type TimerStatus =
  | "idle"
  | "running"
  | "paused"
  | "finished";

// ============================================
// ESTADO GENERAL DE LA PARTIDA
// ============================================

export type GameState = {
  // ------------------------------------------
  // SEMANAS
  // ------------------------------------------

  currentWeek: number;
  totalWeeks: number;

  // ------------------------------------------
  // TEMPORIZADOR
  // ------------------------------------------

  roundDurationSeconds: number;
  remainingSeconds: number;
  timerStatus: TimerStatus;

  roundEndsAt: number | null;

  // ------------------------------------------
  // MÉTRICAS PRINCIPALES
  // ------------------------------------------

  leadTime: number;
  budget: number;

  // ------------------------------------------
  // INVENTARIO
  // ------------------------------------------

  inventory: string;
  inventoryOptions: string[];

  // ------------------------------------------
  // INDICADOR PERSONALIZADO
  // ------------------------------------------

  customMetric: CustomMetric;

  // ------------------------------------------
  // METAS
  // ------------------------------------------

  goals: Goal[];

  // ------------------------------------------
  // EVENTO ACTUAL
  // ------------------------------------------

  currentEvent: string;
  eventHistory: GameEvent[];

  // ------------------------------------------
  // ESTADO INICIAL DE LA EMPRESA
  // ------------------------------------------

  /*
   * Se guarda cuando el Máster aplica
   * la configuración inicial.
   *
   * No forma parte del historial de rondas.
   */
  initialSnapshot: RoundSnapshot | null;

  // ------------------------------------------
  // HISTORIAL DE RONDAS
  // ------------------------------------------

  history: RoundSnapshot[];
};