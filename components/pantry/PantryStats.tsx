type PantryStatsProps = {
  totalItems: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  pantryHealth: number;
};

type HealthPresentation = {
  label: string;
  message: string;
  progressClass: string;
  textClass: string;
  backgroundClass: string;
  borderClass: string;
};

function getHealthPresentation(
  health: number,
  outOfStock: number,
  lowStock: number
): HealthPresentation {
  if (health >= 90) {
    return {
      label: "Excellent",
      message:
        outOfStock === 0 && lowStock === 0
          ? "Everything is well stocked."
          : "Your pantry is in excellent condition.",
      progressClass: "bg-[#2F6B3C]",
      textClass: "text-[#2F6B3C]",
      backgroundClass: "bg-green-50",
      borderClass: "border-green-200",
    };
  }

  if (health >= 70) {
    return {
      label: "Good",
      message:
        outOfStock > 0
          ? `${outOfStock} ingredient${
              outOfStock === 1 ? " is" : "s are"
            } completely out of stock.`
          : `${lowStock} ingredient${
              lowStock === 1 ? " is" : "s are"
            } running low.`,
      progressClass: "bg-[#2F6B3C]",
      textClass: "text-[#2F6B3C]",
      backgroundClass: "bg-green-50",
      borderClass: "border-green-200",
    };
  }

  if (health >= 50) {
    return {
      label: "Needs Attention",
      message:
        "Several ingredients should be restocked soon.",
      progressClass: "bg-[#D89B3C]",
      textClass: "text-[#A86516]",
      backgroundClass: "bg-yellow-50",
      borderClass: "border-yellow-200",
    };
  }

  return {
    label: "Critical",
    message:
      "Your pantry requires immediate attention.",
    progressClass: "bg-red-500",
    textClass: "text-red-700",
    backgroundClass: "bg-red-50",
    borderClass: "border-red-200",
  };
}

export default function PantryStats({
  totalItems,
  inStock,
  lowStock,
  outOfStock,
  pantryHealth,
}: PantryStatsProps) {
  const health = getHealthPresentation(
    pantryHealth,
    outOfStock,
    lowStock
  );

  const progressWidth = Math.min(
    Math.max(pantryHealth, 0),
    100
  );

  return (
    <section className="mb-5 space-y-3">
      <div
        className={`rounded-2xl border p-4 shadow-sm sm:p-5 ${health.backgroundClass} ${health.borderClass}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="text-lg"
              >
                🥗
              </span>

              <p className="text-sm font-bold text-[#5A4032]">
                Pantry Health
              </p>
            </div>

            <p
              className={`mt-2 text-sm font-semibold ${health.textClass}`}
            >
              {health.label}
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-gray-600 sm:text-sm">
              {health.message}
            </p>
          </div>

          <p
            className={`shrink-0 text-3xl font-bold sm:text-4xl ${health.textClass}`}
          >
            {pantryHealth}%
          </p>
        </div>

        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/80">
          <div
            className={`h-full rounded-full transition-all duration-300 ${health.progressClass}`}
            style={{
              width: `${progressWidth}%`,
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        <div className="rounded-xl border border-[#EADCC4] bg-white px-2 py-3 text-center shadow-sm sm:px-4 sm:py-4">
          <p className="min-h-8 text-[10px] font-semibold leading-4 text-gray-500 sm:min-h-0 sm:text-sm">
            Total Items
          </p>

          <p className="mt-1 text-xl font-bold text-[#2F6B3C] sm:text-2xl">
            {totalItems}
          </p>
        </div>

        <div className="rounded-xl border border-green-200 bg-green-50 px-2 py-3 text-center shadow-sm sm:px-4 sm:py-4">
          <p className="min-h-8 text-[10px] font-semibold leading-4 text-green-700 sm:min-h-0 sm:text-sm">
            In Stock
          </p>

          <p className="mt-1 text-xl font-bold text-green-700 sm:text-2xl">
            {inStock}
          </p>
        </div>

        <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-2 py-3 text-center shadow-sm sm:px-4 sm:py-4">
          <p className="min-h-8 text-[10px] font-semibold leading-4 text-yellow-700 sm:min-h-0 sm:text-sm">
            Running Low
          </p>

          <p className="mt-1 text-xl font-bold text-yellow-700 sm:text-2xl">
            {lowStock}
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 px-2 py-3 text-center shadow-sm sm:px-4 sm:py-4">
          <p className="min-h-8 text-[10px] font-semibold leading-4 text-red-700 sm:min-h-0 sm:text-sm">
            Out of Stock
          </p>

          <p className="mt-1 text-xl font-bold text-red-700 sm:text-2xl">
            {outOfStock}
          </p>
        </div>
      </div>
    </section>
  );
}