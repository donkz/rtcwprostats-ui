import { IPredictionResult } from "../types/predictions";

export const SCORE_MAP: Record<number, string> = {
  [-3]: "TeamA 3:0",
  [-2]: "TeamA 3:1",
  [-1]: "TeamA 3:2",
  [0]:  "2:2 Draw",
  [1]:  "TeamB 3:2",
  [2]:  "TeamB 3:1",
  [3]:  "TeamB 3:0",
};

export const getScoreLabel = (value: number, teamA: string, teamB: string): string => {
  if (value < 0) return `${Math.abs(value) === 3 ? "3 : 0" : Math.abs(value) === 2 ? "3 : 1" : "3 : 2"}`;
  if (value > 0) return `${value === 3 ? "0 : 3" : value === 2 ? "1 : 3" : "2 : 3"}`;
  return "2 : 2 Draw";
};

export const getSessionAccuracy = (result: IPredictionResult): number => {
  if (result.session_total_dist === 0) return 100;
  return Math.round(
    (1 - result.session_error_dist / result.session_total_dist) * 100
  );
};

export const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// In-memory fallback when localStorage is unavailable
let _inMemorySessionId: string | null = null;

export const getOrCreateSessionId = (): string => {
  const key = "rtcw_prediction_session_id";
  try {
    let id = localStorage.getItem(key);
    if (!id) {
      id = generateSessionId();
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    if (!_inMemorySessionId) {
      _inMemorySessionId = generateSessionId();
    }
    return _inMemorySessionId;
  }
};

export const getRandomPastDate = (): string => {
  const start = new Date("2021-11-01").getTime();
  const end = new Date("2026-02-28").getTime();
  const randomTime = start + Math.random() * (end - start);
  return new Date(randomTime).toISOString().split("T")[0];
};
