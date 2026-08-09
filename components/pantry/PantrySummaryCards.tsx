import {
  BadgeCheck,
  ChevronRight,
  PackageOpen,
  PackageX,
  TrendingDown,
} from "lucide-react";

import {
  typography,
} from "../../lib/theme/typography";

export type PantrySummaryFilter =
  | "all"
  | "in_stock"
  | "low_stock"
  | "out_of_stock";

type PantrySummaryCardsProps = {
  totalItems: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;

  onSelect: (
    filter: PantrySummaryFilter
  ) => void;
};

export default function PantrySummaryCards({
  totalItems,
  inStock,
  lowStock,
  outOfStock,
  onSelect,
}: PantrySummaryCardsProps) {
  const metrics = [
    {
      label: "Total Items",
      value: totalItems,
      filter:
        "all" as PantrySummaryFilter,

      icon: PackageOpen,

      cardClass:
        "border-[#E6E0D7] bg-white",

      iconClass:
        "bg-[#EEF5F0] text-[#2F6B3C]",

      valueClass:
        "text-[#245B32]",
    },

    {
      label: "In Stock",
      value: inStock,

      filter:
        "in_stock" as PantrySummaryFilter,

      icon: BadgeCheck,

      cardClass:
        "border-green-100 bg-[#F7FBF7]",

      iconClass:
        "bg-green-100 text-green-700",

      valueClass:
        "text-green-700",
    },

    {
      label: "Running Low",
      value: lowStock,

      filter:
        "low_stock" as PantrySummaryFilter,

      icon: TrendingDown,

      cardClass:
        "border-amber-100 bg-[#FFF9EF]",

      iconClass:
        "bg-amber-100 text-[#B87516]",

      valueClass:
        "text-[#B87516]",
    },

    {
      label: "Out of Stock",
      value: outOfStock,

      filter:
        "out_of_stock" as PantrySummaryFilter,

      icon: PackageX,

      cardClass:
        "border-red-100 bg-[#FFF7F6]",

      iconClass:
        "bg-red-100 text-red-600",

      valueClass:
        "text-red-600",
    },
  ];

  return (
    <section className="mb-4 grid grid-cols-4 gap-2 sm:gap-3">
      {metrics.map(
        (metric) => {
          const Icon =
            metric.icon;

          return (
            <button
              key={
                metric.label
              }
              type="button"
              onClick={() =>
                onSelect(
                  metric.filter
                )
              }
              aria-label={`View ${metric.label}`}
              className={`group rounded-2xl border px-2 py-2.5 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] sm:px-4 sm:py-3 ${metric.cardClass}`}
            >
              <div
  className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full ${metric.iconClass}`}
>
  <Icon
    size={19}
    strokeWidth={1.8}
  />
</div>

              <p
                className={`${typography.caption} mt-1.5 min-h-8 font-medium leading-4 text-[#6F675F] sm:min-h-0`}
              >
                {metric.label}
              </p>

              <p
                className={`${typography.stat} mt-1 ${metric.valueClass}`}
              >
                {metric.value}
              </p>

              <div className="mt-1 flex items-center justify-center gap-0.5 text-[9.5px] font-medium text-[#AAA39B] transition group-hover:text-[#2F6B3C] sm:mt-1.5">
                <span>
                  View
                </span>

                <ChevronRight
                  size={11}
                  strokeWidth={1.8}
                />
              </div>
            </button>
          );
        }
      )}
    </section>
  );
}