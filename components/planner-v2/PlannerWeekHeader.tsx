"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type PlannerWeekHeaderProps = {
  weekStartDate: string;

  onPreviousWeek: () => void;

  onNextWeek: () => void;
};

function formatWeekRange(
  weekStartDate: string
) {
  const startDate =
    new Date(
      `${weekStartDate}T00:00:00`
    );

  const endDate =
    new Date(
      startDate
    );

  endDate.setDate(
    startDate.getDate() + 6
  );

  const startLabel =
    startDate.toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "short",
      }
    );

  const endLabel =
    endDate.toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

  return `${startLabel} – ${endLabel}`;
}

export default function PlannerWeekHeader({
  weekStartDate,
  onPreviousWeek,
  onNextWeek,
}: PlannerWeekHeaderProps) {
  return (
    <section className="rounded-2xl border border-[#EADCC4] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={
            onPreviousWeek
          }
          aria-label="Previous week"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#EADCC4] bg-[#FCFAF6] text-[#2F6B3C] transition active:scale-95"
        >
          <ChevronLeft
            size={18}
            strokeWidth={2}
          />
        </button>

        <div className="min-w-0 flex-1 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B87516]">
            Weekly Planner
          </p>

          <h1 className="mt-1 text-lg font-bold text-[#2F6B3C]">
            {formatWeekRange(
              weekStartDate
            )}
          </h1>

          <p className="mt-1 text-xs text-[#7A746C]">
            Plan meals using your saved recipes
          </p>
        </div>

        <button
          type="button"
          onClick={
            onNextWeek
          }
          aria-label="Next week"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#EADCC4] bg-[#FCFAF6] text-[#2F6B3C] transition active:scale-95"
        >
          <ChevronRight
            size={18}
            strokeWidth={2}
          />
        </button>
      </div>
    </section>
  );
}