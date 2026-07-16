export type CurrencyCode =
  | "AED"
  | "INR"
  | "USD"
  | "GBP"
  | "EUR"
  | "AUD"
  | "CAD"
  | "SGD"
  | "SAR"
  | "QAR"
  | "OMR"
  | "KWD"
  | "JPY";

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