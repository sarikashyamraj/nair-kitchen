import { DateFormat } from "../types/preferences";

function padNumber(value: number) {
  return String(value).padStart(2, "0");
}

export function parseStoredDate(
  dateValue: string
): Date | null {
  if (!dateValue) return null;

  const parts = dateValue.split("-");

  if (parts.length !== 3) {
    const parsedDate = new Date(dateValue);

    return Number.isNaN(parsedDate.getTime())
      ? null
      : parsedDate;
  }

  const [year, month, day] = parts.map(Number);

  const parsedDate = new Date(
    year,
    month - 1,
    day
  );

  return Number.isNaN(parsedDate.getTime())
    ? null
    : parsedDate;
}

export function formatDateByPreference(
  dateValue: string | Date,
  dateFormat: DateFormat
): string {
  const date =
    typeof dateValue === "string"
      ? parseStoredDate(dateValue)
      : dateValue;

  if (!date) return "";

  const day = padNumber(date.getDate());
  const month = padNumber(date.getMonth() + 1);
  const year = date.getFullYear();

  switch (dateFormat) {
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`;

    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;

    case "DD/MM/YYYY":
    default:
      return `${day}/${month}/${year}`;
  }
}

export function formatLongDate(
  dateValue: string | Date,
  locale = "en-AE"
): string {
  const date =
    typeof dateValue === "string"
      ? parseStoredDate(dateValue)
      : dateValue;

  if (!date) return "";

  return date.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatShortDate(
  dateValue: string | Date,
  locale = "en-AE"
): string {
  const date =
    typeof dateValue === "string"
      ? parseStoredDate(dateValue)
      : dateValue;

  if (!date) return "";

  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatMonthYear(
  monthKey: string,
  locale = "en-AE"
): string {
  const [year, month] = monthKey.split("-");

  const date = new Date(
    Number(year),
    Number(month) - 1,
    1
  );

  return date.toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });
}