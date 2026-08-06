import {
  AlertCircle,
  Archive,
  ArrowDown,
  CheckCircle2,
} from "lucide-react";

type PantrySummaryCardsProps = {
  totalItems: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
};

export default function PantrySummaryCards({
  totalItems,
  inStock,
  lowStock,
  outOfStock,
}: PantrySummaryCardsProps) {
  const metrics = [
    {
      label: "Total Items",
      value: totalItems,
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
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <article
            key={metric.label}
            className={`rounded-2xl border px-2 py-3 text-center shadow-sm sm:px-4 sm:py-4 ${metric.cardClass}`}
          >
            <div
              className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full ${metric.iconClass}`}
            >
              <Icon size={16} />
            </div>

            <p className="mt-2 min-h-8 text-[9px] font-semibold leading-4 text-[#5A4032] sm:min-h-0 sm:text-sm">
              {metric.label}
            </p>

            <p
              className={`mt-1 text-xl font-bold sm:text-2xl ${metric.valueClass}`}
            >
              {metric.value}
            </p>
          </article>
        );
      })}
    </section>
  );
}