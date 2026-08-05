"use client";

import {
  BookOpen,
  CalendarDays,
  Package,
  ShoppingCart,
} from "lucide-react";

interface KitchenSnapshotProps {
  pantryItems: number;
  groceryRemaining: number;
  recipesSaved: number;
  mealsPlanned: number;
  kitchenScore: number;
}

export default function KitchenSnapshot({
  pantryItems,
  groceryRemaining,
  recipesSaved,
  mealsPlanned,
  kitchenScore,
}: KitchenSnapshotProps) {
  const metrics = [
    {
      label: "Pantry",
      value: pantryItems,
      suffix: "items",
      icon: Package,
      iconStyle: "bg-[#E8F3E9] text-[#2F6B3C]",
    },
    {
      label: "Grocery",
      value: groceryRemaining,
      suffix: "left",
      icon: ShoppingCart,
      iconStyle: "bg-[#EAF4FB] text-[#39769A]",
    },
    {
      label: "Recipes",
      value: recipesSaved,
      suffix: "saved",
      icon: BookOpen,
      iconStyle: "bg-[#FFF3DB] text-[#C9872F]",
    },
    {
      label: "Planner",
      value: mealsPlanned,
      suffix: "meals",
      icon: CalendarDays,
      iconStyle: "bg-[#F0EAF8] text-[#75589A]",
    },
  ];

  const scoreMessage =
    kitchenScore >= 80
      ? "Everything looks healthy"
      : kitchenScore >= 60
        ? "Your kitchen needs some attention"
        : "Let’s improve your kitchen health";

  return (
    <section className="overflow-hidden rounded-3xl border border-[#EADCC4] bg-white shadow-sm">
      <div className="bg-gradient-to-br from-[#F4FAF3] via-white to-[#FFF8EB] p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#C9872F]">
              Kitchen Snapshot
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#2F6B3C] sm:text-2xl">
              Your kitchen today
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Everything important in one place
            </p>
          </div>

          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-4 ring-[#DCEBDD]">
            <div className="text-center">
              <p className="text-xl font-bold text-[#2F6B3C]">
                {kitchenScore}%
              </p>
              <p className="text-[10px] font-medium text-gray-500">Score</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <div
                key={metric.label}
                className="rounded-2xl border border-[#F0E6D6] bg-white/90 p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${metric.iconStyle}`}
                >
                  <Icon size={18} strokeWidth={2.2} />
                </div>

                <p className="mt-3 text-xs font-medium text-gray-500">
                  {metric.label}
                </p>

                <div className="mt-0.5 flex items-baseline gap-1">
                  <span className="text-lg font-bold text-[#2F6B3C]">
                    {metric.value}
                  </span>

                  <span className="text-[11px] text-gray-500">
                    {metric.suffix}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-[#F0E6D6] bg-[#FFFDF8] px-5 py-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E4F3E6] text-xs">
          {kitchenScore >= 80 ? "✓" : "!"}
        </span>

        <p className="text-sm font-medium text-[#45614C]">
          {scoreMessage}
        </p>
      </div>
    </section>
  );
}