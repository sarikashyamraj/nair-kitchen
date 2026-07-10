import { PantryItem } from "../../types/pantry";

type PantryAlertsProps = {
  items: PantryItem[];
};

export default function PantryAlerts({ items }: PantryAlertsProps) {
  const lowStockItems = items.filter((item) => {
    const minimum = item.minQuantity ?? 1;
    return item.quantity <= minimum;
  });

  if (lowStockItems.length === 0) {
    return (
      <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
        <p className="font-semibold text-green-700">
          ✅ Pantry is well stocked
        </p>
      </div>
    );
  }

  const previewItems = lowStockItems.slice(0, 3);
  const remaining = lowStockItems.length - previewItems.length;

  return (
    <div className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-yellow-800">
          ⚠️ Running Low
        </h3>

        <span className="rounded-full bg-yellow-200 px-2 py-1 text-xs font-semibold text-yellow-800">
          {lowStockItems.length}
        </span>
      </div>

      <p className="mt-2 text-sm text-yellow-700">
        {previewItems.map((item) => item.name).join(" • ")}

        {remaining > 0 && ` • +${remaining} more`}
      </p>
    </div>
  );
}