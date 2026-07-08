import { PantryItem } from "../types/pantry";

const STORAGE_KEY = "nair-kitchen-pantry";

export function loadPantry(): PantryItem[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) return [];

  return JSON.parse(stored);
}

export function savePantry(items: PantryItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}