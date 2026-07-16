import { createClient } from "../utils/supabase/client";

import { UserPreferences } from "../types/preferences";

import { defaultPreferences } from "../data/defaultPreferences";

type UserPreferencesRow = {
  user_id: string;
  country: string | null;
  currency: string | null;
  date_format: string | null;
  week_starts_on: string | null;
  measurement_system: string | null;
  low_stock_alerts: boolean | null;
  meal_reminders: boolean | null;
  grocery_reminders: boolean | null;
};

function mapPreferencesRow(
  row: UserPreferencesRow
): UserPreferences {
  return {
    country:
      row.country ||
      defaultPreferences.country,

    currency:
      (row.currency ||
        defaultPreferences.currency) as UserPreferences["currency"],

    dateFormat:
      (row.date_format ||
        defaultPreferences.dateFormat) as UserPreferences["dateFormat"],

    weekStartsOn:
      (row.week_starts_on ||
        defaultPreferences.weekStartsOn) as UserPreferences["weekStartsOn"],

    measurementSystem:
      (row.measurement_system ||
        defaultPreferences.measurementSystem) as UserPreferences["measurementSystem"],

    lowStockAlerts:
      row.low_stock_alerts ??
      defaultPreferences.lowStockAlerts,

    mealReminders:
      row.meal_reminders ??
      defaultPreferences.mealReminders,

    groceryReminders:
      row.grocery_reminders ??
      defaultPreferences.groceryReminders,
  };
}

export async function loadCloudPreferences(): Promise<UserPreferences> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error(
      "You must be signed in to load settings."
    );
  }

  const {
    data,
    error,
  } = await supabase
    .from("user_preferences")
    .select(
      `
      user_id,
      country,
      currency,
      date_format,
      week_starts_on,
      measurement_system,
      low_stock_alerts,
      meal_reminders,
      grocery_reminders
      `
    )
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return saveCloudPreferences(
      defaultPreferences
    );
  }

  return mapPreferencesRow(
    data as UserPreferencesRow
  );
}

export async function saveCloudPreferences(
  preferences: UserPreferences
): Promise<UserPreferences> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error(
      "You must be signed in to save settings."
    );
  }

  const {
    data,
    error,
  } = await supabase
    .from("user_preferences")
    .upsert(
      {
        user_id: user.id,
        country: preferences.country,
        currency: preferences.currency,
        date_format:
          preferences.dateFormat,
        week_starts_on:
          preferences.weekStartsOn,
        measurement_system:
          preferences.measurementSystem,
        low_stock_alerts:
          preferences.lowStockAlerts,
        meal_reminders:
          preferences.mealReminders,
        grocery_reminders:
          preferences.groceryReminders,
        updated_at:
          new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    )
    .select(
      `
      user_id,
      country,
      currency,
      date_format,
      week_starts_on,
      measurement_system,
      low_stock_alerts,
      meal_reminders,
      grocery_reminders
      `
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapPreferencesRow(
    data as UserPreferencesRow
  );
}