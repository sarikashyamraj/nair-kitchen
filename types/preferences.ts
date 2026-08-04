export type CurrencyCode = string;

export type DateFormat =
  | "DD/MM/YYYY"
  | "MM/DD/YYYY"
  | "YYYY-MM-DD";

export type WeekStartDay = "Monday" | "Sunday";

export type MeasurementSystem = "Metric" | "Imperial";

export interface UserPreferences {
  country: string;
  currency: CurrencyCode;
  dateFormat: DateFormat;
  weekStartsOn: WeekStartDay;
  measurementSystem: MeasurementSystem;
  lowStockAlerts: boolean;
  mealReminders: boolean;
  groceryReminders: boolean;
}