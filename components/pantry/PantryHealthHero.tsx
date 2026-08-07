import {
  AlertCircle,
  ArrowDown,
} from "lucide-react";

type PantryHealthHeroProps = {
  pantryHealth: number;
  lowStock: number;
  outOfStock: number;
  outOfStockNames: string[];
};

type HealthPresentation = {
  label: string;
  message: string;
  progressClass: string;
  accentClass: string;
};

function getHealthPresentation(
  pantryHealth: number,
  outOfStock: number,
  lowStock: number,
  outOfStockNames: string[]
): HealthPresentation {
  const priorityNames =
    outOfStockNames.slice(0, 2);

  if (pantryHealth >= 90) {
    return {
      label: "Excellent",
      message:
        outOfStock === 0 &&
        lowStock === 0
          ? "Everything is well stocked."
          : "Your pantry is in excellent condition.",
      progressClass: "bg-[#2F6B3C]",
      accentClass: "text-[#2F6B3C]",
    };
  }

  if (pantryHealth >= 70) {
    return {
      label: "Good",
      message:
        outOfStock > 0
          ? `Restock ${priorityNames.join(
              " and "
            )} to improve your Inventory Health.`
          : `${lowStock} ingredient${
              lowStock === 1 ? " is" : "s are"
            } running low.`,
      progressClass: "bg-[#2F6B3C]",
      accentClass: "text-[#2F6B3C]",
    };
  }

  if (pantryHealth >= 50) {
    return {
      label: "Needs Attention",
      message:
        outOfStock > 0 &&
        priorityNames.length > 0
          ? `Restock ${priorityNames.join(
              " and "
            )} to improve your Inventory Health.`
          : "Several ingredients should be restocked soon.",
      progressClass: "bg-[#D89B3C]",
      accentClass: "text-[#A86516]",
    };
  }

  return {
    label: "Critical",
    message:
      "A grocery restock is recommended to restore your pantry.",
    progressClass: "bg-red-500",
    accentClass: "text-red-700",
  };
}

export default function PantryHealthHero({
  pantryHealth,
  lowStock,
  outOfStock,
  outOfStockNames,
}: PantryHealthHeroProps) {
  const presentation =
    getHealthPresentation(
      pantryHealth,
      outOfStock,
      lowStock,
      outOfStockNames
    );

  const progressWidth = Math.min(
    Math.max(pantryHealth, 0),
    100
  );

  return (
    <section className="mb-4 overflow-hidden rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 via-white to-[#F7FBF5] p-4 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#2F6B3C] text-2xl text-white shadow-sm">
            🥗
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-bold text-[#245B32] sm:text-xl">
              Inventory Health
            </h2>

            <p
              className={`mt-1 text-sm font-bold ${presentation.accentClass}`}
            >
              {presentation.label}
            </p>
          </div>
        </div>

        <p className="shrink-0 text-4xl font-bold leading-none text-[#245B32] sm:text-5xl">
          {pantryHealth}%
        </p>
      </div>

      <p className="mt-4 text-sm leading-6 text-[#4B5563] sm:text-base">
        {presentation.message}
      </p>

      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#E4EEE2]">
        <div
          className={`h-full rounded-full transition-all duration-500 ${presentation.progressClass}`}
          style={{
            width: `${progressWidth}%`,
          }}
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-green-100 pt-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-700">
            <AlertCircle size={15} />
          </span>

          <div>
            <p className="text-sm font-bold text-[#5A4032]">
              {outOfStock}
            </p>

            <p className="text-[11px] text-gray-500 sm:text-xs">
              Out of Stock
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
            <ArrowDown size={15} />
          </span>

          <div>
            <p className="text-sm font-bold text-[#5A4032]">
              {lowStock}
            </p>

            <p className="text-[11px] text-gray-500 sm:text-xs">
              Running Low
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}