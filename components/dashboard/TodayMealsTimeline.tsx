"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

interface MealItem {
  icon: ReactNode;
  title: string;
  recipeName: string;
  isPlanned: boolean;
}

interface TodayMealsTimelineProps {
  meals: MealItem[];
  plannedCount: number;
  totalCount: number;
}

export default function TodayMealsTimeline({
  meals,
  plannedCount,
  totalCount,
}: TodayMealsTimelineProps) {
  return (
    <section className="rounded-3xl border border-[#EADCC4] bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#C9872F]">
  Today's Meals
</p>

<h2 className="mt-1 text-2xl font-bold text-[#2F6B3C] sm:text-3xl">
  Meal Timeline
</h2>

<p className="mt-2 text-sm leading-6 text-gray-500">
  {plannedCount} of {totalCount} meals planned today.
</p>
        </div>

        <Link
          href="/planner"
          className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-[#EADCC4] bg-[#FFF8EC] px-3 py-2 text-sm font-semibold text-[#5A4032] transition hover:bg-[#F4E8D0]"
        >
          Planner
          <ChevronRight size={16} />
        </Link>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-[#F0E6D6] bg-[#FFFDF9]">
        {meals.map((meal, index) => (
          <div
            key={meal.title}
            className={`flex items-center gap-3 px-4 py-3.5 sm:px-5 ${
              index !== meals.length - 1
                ? "border-b border-[#F0E6D6]"
                : ""
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F6F2E8] text-[#2F6B3C]">
              {meal.icon}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                {meal.title}
              </p>

              <p
                className={`mt-0.5 truncate text-sm font-bold sm:text-base ${
                  meal.isPlanned
                    ? "text-[#2F6B3C]"
                    : "text-gray-400"
                }`}
              >
                {meal.recipeName}
              </p>
            </div>

            <div
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                meal.isPlanned
                  ? "bg-[#2F6B3C]"
                  : "bg-[#D9D9D9]"
              }`}
              title={
                meal.isPlanned
                  ? "Meal planned"
                  : "Meal not planned"
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
}