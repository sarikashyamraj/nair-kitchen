"use client";

import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  HeartPulse,
  ShoppingCart,
  Utensils,
} from "lucide-react";

interface DashboardHeroProps {
  mealsPlanned: number;
  totalMeals: number;
  groceryRemaining: number;
  kitchenHealth: number;
}

export default function DashboardHero({
  mealsPlanned,
  totalMeals,
  groceryRemaining,
  kitchenHealth,
}: DashboardHeroProps) {
  const mealProgress =
    totalMeals > 0
      ? Math.round((mealsPlanned / totalMeals) * 100)
      : 0;

  const healthLabel =
    kitchenHealth >= 90
      ? "Excellent"
      : kitchenHealth >= 70
        ? "Good"
        : kitchenHealth >= 50
          ? "Fair"
          : "Needs attention";

  return (
    <section className="overflow-hidden rounded-3xl border border-[#EADCC4] bg-gradient-to-br from-[#FFFDF8] via-[#FFF8EC] to-[#F2F8F1] shadow-sm">
      <div className="p-4 sm:p-5 lg:p-6">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C9872F]">
              Today&apos;s overview
            </p>

            <h1 className="mt-1 text-xl font-bold text-[#2F6B3C] sm:text-2xl">
              Your kitchen at a glance
            </h1>

            <p className="mt-1 text-sm text-[#7A6A5D]">
              Meals, groceries and pantry health in one view.
            </p>
          </div>

          <div className="hidden rounded-2xl bg-white/80 px-3 py-2 text-right shadow-sm sm:block">
            <p className="text-xs text-gray-500">
              Kitchen status
            </p>

            <p className="text-sm font-bold text-[#2F6B3C]">
              {healthLabel}
            </p>
          </div>
        </div>

        {/* Compact action buttons */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link
            href="/planner"
            className="group flex items-center justify-between rounded-2xl bg-[#2F6B3C] px-4 py-3 text-white transition hover:bg-[#285D34]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                <CalendarDays size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Planner
                </p>

                <p className="text-xs text-white/75">
                  View meals
                </p>
              </div>
            </div>

            <ChevronRight
              size={18}
              className="transition group-hover:translate-x-0.5"
            />
          </Link>

          <Link
            href="/grocery"
            className="group flex items-center justify-between rounded-2xl border border-[#EADCC4] bg-white px-4 py-3 text-[#5A4032] transition hover:bg-[#FFF8EC]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <ShoppingCart size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Grocery
                </p>

                <p className="text-xs text-gray-500">
                  {groceryRemaining} pending
                </p>
              </div>
            </div>

            <ChevronRight
              size={18}
              className="transition group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Compact overview indicators */}
        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
          <div className="rounded-2xl border border-[#F0E4D3] bg-white/90 p-3">
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 text-[#C9872F]">
                <Utensils size={16} />
              </div>

              <span className="text-xs font-semibold text-[#C9872F]">
                {mealProgress}%
              </span>
            </div>

            <p className="mt-3 text-lg font-bold text-[#2F6B3C] sm:text-xl">
              {mealsPlanned}/{totalMeals}
            </p>

            <p className="mt-0.5 text-[11px] leading-tight text-gray-500 sm:text-xs">
              Meals planned
            </p>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-orange-100">
              <div
                className="h-full rounded-full bg-[#C9872F] transition-all"
                style={{
                  width: `${Math.min(mealProgress, 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#F0E4D3] bg-white/90 p-3">
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-50 text-green-700">
                <HeartPulse size={16} />
              </div>

              <span className="text-xs font-semibold text-green-700">
                {healthLabel}
              </span>
            </div>

            <p className="mt-3 text-lg font-bold text-green-700 sm:text-xl">
              {kitchenHealth}%
            </p>

            <p className="mt-0.5 text-[11px] leading-tight text-gray-500 sm:text-xs">
              Pantry health
            </p>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-green-100">
              <div
                className="h-full rounded-full bg-green-600 transition-all"
                style={{
                  width: `${Math.min(kitchenHealth, 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#F0E4D3] bg-white/90 p-3">
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <ShoppingCart size={16} />
              </div>

              <span className="text-xs font-semibold text-blue-700">
                Pending
              </span>
            </div>

            <p className="mt-3 text-lg font-bold text-blue-700 sm:text-xl">
              {groceryRemaining}
            </p>

            <p className="mt-0.5 text-[11px] leading-tight text-gray-500 sm:text-xs">
              Grocery items
            </p>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-blue-100">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{
                  width:
                    groceryRemaining === 0
                      ? "100%"
                      : `${Math.min(
                          Math.max(groceryRemaining * 8, 20),
                          100
                        )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}