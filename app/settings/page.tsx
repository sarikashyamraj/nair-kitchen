"use client";

import { useEffect, useState } from "react";
import { countries } from "../../data/countries";
import AppLayout from "../../components/AppLayout";
import CurrencyPicker from "../../components/settings/CurrencyPicker";
import {
  CurrencyCode,
  DateFormat,
  MeasurementSystem,
  UserPreferences,
  WeekStartDay,
} from "../../types/preferences";

import { defaultPreferences } from "../../data/defaultPreferences";

import {
  loadPreferences,
  savePreferences,
} from "../../lib/preferencesStorage";





const dateFormats: DateFormat[] = [
  "DD/MM/YYYY",
  "MM/DD/YYYY",
  "YYYY-MM-DD",
];

const weekStartOptions: WeekStartDay[] = [
  "Monday",
  "Sunday",
];

export default function SettingsPage() {
  const [preferences, setPreferences] =
    useState<UserPreferences>(defaultPreferences);

  const [isLoaded, setIsLoaded] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    setPreferences(loadPreferences());
    setIsLoaded(true);
  }, []);

  function updatePreference<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) {
    setPreferences((currentPreferences) => ({
      ...currentPreferences,
      [key]: value,
    }));
  }

  function handleSave() {
    savePreferences(preferences);

    window.dispatchEvent(
      new Event("preferences-updated")
    );

    setSavedMessage("Settings saved successfully.");

    window.setTimeout(() => {
      setSavedMessage("");
    }, 3000);
  }

  if (!isLoaded) {
    return (
      <AppLayout>
        <div className="rounded-2xl border border-[#EADCC4] bg-white p-6 text-sm text-gray-500 shadow-sm">
          Loading settings...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <section className="rounded-2xl border border-[#EADCC4] bg-white p-5 shadow-sm sm:p-6">
          <h1 className="text-2xl font-bold text-[#2F6B3C]">
            Settings
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Personalise Kitchen Brain for your household...
          </p>
        </section>

        {/* Regional Settings */}
<section className="rounded-2xl border border-[#EADCC4] bg-white p-5 shadow-sm sm:p-6">
  <div>
    <h2 className="text-xl font-bold text-[#2F6B3C]">
      🌍 Regional
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      Control currency, date display, and weekly planning.
    </p>
  </div>

  <div className="mt-5 divide-y divide-[#F4E8D0]">
    {/* Country */}
    <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold text-[#5A4032]">
          Country
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Used for regional defaults.
        </p>
      </div>

      <select
        value={preferences.country}
        onChange={(event) =>
          updatePreference(
            "country",
            event.target.value
          )
        }
        className="w-full rounded-xl border border-[#EADCC4] bg-white px-4 py-3 outline-none focus:border-[#2F6B3C] sm:w-64"
      >
        {countries.map((country) => (
          <option
            key={country}
            value={country}
          >
            {country}
          </option>
        ))}
      </select>
    </div>

    {/* Currency */}
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold text-[#5A4032]">
          Currency
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Used throughout Budget and Grocery.
        </p>
      </div>

      <div className="w-full sm:w-80">
        <CurrencyPicker
          value={preferences.currency}
          onChange={(currencyCode) =>
            updatePreference(
              "currency",
              currencyCode as CurrencyCode
            )
          }
        />
      </div>
    </div>

    {/* Date Format */}
    <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold text-[#5A4032]">
          Date Format
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Controls how dates appear in the app.
        </p>
      </div>

      <select
        value={preferences.dateFormat}
        onChange={(event) =>
          updatePreference(
            "dateFormat",
            event.target.value as DateFormat
          )
        }
        className="w-full rounded-xl border border-[#EADCC4] bg-white px-4 py-3 outline-none focus:border-[#2F6B3C] sm:w-64"
      >
        {dateFormats.map((format) => (
          <option
            key={format}
            value={format}
          >
            {format}
          </option>
        ))}
      </select>
    </div>

    {/* Week Starts On */}
    <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold text-[#5A4032]">
          Week Starts On
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Used by the Meal Planner.
        </p>
      </div>

      <select
        value={preferences.weekStartsOn}
        onChange={(event) =>
          updatePreference(
            "weekStartsOn",
            event.target.value as WeekStartDay
          )
        }
        className="w-full rounded-xl border border-[#EADCC4] bg-white px-4 py-3 outline-none focus:border-[#2F6B3C] sm:w-64"
      >
        {weekStartOptions.map((day) => (
          <option
            key={day}
            value={day}
          >
            {day}
          </option>
        ))}
      </select>
    </div>
  </div>
</section>

        {/* Measurement */}
        <section className="rounded-2xl border border-[#EADCC4] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold text-[#2F6B3C]">
            📏 Measurement
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Select the measurement system used in Pantry and Recipes.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {(["Metric", "Imperial"] as MeasurementSystem[]).map(
              (system) => (
                <button
                  key={system}
                  type="button"
                  onClick={() =>
                    updatePreference(
                      "measurementSystem",
                      system
                    )
                  }
                  className={`rounded-xl border px-4 py-3 font-semibold transition ${
                    preferences.measurementSystem === system
                      ? "border-[#2F6B3C] bg-[#2F6B3C] text-white"
                      : "border-[#EADCC4] bg-[#FFF8EC] text-[#5A4032]"
                  }`}
                >
                  {system}
                </button>
              )
            )}
          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-2xl border border-[#EADCC4] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold text-[#2F6B3C]">
            🔔 Notifications
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Choose which kitchen reminders should be active.
          </p>

          <div className="mt-5 divide-y divide-[#F4E8D0]">
            {[
              {
                key: "lowStockAlerts",
                label: "Low Stock Alerts",
                description:
                  "Show alerts when pantry items are running low.",
              },
              {
                key: "mealReminders",
                label: "Meal Planner Reminders",
                description:
                  "Show reminders when today’s meals are incomplete.",
              },
              {
                key: "groceryReminders",
                label: "Grocery Reminders",
                description:
                  "Show alerts when grocery items are pending.",
              },
            ].map((item) => {
              const key =
                item.key as keyof Pick<
                  UserPreferences,
                  | "lowStockAlerts"
                  | "mealReminders"
                  | "groceryReminders"
                >;

              const isEnabled = preferences[key];

              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="font-semibold text-[#5A4032]">
                      {item.label}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {item.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={isEnabled}
                    onClick={() =>
                      updatePreference(
                        key,
                        !isEnabled
                      )
                    }
                    className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                      isEnabled
                        ? "bg-[#2F6B3C]"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                        isEnabled
                          ? "left-6"
                          : "left-1"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Save Area */}
        <section className="sticky bottom-0 rounded-2xl border border-[#EADCC4] bg-white/95 p-4 shadow-lg backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              {savedMessage ||
                "Save your changes to apply them across the app."}
            </p>

            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-[#2F6B3C] px-6 py-3 font-semibold text-white"
            >
              Save Settings
            </button>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}