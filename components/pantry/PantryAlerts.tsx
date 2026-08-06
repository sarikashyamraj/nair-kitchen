import { PantryItem } from "../../types/pantry";
import { analyzePantry } from "../../lib/pantry/pantryAnalyzer";

type PantryAlertsProps = {
  items: PantryItem[];
};

function ItemPreview({
  items,
  total,
}: {
  items: PantryItem[];
  total: number;
}) {
  const visibleItems = items.slice(0, 2);
  const remaining =
    total - visibleItems.length;

  return (
    <div className="mt-2 space-y-1">
      {visibleItems.map((item) => (
        <p
          key={item.id}
          className="text-sm font-medium text-[#5A4032]"
        >
          • {item.name}
        </p>
      ))}

      {remaining > 0 && (
        <p className="text-sm font-semibold text-gray-500">
          +{remaining} more
        </p>
      )}
    </div>
  );
}

export default function PantryAlerts({
  items,
}: PantryAlertsProps) {
  const summary = analyzePantry(items);

  if (
    summary.outOfStock === 0 &&
    summary.lowStock === 0
  ) {
    return (
      <section className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-4 shadow-sm">
        <p className="font-bold text-green-800">
          ✅ Pantry is well stocked
        </p>

        <p className="mt-1 text-sm text-green-700">
          Everything is above minimum stock.
        </p>
      </section>
    );
  }

  return (
    <section className="mb-4 rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-bold text-red-800 sm:text-lg">
          🚨 Needs Attention
        </h2>

        <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
          {summary.attentionItems.length}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="border-r border-red-100 pr-3">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full bg-red-500"
            />

            <p className="text-sm font-bold text-red-700">
              Out of Stock ({summary.outOfStock})
            </p>
          </div>

          {summary.outOfStock > 0 ? (
            <ItemPreview
              items={
                summary.outOfStockItems
              }
              total={
                summary.outOfStock
              }
            />
          ) : (
            <p className="mt-2 text-xs text-gray-400">
              None
            </p>
          )}
        </div>

        <div className="pl-1">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full bg-yellow-500"
            />

            <p className="text-sm font-bold text-[#B66A00]">
              Running Low ({summary.lowStock})
            </p>
          </div>

          {summary.lowStock > 0 ? (
            <ItemPreview
              items={
                summary.lowStockItems
              }
              total={
                summary.lowStock
              }
            />
          ) : (
            <p className="mt-2 text-xs text-gray-400">
              None
            </p>
          )}
        </div>
      </div>
    </section>
  );
}