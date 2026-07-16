import { UserPreferences } from "../types/preferences";
import { defaultPreferences } from "../data/defaultPreferences";

const PREFERENCES_KEY = "nair-kitchen-user-preferences";

export function loadPreferences(): UserPreferences {
  if (typeof window === "undefined") {
    return defaultPreferences;
  }

  try {
    const savedPreferences =
      localStorage.getItem(PREFERENCES_KEY);

    return savedPreferences
      ? JSON.parse(savedPreferences)
      : defaultPreferences;
  } catch {
    return defaultPreferences;
  }
}

export function savePreferences(
  preferences: UserPreferences
) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    PREFERENCES_KEY,
    JSON.stringify(preferences)
  );
}