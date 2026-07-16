import { ShoppingItem } from "../types/shopping";

export const SHOPPING_STORAGE_KEY = "shopping-items";

export function loadShopping(): ShoppingItem[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(SHOPPING_STORAGE_KEY);

  return stored ? JSON.parse(stored) : [];
}