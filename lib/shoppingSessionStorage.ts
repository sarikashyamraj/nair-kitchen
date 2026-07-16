import { ShoppingSession } from "../types/shoppingSession";

const SHOPPING_SESSIONS_KEY =
  "nair-kitchen-shopping-sessions";

export function loadShoppingSessions(): ShoppingSession[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedSessions = localStorage.getItem(
      SHOPPING_SESSIONS_KEY
    );

    return savedSessions
      ? JSON.parse(savedSessions)
      : [];
  } catch {
    return [];
  }
}

