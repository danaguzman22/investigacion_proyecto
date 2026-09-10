"use client";

import { useEffect, useState } from "react";

import type { GameState } from "@/types/game";

export function useRoundTimer(gameState: GameState) {
  const [displaySeconds, setDisplaySeconds] =
    useState(gameState.remainingSeconds);

  useEffect(() => {
    function updateTimer() {
      if (
        gameState.timerStatus === "running" &&
        gameState.roundEndsAt
      ) {
        const difference =
          gameState.roundEndsAt - Date.now();

        const seconds = Math.max(
          0,
          Math.ceil(difference / 1000)
        );

        setDisplaySeconds(seconds);
      } else {
        setDisplaySeconds(
          gameState.remainingSeconds
        );
      }
    }

    updateTimer();

    const interval = setInterval(
      updateTimer,
      250
    );

    return () => clearInterval(interval);
  }, [
    gameState.timerStatus,
    gameState.roundEndsAt,
    gameState.remainingSeconds,
  ]);

  return displaySeconds;
}
