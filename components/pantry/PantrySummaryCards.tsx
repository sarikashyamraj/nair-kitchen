import {
  AlertCircle,
  Archive,
  ArrowDown,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

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
      filter: "all" as PantrySummaryFilter,
      icon: Archive,

      cardClass:
        "border-[#DCE7E3] bg-white",

      iconClass:
        "bg-[#E5F3EC] text-[#2F6B3C]",

      valueClass:
        "text-[#245B32]",
    },

    {
      label: "In Stock",
      value: inStock,
      filter:
        "in_stock" as PantrySummaryFilter,
      icon: CheckCircle2,

      cardClass:
        "border-green-200 bg-green-50/70",

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
      icon: ArrowDown,

      cardClass:
        "border-yellow-200 bg-yellow-50/70",

      iconClass:
        "bg-yellow-100 text-yellow-700",

      valueClass:
        "text-[#C47A00]",
    },

    {
      label: "Out of Stock",
      value: outOfStock,
      filter:
        "out_of_stock" as PantrySummaryFilter,
      icon: AlertCircle,

      cardClass:
        "border-red-200 bg-red-50/70",

      iconClass:
        "bg-red-100 text-red-700",

      valueClass:
        "text-red-700",
    },
  ];

  return (
    <section className="mb-5 grid grid-cols-4 gap-2 sm:gap-3">
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
              className={`group rounded-2xl border px-2 py-3 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] sm:px-4 sm:py-4 ${metric.cardClass}`}
            >
              <div
                className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full ${metric.iconClass}`}
              >
                <Icon
                  size={16}
                />
              </div>

              <p className="mt-2 min-h-8 text-[9px] font-semibold leading-4 text-[#5A4032] sm:min-h-0 sm:text-sm">
                {metric.label}
              </p>

              <p
                className={`mt-1 text-xl font-bold sm:text-2xl ${metric.valueClass}`}
              >
                {metric.value}
              </p>

              <div className="mt-1 flex items-center justify-center gap-0.5 text-[9px] font-semibold text-gray-400 transition group-hover:text-[#2F6B3C] sm:mt-2 sm:text-xs">
                <span>
                  View
                </span>

                <ChevronRight
                  size={12}
                />
              </div>
            </button>
          );
        }
      )}
    </section>
  );
}