import { UserPreferences } from "../types/preferences";

export const defaultPreferences: UserPreferences = {
  country: "United Arab Emirates",
  currency: "AED",
  dateFormat: "DD/MM/YYYY",
  weekStartsOn: "Monday",
  measurementSystem: "Metric",
  lowStockAlerts: true,
  mealReminders: true,
  groceryReminders: true,
};