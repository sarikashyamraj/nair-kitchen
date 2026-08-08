import {
  AlertCircle,
  CircleAlert,
} from "lucide-react";

import { PantryItem } from "../../types/pantry";
import { analyzePantry } from "../../lib/pantry/pantryAnalyzer";
import { typography } from "../../lib/theme/typography";

type PantryAlertsProps = {
  items: PantryItem[];
};

function getAttentionStatus(
  item: PantryItem
) {
  if (item.quantity <= 0) {
    return {
      label: "Out of Stock",
      className:
        "bg-red-50 text-red-600",
    };
  }

  return {
    label: "Running Low",
    className:
      "bg-amber-50 text-[#A86612]",
  };
}

export default function PantryAlerts({
  items,
}: PantryAlertsProps) {
  const summary =
    analyzePantry(items);

  if (
    summary.outOfStock === 0 &&
    summary.lowStock === 0
  ) {
    return (
      <section className="mb-5 rounded-2xl border border-green-100 bg-[#F6FBF7] p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
            <AlertCircle
              size={17}
              strokeWidth={1.9}
            />
          </div>

          <div>
            <h2
              className={`${typography.sectionTitle} text-[#245B32]`}
            >
              Inventory looks good
            </h2>

            <p
              className={`${typography.body} mt-1 text-[#6F756F]`}
            >
              Everything is above minimum stock.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const visibleItems =
    summary.attentionItems.slice(
      0,
      3
    );

  const remainingCount =
    summary.attentionItems.length -
    visibleItems.length;

  return (
    <section className="mb-5 rounded-2xl border border-[#F2D9D7] bg-[#FFF9F8] p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <CircleAlert
              size={16}
              strokeWidth={2}
            />
          </div>

          <div>
            <h2
              className={`${typography.sectionTitle} text-[#7A2F2B]`}
            >
              Needs Attention
            </h2>

            <p
              className={`${typography.caption} mt-0.5 text-[#9A7E7B]`}
            >
              Items that may need restocking
            </p>
          </div>
        </div>

        <span
          className={`${typography.badge} rounded-full bg-red-50 px-2.5 py-1 text-red-600`}
        >
          {
            summary.attentionItems
              .length
          }
        </span>
      </div>

      <div className="mt-4 divide-y divide-[#F2E2DF] rounded-xl border border-[#F2E2DF] bg-white/70">
        {visibleItems.map(
          (item) => {
            const status =
              getAttentionStatus(
                item
              );

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 px-3 py-3"
              >
                <div className="min-w-0">
                  <p
                    className={`${typography.bodyMedium} truncate text-[#4E463F]`}
                  >
                    {item.name}
                  </p>

                  <p
                    className={`${typography.caption} mt-0.5 text-[#8A8178]`}
                  >
                    {item.quantity}{" "}
                    {item.unit} available
                  </p>
                </div>

                <span
                  className={`${typography.badge} shrink-0 rounded-full px-2.5 py-1 ${status.className}`}
                >
                  {status.label}
                </span>
              </div>
            );
          }
        )}
      </div>

      {remainingCount > 0 && (
        <p
          className={`${typography.caption} mt-3 text-center font-medium text-[#8C837A]`}
        >
          +{remainingCount} more items need attention
        </p>
      )}
    </section>
  );
}