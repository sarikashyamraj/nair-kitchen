import {
  CheckCircle2,
  ListChecks,
  ShoppingCart,
  TimerReset,
} from "lucide-react";

import { ShoppingItem } from "../../types/shopping";

import {
  typography,
} from "../../lib/theme/typography";

interface ShoppingStatsProps {
  items: ShoppingItem[];
}

export default function ShoppingStats({
  items,
}: ShoppingStatsProps) {
  const totalItems =
    items.length;

  const purchasedItems =
    items.filter(
      (item) =>
        item.purchased
    ).length;

  const remainingItems =
    totalItems -
    purchasedItems;

  const completion =
    totalItems === 0
      ? 0
      : Math.round(
          (
            purchasedItems /
            totalItems
          ) * 100
        );

  const metrics = [
    {
      label: "Total",
      value: totalItems,
      icon: ShoppingCart,
      iconClass:
        "bg-[#EEF5F0] text-[#2F6B3C]",
      valueClass:
        "text-[#245B32]",
    },
    {
      label: "Purchased",
      value: purchasedItems,
      icon: CheckCircle2,
      iconClass:
        "bg-green-100 text-green-700",
      valueClass:
        "text-green-700",
    },
    {
      label: "To Buy",
      value: remainingItems,
      icon: TimerReset,
      iconClass:
        "bg-amber-100 text-[#B87516]",
      valueClass:
        "text-[#B87516]",
    },
    {
      label: "Complete",
      value: `${completion}%`,
      icon: ListChecks,
      iconClass:
        "bg-[#F1ECFA] text-[#7C3AED]",
      valueClass:
        "text-[#7C3AED]",
    },
  ];

  return (
    <section className="rounded-2xl border border-[#E8DED1] bg-white p-3 shadow-sm">
      {/* Compact Metrics */}
      <div className="grid grid-cols-4 gap-2">
        {metrics.map(
          (metric) => {
            const Icon =
              metric.icon;

            return (
              <div
                key={
                  metric.label
                }
                className="rounded-xl bg-[#FCFAF6] px-1.5 py-2 text-center"
              >
                <div
                  className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full ${metric.iconClass}`}
                >
                  <Icon
                    size={14}
                    strokeWidth={1.9}
                  />
                </div>

                <p
                  className={`${typography.stat} mt-1 ${metric.valueClass}`}
                >
                  {metric.value}
                </p>

                <p
                  className={`${typography.caption} mt-0.5 truncate text-[#8A8178]`}
                >
                  {metric.label}
                </p>
              </div>
            );
          }
        )}
      </div>

      {/* Integrated Progress */}
      <div className="mt-3 border-t border-[#F0E7DA] pt-3">
        <div className="flex items-center justify-between gap-3">
          <p
            className={`${typography.bodyMedium} text-[#245B32]`}
          >
            Shopping Progress
          </p>

          <span
            className={`${typography.caption} font-semibold text-[#245B32]`}
          >
            {completion}%
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E7ECE8]">
          <div
            className="h-full rounded-full bg-[#2F6B3C] transition-all duration-500"
            style={{
              width: `${completion}%`,
            }}
          />
        </div>

        <p
          className={`${typography.caption} mt-1.5 text-[#7A746C]`}
        >
          {purchasedItems} of{" "}
          {totalItems}{" "}
          {totalItems === 1
            ? "item"
            : "items"}{" "}
          purchased
        </p>
      </div>
    </section>
  );
}