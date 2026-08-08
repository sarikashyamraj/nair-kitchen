import {
  typography,
} from "../../lib/theme/typography";

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
          : "Your inventory is in excellent condition.",

      progressClass:
        "bg-[#2F6B3C]",

      accentClass:
        "text-[#2F6B3C]",
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
          : `${lowStock} item${
              lowStock === 1
                ? " is"
                : "s are"
            } running low.`,

      progressClass:
        "bg-[#2F6B3C]",

      accentClass:
        "text-[#2F6B3C]",
    };
  }

  if (pantryHealth >= 50) {
    return {
      label:
        "Needs Attention",

      message:
        outOfStock > 0 &&
        priorityNames.length > 0
          ? `Restock ${priorityNames.join(
              " and "
            )} to improve your Inventory Health.`
          : "Several items should be restocked soon.",

      progressClass:
        "bg-[#D89B3C]",

      accentClass:
        "text-[#A86516]",
    };
  }

  return {
    label: "Critical",

    message:
      "A grocery restock is recommended to restore your inventory.",

    progressClass:
      "bg-red-500",

    accentClass:
      "text-red-700",
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

  const progressWidth =
    Math.min(
      Math.max(
        pantryHealth,
        0
      ),
      100
    );

  return (
    <section className="mb-5 rounded-2xl border border-green-100 bg-[#F8FCF8] p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF4E9] text-xl">
            🥗
          </div>

          <div className="min-w-0">
            <h2
              className={`${typography.cardTitle} text-[#245B32]`}
            >
              Inventory Health
            </h2>

            <p
              className={`${typography.bodyMedium} mt-1 ${presentation.accentClass}`}
            >
              {presentation.label}
            </p>
          </div>
        </div>

        <p
          className={`${typography.heroStat} shrink-0 text-[#245B32]`}
        >
          {pantryHealth}%
        </p>
      </div>

      <p
        className={`${typography.body} mt-4 text-[#626A64]`}
      >
        {presentation.message}
      </p>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E4EEE2]">
        <div
          className={`h-full rounded-full transition-all duration-500 ${presentation.progressClass}`}
          style={{
            width: `${progressWidth}%`,
          }}
        />
      </div>
    </section>
  );
}