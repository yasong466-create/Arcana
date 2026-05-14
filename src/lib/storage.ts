const HISTORY_KEY = "oracle_tarot_history_v1";
const FAV_KEY = "oracle_tarot_favorites_v1";
const DAILY_KEY = "oracle_tarot_daily_v1";

export interface HistoryEntry {
  id: string;
  at: number;
  theme: string;
  spread: string;
  summary: string;
}

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveHistory(entry: HistoryEntry): void {
  if (typeof window === "undefined") return;
  const prev = loadHistory();
  const next = [entry, ...prev].slice(0, 40);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}

export function loadFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
  } catch {
    return [];
  }
}

export function toggleFavorite(cardId: string): boolean {
  if (typeof window === "undefined") return false;
  const set = new Set(loadFavorites());
  if (set.has(cardId)) set.delete(cardId);
  else set.add(cardId);
  localStorage.setItem(FAV_KEY, JSON.stringify([...set]));
  return set.has(cardId);
}

export function isFavorite(cardId: string): boolean {
  return loadFavorites().includes(cardId);
}

export interface DailyDraw {
  date: string;
  cardId: string;
  reversed: boolean;
}

export function getDailyDraw(): DailyDraw | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(DAILY_KEY) || "null");
  } catch {
    return null;
  }
}

export function setDailyDraw(draw: DailyDraw): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DAILY_KEY, JSON.stringify(draw));
}
