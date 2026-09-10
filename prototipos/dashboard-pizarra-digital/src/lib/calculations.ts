import type { Goal } from "@/types/game";

// ============================================
// CÁLCULOS DE PORCENTAJES
// ============================================

export function calculatePercentageAmount(
  currentValue: number,
  percentage: number
): number {
  return Math.round(
    currentValue *
      (percentage / 100)
  );
}

export function decreaseByPercentage(
  currentValue: number,
  percentage: number
): number {
  const amount =
    calculatePercentageAmount(
      currentValue,
      percentage
    );

  return Math.max(
    0,
    currentValue - amount
  );
}

export function increaseByPercentage(
  currentValue: number,
  percentage: number
): number {
  const amount =
    calculatePercentageAmount(
      currentValue,
      percentage
    );

  return currentValue + amount;
}

// ============================================
// VICTORIA ÉPICA
// ============================================

export function hasEpicVictory(
  goals: Goal[]
): boolean {
  return (
    goals.length > 0 &&
    goals.every(
      (goal) => goal.completed
    )
  );
}

// ============================================
// PROGRESO DE METAS
// ============================================

export function calculateGoalProgress(
  goals: Goal[]
) {
  const total = goals.length;

  const completed =
    goals.filter(
      (goal) => goal.completed
    ).length;

  const percentage =
    total === 0
      ? 0
      : Math.round(
          (completed / total) * 100
        );

  return {
    total,
    completed,
    percentage,
  };
}

// ============================================
// RESULTADO FINAL
// ============================================

export type GameResultLevel =
  | "epic-victory"
  | "victory"
  | "partial-failure"
  | "critical-failure"
  | "epic-defeat";

export type GameResult = {
  level: GameResultLevel;

  emoji: string;

  title: string;

  message: string;

  completedGoals: number;

  totalGoals: number;

  percentage: number;
};

export function getGameResult(
  goals: Goal[]
): GameResult {
  const {
    total,
    completed,
    percentage,
  } = calculateGoalProgress(goals);

  // ==========================================
  // 100%
  // ==========================================

  if (
    total > 0 &&
    percentage === 100
  ) {
    return {
      level: "epic-victory",

      emoji: "🏆",

      title:
        "¡Victoria Épica!",

      message:
        "La empresa alcanzó todos sus objetivos estratégicos.",

      completedGoals:
        completed,

      totalGoals:
        total,

      percentage,
    };
  }

  // ==========================================
  // 75% - 99%
  // ==========================================

  if (percentage >= 75) {
    return {
      level: "victory",

      emoji: "🎉",

      title:
        "Victoria",

      message:
        "La empresa alcanzó la mayoría de sus objetivos y finaliza con un resultado favorable.",

      completedGoals:
        completed,

      totalGoals:
        total,

      percentage,
    };
  }

  // ==========================================
  // 50% - 74%
  // ==========================================

  if (percentage >= 50) {
    return {
      level:
        "partial-failure",

      emoji: "⚖️",

      title:
        "Fracaso parcial",

      message:
        "La empresa llegó al final, pero varios objetivos importantes quedaron sin cumplir.",

      completedGoals:
        completed,

      totalGoals:
        total,

      percentage,
    };
  }

  // ==========================================
  // 1% - 49%
  // ==========================================

  if (completed > 0) {
    return {
      level:
        "critical-failure",

      emoji: "💥",

      title:
        "Fracaso crítico",

      message:
        "La empresa logró algunos objetivos, pero su desempeño quedó muy por debajo de lo esperado.",

      completedGoals:
        completed,

      totalGoals:
        total,

      percentage,
    };
  }

  // ==========================================
  // 0%
  // ==========================================

  return {
    level:
      "epic-defeat",

    emoji: "☠️",

    title:
      "Derrota Épica",

    message:
      "La empresa terminó la simulación sin alcanzar ninguno de sus objetivos.",

    completedGoals:
      completed,

    totalGoals:
      total,

    percentage,
  };
}